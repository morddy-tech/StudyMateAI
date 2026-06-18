import { NextRequest, NextResponse } from "next/server";
import { generateLearningMaterials } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { text, actions } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text content is required for processing." },
        { status: 400 }
      );
    }

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json(
        { error: "At least one processing action must be selected." },
        { status: 400 }
      );
    }

    const data = await generateLearningMaterials(text, actions);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during processing." },
      { status: 500 }
    );
  }
}
