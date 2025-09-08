import _db from "@/utils/db";
import StudentModel from "@/models/student.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const students = await StudentModel.find({});
  return NextResponse.json(students);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newStudent = new StudentModel(body);
  const savedStudent = await newStudent.save();
  return NextResponse.json(savedStudent, { status: 201 });
}
