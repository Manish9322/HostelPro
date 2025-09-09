
import _db from "@/utils/db";
import InquiryModel from "@/models/inquiry.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await _db();
    const { studentId, studentName, subject, text, inquiryType } = await req.json();

    if (!studentId || !studentName || !subject || !text || !inquiryType) {
      return NextResponse.json({ error: 'Missing required inquiry fields.' }, { status: 400 });
    }
    
    // Simplified: Directly save the inquiry without AI analysis
    const newInquiry = new InquiryModel({
      studentId,
      studentName,
      subject,
      text,
      category: inquiryType,
      status: 'Pending',
      // AI fields like summary and urgency are no longer set here
    });
    
    await newInquiry.save();

    return NextResponse.json({ message: 'Inquiry submitted successfully' });

  } catch (error) {
    console.error('Error in inquiry submission route:', error);
    return NextResponse.json({ 
        error: 'Failed to submit inquiry on the server.', 
        details: error.message 
    }, { status: 500 });
  }
}
