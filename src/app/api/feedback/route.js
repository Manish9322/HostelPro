
import _db from "@/utils/db";
import FeedbackModel from "@/models/feedback.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const feedback = await FeedbackModel.find({}).sort({ createdAt: -1 });
  return NextResponse.json(feedback);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  try {
    const newFeedback = new FeedbackModel(body);
    const savedFeedback = await newFeedback.save();
    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedFeedback = await FeedbackModel.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

    