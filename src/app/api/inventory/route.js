import _db from "@/utils/db";
import InventoryItemModel from "@/models/inventory.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const inventoryItems = await InventoryItemModel.find({});
  return NextResponse.json(inventoryItems);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newInventoryItem = new InventoryItemModel(body);
  const savedInventoryItem = await newInventoryItem.save();
  return NextResponse.json(savedInventoryItem, { status: 201 });
}
