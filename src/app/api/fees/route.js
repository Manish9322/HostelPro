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
