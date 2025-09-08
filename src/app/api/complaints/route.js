import _db from "@/utils/db";
import ComplaintModel from "@/models/complaint.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const complaints = await ComplaintModel.find({});
  return NextResponse.json(complaints);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newComplaint = new ComplaintModel(body);
  const savedComplaint = await newComplaint.save();
  return NextResponse.json(savedComplaint, { status: 201 });
}
