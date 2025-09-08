import _db from "@/utils/db";
import ApplicationModel from "@/models/application.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const applications = await ApplicationModel.find({});
  return NextResponse.json(applications);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newApplication = new ApplicationModel(body);
  const savedApplication = await newApplication.save();
  return NextResponse.json(savedApplication, { status: 201 });
}
