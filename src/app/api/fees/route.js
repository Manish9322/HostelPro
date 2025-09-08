import _db from "@/utils/db";
import FeePaymentModel from "@/models/feePayment.model";
import { NextResponse } from "next/server";

export async function GET() {
  await _db();
  const feePayments = await FeePaymentModel.find({});
  return NextResponse.json(feePayments);
}

export async function POST(request) {
  await _db();
  const body = await request.json();
  const newFeePayment = new FeePaymentModel(body);
  const savedFeePayment = await newFeePayment.save();
  return NextResponse.json(savedFeePayment, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    try {
        const updatedPayment = await FeePaymentModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedPayment) {
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
        }
        return NextResponse.json(updatedPayment);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedPayment = await FeePaymentModel.findByIdAndDelete(id);
        if (!deletedPayment) {
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Payment record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
