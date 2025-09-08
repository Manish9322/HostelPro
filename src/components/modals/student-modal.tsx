
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

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export function StudentModal({ isOpen, onClose, student }: StudentModalProps) {
  const isEditMode = !!student;
  const title = isEditMode ? "Edit Student Details" : "Add New Student";
  const description = isEditMode ? "Update the details of the student." : "Enter the details for the new student.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
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
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" defaultValue={student?.name || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentId" className="text-right">Student ID</Label>
              <Input id="studentId" defaultValue={student?.studentId || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Room No.</Label>
              <Input id="roomNumber" defaultValue={student?.roomNumber || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">Course</Label>
              <Input id="course" defaultValue={student?.course || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">Year</Label>
              <Input id="year" type="number" defaultValue={student?.year || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" defaultValue={student?.email || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" type="tel" defaultValue={student?.phone || ''} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Add Student"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
