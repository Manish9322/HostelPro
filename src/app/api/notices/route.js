import _db from "@/utils/db";
import NoticeModel from "@/models/notice.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const notices = await NoticeModel.find({});
  return NextResponse.json(notices);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newNotice = new NoticeModel(body);
  const savedNotice = await newNotice.save();
  return NextResponse.json(savedNotice, { status: 201 });
}
