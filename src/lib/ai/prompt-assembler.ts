import { listMemories, getOrCreateArc } from "@/lib/db/agent-queries";
import { getInsights } from "@/lib/db/agent-queries";
import { Brand } from "@/types/brand";

const MAX_MEMORY_CHARS = 24000; // ~8K tokens

// Priority order for memory paths
const MEMORY_PRIORITY: string[] = [
  "/voice.md",
  "/style-guide.md",
  "/context.md",
  "/strategy/current-arc.md",
  "/performance/analysis/",
  "/approved/",
  "/feedback/",
];

function getPriority(path: string): number {
  for (let i = 0; i < MEMORY_PRIORITY.length; i++) {
    if (path === MEMORY_PRIORITY[i] || path.startsWith(MEMORY_PRIORITY[i])) {
      return i;
    }
  }
  return MEMORY_PRIORITY.length;
}

export function assembleSystemPrompt(brand: Brand, brandId: string): string {
  const memories = listMemories(brandId);
  const arc = getOrCreateArc(brandId);
  const insights = getInsights(undefined, 5);

  // Sort memories by priority, then by recency within same priority
  const sorted = [...memories].sort((a, b) => {
    const pa = getPriority(a.path);
    const pb = getPriority(b.path);
    if (pa !== pb) return pa - pb;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Build memory section within token budget
  let memorySection = "";
  let charCount = 0;

  for (const mem of sorted) {
    const entry = `### ${mem.path}\n${mem.content}\n\n`;
    if (charCount + entry.length > MAX_MEMORY_CHARS) break;
    memorySection += entry;
    charCount += entry.length;
  }

  // Build portfolio insights section
  let insightsSection = "";
  if (insights.length > 0) {
    insightsSection = insights
      .map((i) => `- ${i.type}: ${i.key} — ${JSON.stringify(i.value)}`)
      .join("\n");
  }

  // Calculate days in phase
  const phaseStarted = new Date(arc.phaseStartedAt);
  const daysInPhase = Math.max(
    1,
    Math.floor((Date.now() - phaseStarted.getTime()) / 86400000)
  );

  return `You are a marketing agent for ${brand.name}.
You are an expert at creating on-brand content that performs.
You sound like a senior marketing strategist reviewing a report, not a chatbot cheerleading.
Be specific, data-driven, and actionable. Never use generic praise like "Great job!" or "Keep it up!"

BRAND CONTEXT:
${memorySection || "No memories yet. This is a new brand."}

${insightsSection ? `PORTFOLIO INSIGHTS (cross-brand patterns):\n${insightsSection}\n` : ""}
CAMPAIGN ARC:
Current phase: ${arc.currentPhase}. Phase started: ${daysInPhase} days ago. Reports in phase: ${arc.phaseReportCount}.
Agent recommendation: ${arc.agentRecommendation || "Stay the course."}

VOICE RULES:
- Sound like a senior marketing strategist, not a chatbot
- Be specific: name the platform, template, angle, timing pattern
- Use numbers: "2.3x outperformance" not "significantly better"
- Be actionable: end with what to test or change next
- Max 280 characters for commentary
- Never use exclamation marks in commentary`;
}

export function assembleContentPrompt(brand: Brand, brandId: string): string {
  return `${assembleSystemPrompt(brand, brandId)}

CONTENT GENERATION RULES:
- Generate content that matches the brand's voice and tone
- Pick the best platform, template, and message angle based on performance history
- Include a confidence score (1-10) based on how much data you have
- Return valid JSON only

Return a JSON object with this structure:
{
  "headline": "The main headline text",
  "subheadline": "Supporting text",
  "body": "Body copy (2-3 sentences max)",
  "cta": "Call to action text",
  "platform": "Instagram|Facebook|LinkedIn|Twitter / X|TikTok",
  "template": "hero-cta|testimonial|urgency-offer|social-post|stats-banner|feature-grid|problem-solution|ugc-style|case-study|before-after",
  "messageAngle": "social-proof|price|quality|urgency|features",
  "confidence": 7,
  "reasoning": "One sentence explaining why this content today"
}`;
}

export function assembleBriefPrompt(brand: Brand, brandId: string): string {
  return `${assembleSystemPrompt(brand, brandId)}

MORNING BRIEF GENERATION:
Generate a daily marketing brief for this brand. Include:
1. One content recommendation (the best thing to post today)
2. Performance summary commentary (if data available)
3. Campaign arc assessment

Return a JSON object:
{
  "content_recommendation": {
    "headline": "string",
    "subheadline": "string",
    "body": "string (2-3 sentences)",
    "cta": "string",
    "template": "string (valid template name)",
    "platform": "string",
    "confidence": 1-10,
    "reasoning": "Why this content today (one sentence)"
  },
  "performance_summary": {
    "agent_commentary": "string (max 280 chars, strategic analyst voice)"
  },
  "campaign_arc": {
    "phase_recommendation": "string or null"
  }
}`;
}

export function assembleAnalysisPrompt(brand: Brand, brandId: string): string {
  return `${assembleSystemPrompt(brand, brandId)}

PERFORMANCE ANALYSIS:
Analyze the provided performance report data. Generate:
1. Strategic commentary (max 280 chars) about what the data reveals
2. An updated strategy recommendation for the campaign arc
3. Any pattern insights worth noting

Return a JSON object:
{
  "commentary": "string (max 280 chars, analyst voice)",
  "strategy_update": "string (recommendation for next content direction)",
  "phase_recommendation": "stay|transition",
  "next_phase": "awareness|consideration|conversion|retention (only if phase_recommendation is transition)",
  "pattern_insights": [
    { "type": "template_perf|platform_perf|timing_perf|angle_perf", "key": "string", "observation": "string" }
  ]
}`;
}
