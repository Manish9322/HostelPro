
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { FeePayment } from "@/lib/types";

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
  onSubmit: (data: Omit<FeePayment, '_id' | 'id'>) => void;
}

export function FeePaymentModal({ isOpen, onClose, payment, onSubmit }: FeePaymentModalProps) {
  const isEditMode = !!payment;
  const title = isEditMode ? "Edit Payment" : "Log New Payment";
  const description = isEditMode ? "Update the details of the payment record." : "Enter the details for the new payment record.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as Omit<FeePayment, '_id' | 'id'>;
    data.amount = Number(data.amount);
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentName" className="text-right">Student Name</Label>
              <Input id="studentName" name="studentName" defaultValue={payment?.studentName || ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentId" className="text-right">Student ID</Label>
              <Input id="studentId" name="studentId" defaultValue={payment?.studentId || ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" name="amount" type="number" defaultValue={payment?.amount || ''} className="col-span-3" required/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">Billing Month</Label>
              <Input id="month" name="month" defaultValue={payment?.month || format(new Date(), 'MMMM yyyy')} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={payment ? format(new Date(payment.dueDate), 'yyyy-MM-dd') : ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select name="status" defaultValue={payment?.status || 'Pending'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Log Payment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
