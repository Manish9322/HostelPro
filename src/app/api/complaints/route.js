
import _db from "@/utils/db";
import ComplaintModel from "@/models/complaint.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  await _db();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  
  const query = studentId ? { studentId } : {};

  const complaints = await ComplaintModel.find(query).sort({ submittedAt: -1 });
  return NextResponse.json(complaints);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newComplaint = new ComplaintModel(body);
  const savedComplaint = await newComplaint.save();
  return NextResponse.json(savedComplaint, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedComplaint = await ComplaintModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedComplaint) {
            return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
        }
        return NextResponse.json(updatedComplaint);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
