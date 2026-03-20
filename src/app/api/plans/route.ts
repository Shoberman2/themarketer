import { NextRequest, NextResponse } from "next/server";
import { listPlans, getPlan, deletePlan } from "@/lib/db/queries";

export async function GET() {
  try {
    const plans = listPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("List plans error:", error);
    return NextResponse.json(
      { error: "Failed to list plans" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("id");
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID required" },
        { status: 400 }
      );
    }

    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    deletePlan(planId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete plan error:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
