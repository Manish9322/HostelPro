
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

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedItem = await InventoryItemModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedItem) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedItem = await InventoryItemModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
