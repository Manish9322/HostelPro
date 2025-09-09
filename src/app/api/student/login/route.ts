
import { NextResponse } from 'next/server';
import StudentModel from '@/models/student.model';
import _db from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  await _db();
  try {
    const { studentId, password } = await request.json();

    if (!studentId || !password) {
        return NextResponse.json({ error: 'Student ID and password are required' }, { status: 400 });
    }

    const student = await StudentModel.findOne({ studentId });
    
    if (!student) {
      return NextResponse.json({ error: 'Invalid Student ID or password' }, { status: 401 });
    }

    // In a real app, you should hash passwords. Here we do a simple comparison.
    if (student.password === password) {
      const token = uuidv4(); // This would be a real JWT in production
      // We are not storing the token on the server for this stateless example
      return NextResponse.json({ success: true, token, studentId: student.studentId });
    } else {
      return NextResponse.json({ error: 'Invalid Student ID or password' }, { status: 401 });
    }

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
