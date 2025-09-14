
import _db from "@/utils/db";
import FeePaymentModel from "@/models/feePayment.model";
import { NextResponse } from "next/server";
import RoomModel from "@/models/room.model";
import StudentModel from "@/models/student.model";
import UtilityModel from "@/models/utility.model";
import { format } from "date-fns";

export async function GET(request) {
  await _db();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  const query = studentId ? { studentId } : {};
  
  if (studentId) {
    const today = new Date();
    const currentMonth = format(today, 'MMMM yyyy');

    let existingPayment = await FeePaymentModel.findOne({ studentId, month: currentMonth });

    if (!existingPayment) {
        const student = await StudentModel.findOne({ studentId: studentId });
        
        if (student && student.roomNumber !== 'Unassigned') {
            const room = await RoomModel.findOne({ roomNumber: student.roomNumber });
            const utilities = await UtilityModel.find({});

            if(room) {
              const utilitiesTotal = room.utilities.reduce((total, utilityName) => {
                  const utilityDetail = utilities.find(u => u.name === utilityName);
                  return total + (utilityDetail ? utilityDetail.price : 0);
              }, 0);
              const totalRent = room.rent + utilitiesTotal;

              const newPayment = new FeePaymentModel({
                  studentName: student.name,
                  studentId: student.studentId,
                  month: currentMonth,
                  amount: totalRent,
                  dueDate: new Date(today.getFullYear(), today.getMonth(), 5), 
                  status: 'Pending'
              });
              await newPayment.save();
            }
        }
    }
  }

  const feePayments = await FeePaymentModel.find(query).sort({ dueDate: -1 });
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
