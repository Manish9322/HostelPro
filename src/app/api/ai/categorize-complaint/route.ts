
import { categorizeComplaint } from '@/ai/flows/categorize-complaints';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { complaintSubject, complaintText } = await req.json();

    if (!complaintSubject || !complaintText) {
      return NextResponse.json({ error: 'Subject and text are required.' }, { status: 400 });
    }

    const result = await categorizeComplaint({ complaintSubject, complaintText });
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI categorization error:', error);
    return NextResponse.json({ error: 'Failed to categorize complaint.' }, { status: 500 });
  }
}
