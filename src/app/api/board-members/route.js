import _db from "@/utils/db";
import BoardMemberModel from "@/models/boardMember.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const boardMembers = await BoardMemberModel.find({});
  return NextResponse.json(boardMembers);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newBoardMember = new BoardMemberModel(body);
  const savedBoardMember = await newBoardMember.save();
  return NextResponse.json(savedBoardMember, { status: 201 });
}
