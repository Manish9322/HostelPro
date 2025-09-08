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

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedBoardMember = await BoardMemberModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedBoardMember) {
            return NextResponse.json({ error: 'Board member not found' }, { status: 404 });
        }
        return NextResponse.json(updatedBoardMember);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedBoardMember = await BoardMemberModel.findByIdAndDelete(id);
        if (!deletedBoardMember) {
            return NextResponse.json({ error: 'Board member not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Board member deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
