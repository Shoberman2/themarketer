import { NextRequest, NextResponse } from "next/server";
import { updatePerformanceReport } from "@/lib/db/queries";
import { z } from "zod";

const UpdateSchema = z.object({
  likes: z.number().int().min(0).optional(),
  comments: z.number().int().min(0).optional(),
  shares: z.number().int().min(0).optional(),
  reach: z.number().int().min(0).nullable().optional(),
  userNotes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = UpdateSchema.parse(body);
    updatePerformanceReport(id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update performance report error:", error);
    const message = error instanceof Error ? error.message : "Failed to update report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
