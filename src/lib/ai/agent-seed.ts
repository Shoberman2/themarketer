import { getBrand } from "@/lib/db/queries";
import { getMemory, upsertMemory } from "@/lib/db/agent-queries";
import { getDb } from "@/lib/db";
import { WebsiteAnalysis } from "@/types/analysis";

export function seedBrandMemories(brandId: string): void {
  // Skip if already seeded
  if (getMemory(brandId, "/context.md")) return;

  const brand = getBrand(brandId);
  if (!brand) return;

  // Try to get full analysis from the brands table
  const db = getDb();
  const row = db
    .prepare("SELECT analysis FROM brands WHERE id = ?")
    .get(brandId) as { analysis: string } | undefined;

  let analysis: WebsiteAnalysis | null = null;
  if (row?.analysis) {
    try {
      analysis = JSON.parse(row.analysis);
    } catch {
      // ignore
    }
  }

  // Seed /context.md
  const contextParts: string[] = [
    `# ${brand.name}`,
    ``,
    `**Industry:** ${brand.industry || "Unknown"}`,
    `**URL:** ${brand.url}`,
    `**Tone:** ${brand.tone || "Professional"}`,
    `**Colors:** Primary ${brand.primaryColor || "N/A"}, Secondary ${brand.secondaryColor || "N/A"}, Accent ${brand.accentColor || "N/A"}`,
  ];

  if (analysis) {
    if (analysis.valuePropositions?.length) {
      contextParts.push("", "**Value Propositions:**");
      analysis.valuePropositions.forEach((vp) => contextParts.push(`- ${vp}`));
    }
    if (analysis.targetAudience?.length) {
      contextParts.push("", "**Target Audience:**");
      analysis.targetAudience.forEach((ta) => contextParts.push(`- ${ta}`));
    }
    if (analysis.competitiveAdvantages?.length) {
      contextParts.push("", "**Competitive Advantages:**");
      analysis.competitiveAdvantages.forEach((ca) =>
        contextParts.push(`- ${ca}`)
      );
    }
    if (analysis.callToAction) {
      contextParts.push("", `**Primary CTA:** ${analysis.callToAction}`);
    }
  }

  upsertMemory(brandId, "/context.md", contextParts.join("\n"), "seed");

  // Seed /voice.md
  const voiceParts: string[] = [
    `# Brand Voice: ${brand.name}`,
    ``,
    `**Tone:** ${brand.tone || "Professional yet approachable"}`,
    `**Industry:** ${brand.industry || "General"}`,
    ``,
    `## Guidelines`,
    `- Match the brand's established tone in all content`,
    `- Use language appropriate for the target audience`,
    `- Maintain consistency with existing brand messaging`,
  ];

  if (analysis?.brand?.tagline) {
    voiceParts.push("", `**Tagline:** "${analysis.brand.tagline}"`);
  }

  upsertMemory(brandId, "/voice.md", voiceParts.join("\n"), "seed");
}
