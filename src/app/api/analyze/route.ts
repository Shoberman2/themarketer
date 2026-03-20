import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { analyzeWebsite } from "@/lib/ai/analyze-website";
import { z } from "zod";

const RequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = RequestSchema.parse(body);

    const scrapedData = await scrapeWebsite(url);
    const analysis = await analyzeWebsite(scrapedData);

    return NextResponse.json({ analysis, scrapedData });
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze website";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
