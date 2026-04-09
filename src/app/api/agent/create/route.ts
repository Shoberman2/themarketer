import { NextResponse } from "next/server";
import { getBrand } from "@/lib/db/queries";
import { generateClaudeJSON } from "@/lib/ai/claude";
import { assembleContentPrompt } from "@/lib/ai/prompt-assembler";
import { seedBrandMemories } from "@/lib/ai/agent-seed";
import { VALID_TEMPLATES, PLATFORM_SIZES } from "@/types/recommendation";
import { AdTemplate } from "@/types/plan";

interface AgentContent {
  headline: string;
  subheadline: string;
  body: string;
  cta: string;
  platform: string;
  template: string;
  messageAngle: string;
  confidence: number;
  reasoning: string;
}

export async function POST(request: Request) {
  try {
    const { brandId } = await request.json();
    if (!brandId) {
      return NextResponse.json({ error: "brandId required" }, { status: 400 });
    }

    const brand = getBrand(brandId);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Auto-seed memories if first call
    seedBrandMemories(brandId);

    const systemPrompt = assembleContentPrompt(brand, brandId);
    const content = await generateClaudeJSON<AgentContent>(
      systemPrompt,
      `Generate one piece of marketing content for ${brand.name} to post today. Consider the brand context, performance history, and campaign arc phase.`
    );

    // Validate template
    if (!VALID_TEMPLATES.includes(content.template as AdTemplate)) {
      content.template = "hero-cta";
    }

    // Validate platform and get ad size
    const adSize = PLATFORM_SIZES[content.platform] || {
      width: 1080,
      height: 1080,
      label: "Square",
    };

    // Clamp confidence
    content.confidence = Math.max(
      1,
      Math.min(10, Math.round(content.confidence || 5))
    );

    return NextResponse.json({ content, adSize });
  } catch (err) {
    console.error("Agent create error:", err);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
