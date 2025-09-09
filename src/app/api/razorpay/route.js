
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import crypto from "crypto";
import FeePaymentModel from "@/models/feePayment.model";
import _db from "@/utils/db";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    await _db();
    const { amount, paymentId } = await request.json();

    const payment_capture = 1;
    const totalAmount = amount * 100; // Amount in smallest currency unit

    const options = {
        amount: totalAmount.toString(),
        currency: "INR",
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await instance.orders.create(options);
        
        // Save the order ID to the payment document
        await FeePaymentModel.findByIdAndUpdate(paymentId, {
            razorpay_order_id: response.id
        });

        return NextResponse.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
    }
}


export async function PUT(request) {
    await _db();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = await request.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        await FeePaymentModel.findByIdAndUpdate(paymentId, {
            status: 'Paid',
            razorpay_payment_id,
            razorpay_signature
        });
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
    }
}
