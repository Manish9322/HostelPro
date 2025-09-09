
import _db from "@/utils/db";
import NoticeModel from "@/models/notice.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const notices = await NoticeModel.find({}).sort({ order: 1, featured: -1, publishedAt: -1 });
  return NextResponse.json(notices);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  
  if (body.featured) {
    // Un-feature all other notices
    await NoticeModel.updateMany({ featured: true }, { $set: { featured: false } });
  }

  // Assign order
  const count = await NoticeModel.countDocuments();
  body.order = count;

  const newNotice = new NoticeModel(body);
  const savedNotice = await newNotice.save();
  return NextResponse.json(savedNotice, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        if (body.featured) {
            // Un-feature all other notices
            await NoticeModel.updateMany({ _id: { $ne: id }, featured: true }, { $set: { featured: false } });
        }
        
        const updatedNotice = await NoticeModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedNotice) {
            return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
        }
        return NextResponse.json(updatedNotice);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedNotice = await NoticeModel.findByIdAndDelete(id);
        if (!deletedNotice) {
            return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
