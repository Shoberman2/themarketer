import { NextResponse } from "next/server";
import {
  upsertMemory,
  updateBriefAction,
  countMemoriesByPrefix,
  listMemories,
} from "@/lib/db/agent-queries";
import { getBrand } from "@/lib/db/queries";
import { generateClaudeText } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const { brandId, briefId, action, originalContent, editedContent, rejectReason } =
      await request.json();

    if (!brandId || !briefId || !action) {
      return NextResponse.json(
        { error: "brandId, briefId, and action required" },
        { status: 400 }
      );
    }

    if (!["approved", "edited", "rejected"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const now = new Date().toISOString().split("T")[0];
    const slug = (originalContent?.headline || "content")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);

    if (action === "approved" && originalContent) {
      // Store approved content as memory
      const memoryContent = [
        `# Approved: ${originalContent.headline}`,
        `**Platform:** ${originalContent.platform}`,
        `**Template:** ${originalContent.template}`,
        `**Angle:** ${originalContent.messageAngle}`,
        "",
        `**Headline:** ${originalContent.headline}`,
        `**Subheadline:** ${originalContent.subheadline}`,
        `**Body:** ${originalContent.body}`,
        `**CTA:** ${originalContent.cta}`,
      ].join("\n");

      upsertMemory(brandId, `/approved/${now}-${slug}.md`, memoryContent, "user-feedback");
    }

    if (action === "edited" && originalContent && editedContent) {
      // Store the edit diff as feedback
      const diffParts: string[] = [`# Edit: ${now}`];
      for (const key of ["headline", "subheadline", "body", "cta"] as const) {
        if (originalContent[key] !== editedContent[key]) {
          diffParts.push(
            `**${key}:**`,
            `- Original: ${originalContent[key]}`,
            `+ Edited: ${editedContent[key]}`
          );
        }
      }

      upsertMemory(brandId, `/feedback/${now}-${slug}.md`, diffParts.join("\n"), "user-feedback");

      // Also store the edited version as approved
      const approvedContent = [
        `# Approved (edited): ${editedContent.headline}`,
        `**Platform:** ${originalContent.platform}`,
        `**Template:** ${originalContent.template}`,
        "",
        `**Headline:** ${editedContent.headline}`,
        `**Subheadline:** ${editedContent.subheadline}`,
        `**Body:** ${editedContent.body}`,
        `**CTA:** ${editedContent.cta}`,
      ].join("\n");

      upsertMemory(brandId, `/approved/${now}-${slug}.md`, approvedContent, "user-feedback");
    }

    if (action === "rejected") {
      const rejectContent = [
        `# Rejected: ${now}`,
        `**Content:** ${originalContent?.headline || "Unknown"}`,
        `**Platform:** ${originalContent?.platform || "Unknown"}`,
        rejectReason ? `**Reason:** ${rejectReason}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      upsertMemory(brandId, `/feedback/${now}-reject-${slug}.md`, rejectContent, "user-feedback");
    }

    // Update brief action
    updateBriefAction(briefId, action, action === "edited" ? editedContent : undefined);

    // Check if voice distillation is needed (every 5 feedback entries)
    const feedbackCount = countMemoriesByPrefix(brandId, "/feedback/");
    const approvedCount = countMemoriesByPrefix(brandId, "/approved/");
    const totalInteractions = feedbackCount + approvedCount;

    let distilled = false;
    if (totalInteractions > 0 && totalInteractions % 5 === 0) {
      // Trigger voice distillation
      try {
        await distillVoice(brandId);
        distilled = true;
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({ success: true, distilled });
  } catch (err) {
    console.error("Agent feedback error:", err);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

async function distillVoice(brandId: string): Promise<void> {
  const brand = getBrand(brandId);
  if (!brand) return;

  const approved = listMemories(brandId, "/approved/").slice(0, 10);
  const feedback = listMemories(brandId, "/feedback/").slice(0, 10);
  const currentVoice = listMemories(brandId, "/voice.md");

  const context = [
    "Current voice profile:",
    currentVoice[0]?.content || "No voice profile yet.",
    "",
    "Recent approved content:",
    ...approved.map((m) => m.content),
    "",
    "Recent edit feedback:",
    ...feedback.map((m) => m.content),
  ].join("\n");

  const newVoice = await generateClaudeText(
    `You are a brand voice analyst. Analyze the approved content and edit patterns to extract the brand's voice preferences. Be specific about patterns you observe (e.g., "user consistently removes exclamation marks", "prefers Oxford comma", "rejects urgency framing"). Output a concise brand voice guide in markdown.`,
    `Distill the voice profile for ${brand.name} based on their content feedback:\n\n${context}`
  );

  upsertMemory(brandId, "/voice.md", newVoice, "agent");
}
