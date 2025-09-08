import _db from "@/utils/db";
import RoomModel from "@/models/room.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const rooms = await RoomModel.find({});
  return NextResponse.json(rooms);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newRoom = new RoomModel(body);
  const savedRoom = await newRoom.save();
  return NextResponse.json(savedRoom, { status: 201 });
}
