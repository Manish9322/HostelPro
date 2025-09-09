
import _db from "@/utils/db";
import InquiryModel from "@/models/inquiry.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const inquiries = await InquiryModel.find({}).sort({ submittedAt: -1 });
  return NextResponse.json(inquiries);
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedInquiry = await InquiryModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedInquiry) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        return NextResponse.json(updatedInquiry);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
