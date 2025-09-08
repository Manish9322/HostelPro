
import _db from "@/utils/db";
import ApplicationModel from "@/models/application.model";
import { NextResponse } from "next/server";
import { saveImage } from "@/utils/file-manager";

export async function GET() {
  await _db();
  const applications = await ApplicationModel.find({}).sort({ submittedAt: -1 });
  return NextResponse.json(applications);
}

export async function POST(request) {
  await _db();
  const formData = await request.formData();
  
  const applicationData = {};
  const roommatePreferences = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('roommatePreferences[')) {
      const prefKey = key.match(/\[(.*?)\]/)[1];
      roommatePreferences[prefKey] = value;
    } else {
      applicationData[key] = value;
    }
  }

  if (Object.keys(roommatePreferences).length > 0) {
    applicationData.roommatePreferences = roommatePreferences;
  }

  const profilePhotoFile = formData.get('profilePhoto');
  const studentIdCardFile = formData.get('studentIdCard');

  try {
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      applicationData.profilePhoto = await saveImage(profilePhotoFile, 'photos');
    }
    if (studentIdCardFile && studentIdCardFile.size > 0) {
      applicationData.studentIdCard = await saveImage(studentIdCardFile, 'documents');
    }
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: 'Failed to save uploaded files' }, { status: 500 });
  }

  try {
    const newApplication = new ApplicationModel(applicationData);
    const savedApplication = await newApplication.save();
    return NextResponse.json(savedApplication, { status: 201 });
  } catch (error) {
    console.error("Database save error:", error);
    // Provide more specific error for unique key violation
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ error: `An application with this ${field} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to save application to database', details: error.message }, { status: 500 });
  }
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

    