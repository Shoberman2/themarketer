import { ScrapedData, WebsiteAnalysis } from "@/types/analysis";
import { generateJSON } from "./openai";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "./prompts";

export async function analyzeWebsite(
  scrapedData: ScrapedData
): Promise<WebsiteAnalysis> {
  const dataStr = JSON.stringify(scrapedData, null, 2);
  const analysis = await generateJSON<WebsiteAnalysis>(
    ANALYZE_SYSTEM_PROMPT,
    buildAnalyzePrompt(dataStr)
  );
  return analysis;
}
