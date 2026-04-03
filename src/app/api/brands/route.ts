import { NextRequest, NextResponse } from "next/server";
import { listBrands, createBrand } from "@/lib/db/queries";
import { z } from "zod";

export async function GET() {
  try {
    const brands = listBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("List brands error:", error);
    return NextResponse.json({ error: "Failed to list brands" }, { status: 500 });
  }
}

const CreateSchema = z.object({
  url: z.string(),
  analysis: z.any(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, analysis } = CreateSchema.parse(body);
    const brandId = createBrand(url, analysis);
    return NextResponse.json({ brandId });
  } catch (error) {
    console.error("Create brand error:", error);
    const message = error instanceof Error ? error.message : "Failed to create brand";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
