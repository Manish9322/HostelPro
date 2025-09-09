
import _db from "@/utils/db";
import { NextResponse } from "next/server";
import { processInquiry } from '@/ai/flows/process-inquiry-flow';
import InquiryModel from '@/models/inquiry.model';
import InventoryItemModel from '@/models/inventory.model';

export async function POST(req) {
  try {
    await _db();
    const { studentId, studentName, subject, text, inquiryType, currentRoom } = await req.json();

    if (!studentId || !studentName || !subject || !text || !inquiryType || !currentRoom) {
      return NextResponse.json({ error: 'Missing required inquiry fields.' }, { status: 400 });
    }
    
    // Fetch available inventory items only if the inquiry type is 'Item Request'
    let availableItems = [];
    if (inquiryType === 'Item Request') {
      const inventory = await InventoryItemModel.find({ 
          status: 'In Stock',
          category: { $nin: ['Appliance', 'Safety'] } 
      }).lean(); // Use .lean() for faster, plain JS objects
      availableItems = inventory.map(item => item.name);
    }

    const aiInput = {
      inquiryType,
      subject,
      text,
      availableItems,
      currentRoom
    };

    const result = await processInquiry(aiInput);
    
    const newInquiry = new InquiryModel({
      studentId,
      studentName,
      subject,
      text,
      status: 'Pending', // Explicitly set default status
      ...result,
    });
    await newInquiry.save();

    return NextResponse.json({ message: 'Inquiry submitted successfully', analysis: result });

  } catch (error) {
    console.error('Error in inquiry processing route:', error);
    // Provide a more detailed server error for debugging
    return NextResponse.json({ 
        error: 'Failed to process inquiry on the server.', 
        details: error.message 
    }, { status: 500 });
  }
}
