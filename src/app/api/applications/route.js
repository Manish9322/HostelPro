import _db from "@/utils/db";
import ApplicationModel from "@/models/application.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const applications = await ApplicationModel.find({}).sort({ submittedAt: -1 });
  return NextResponse.json(applications);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newApplication = new ApplicationModel(body);
  const savedApplication = await newApplication.save();
  return NextResponse.json(savedApplication, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedApplication = await ApplicationModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }
        return NextResponse.json(updatedApplication);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
