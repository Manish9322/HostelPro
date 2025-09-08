import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, trim: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending',
    required: true
  }
}, { timestamps: true });

const FeePaymentModel = mongoose.models.FeePayment || mongoose.model("FeePayment", feePaymentSchema);

export default FeePaymentModel;
