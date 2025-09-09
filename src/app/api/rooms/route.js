
import _db from "@/utils/db";
import RoomModel from "@/models/room.model";
import StudentModel from "@/models/student.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const rooms = await RoomModel.find({}).sort({ roomNumber: 1 });
  return NextResponse.json(rooms);
}

export async function POST(request) {
  await _db();
  const body = await request.json();

  const newRoom = new RoomModel(body);
  try {
      const savedRoom = await newRoom.save();
      return NextResponse.json(savedRoom, { status: 201 });
  } catch(error) {
      if (error.code === 11000) {
          return NextResponse.json({ error: `A room with number "${body.roomNumber}" already exists.` }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedRoom = await RoomModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedRoom) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }
        return NextResponse.json(updatedRoom);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedRoom = await RoomModel.findByIdAndDelete(id);
        if (!deletedRoom) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Room deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
