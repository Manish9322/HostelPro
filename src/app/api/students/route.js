
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
  try {
    const newStudent = new StudentModel(body);
    const savedStudent = await newStudent.save();
    return NextResponse.json(savedStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedStudent) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json(updatedStudent);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedStudent = await StudentModel.findByIdAndDelete(id);
        if (!deletedStudent) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
