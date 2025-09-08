
import _db from "@/utils/db";
import SettingModel from "@/models/setting.model";
import { NextResponse } from "next/server";

// GET handler to fetch settings. It uses findOne to get the single settings document.
export async function GET() {
  await _db();
  let settings = await SettingModel.findOne({});
  if (!settings) {
    // If no settings exist, create the first one with default values.
    settings = await new SettingModel().save();
  }
  return NextResponse.json(settings);
}

// POST handler to create or update settings.
export async function POST(request) {
  await _db();
  const body = await request.json();
  // Use findOneAndUpdate with upsert:true to either update the existing settings
  // document or create a new one if it doesn't exist.
  const updatedSettings = await SettingModel.findOneAndUpdate(
    {}, // An empty filter will match the first document found
    { $set: body },
    { new: true, upsert: true, runValidators: true }
  );
  return NextResponse.json(updatedSettings, { status: 200 });
}
