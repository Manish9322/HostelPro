
import _db from "@/utils/db";
import UtilityModel from "@/models/utility.model";
import { NextResponse } from "next/server";

// GET all utilities
export async function GET() {
  await _db();
  const utilities = await UtilityModel.find({});
  return NextResponse.json(utilities);
}

// POST a new utility
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newUtility = new UtilityModel(body);
    const savedUtility = await newUtility.save();
    return NextResponse.json(savedUtility, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A utility with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT (update) an existing utility
export async function PUT(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        
        const updatedUtility = await UtilityModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        
        if (!updatedUtility) {
            return NextResponse.json({ error: 'Utility not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedUtility);
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'A utility with this name already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


// DELETE a utility
export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        const deletedUtility = await UtilityModel.findByIdAndDelete(id);
        
        if (!deletedUtility) {
            return NextResponse.json({ error: 'Utility not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Utility deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
