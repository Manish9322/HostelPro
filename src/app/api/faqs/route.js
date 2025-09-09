
import _db from "@/utils/db";
import FaqModel from "@/models/faq.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const faqs = await FaqModel.find({}).sort({ order: 1 });
  return NextResponse.json(faqs);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  
  // Assign order to be the last
  const count = await FaqModel.countDocuments();
  body.order = count;

  const newFaq = new FaqModel(body);
  const savedFaq = await newFaq.save();
  return NextResponse.json(savedFaq, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        // Only update fields that are passed in the body
        const updatedFaq = await FaqModel.findByIdAndUpdate(id, { $set: body }, { new: true });
        if (!updatedFaq) {
            return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json(updatedFaq);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedFaq = await FaqModel.findByIdAndDelete(id);
        if (!deletedFaq) {
            return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
