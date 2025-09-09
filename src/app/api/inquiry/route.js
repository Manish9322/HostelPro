
import { processInquiry } from '@/ai/flows/process-inquiry-flow';
import { NextResponse } from 'next/server';
import InventoryItemModel from '@/models/inventory.model';
import _db from '@/utils/db';

export async function POST(req) {
  await _db();
  try {
    const { studentId, studentName, subject, text } = await req.json();

    if (!subject || !text) {
      return NextResponse.json({ error: 'Subject and text are required.' }, { status: 400 });
    }
    
    // Fetch available inventory items
    const inventory = await InventoryItemModel.find({ 
        status: 'In Stock',
        category: { $nin: ['Appliance', 'Safety'] }
    });
    const availableItems = inventory.map(item => item.name);

    const result = await processInquiry({ 
        subject, 
        text,
        availableItems,
    });
    
    // Here you would typically save the inquiry to a new "Inquiries" collection in your database.
    // For this demo, we'll just return the AI's analysis.
    // Example save logic:
    // const newInquiry = new InquiryModel({
    //   studentId,
    //   studentName,
    //   subject,
    //   text,
    //   ...result,
    // });
    // await newInquiry.save();

    return NextResponse.json({ message: 'Inquiry submitted', analysis: result });
  } catch (error) {
    console.error('Inquiry processing error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry.' }, { status: 500 });
  }
}
