
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
import { mockStudents } from "@/lib/data";
import { User, X } from "lucide-react";
import { Separator } from "../ui/separator";

interface ManageOccupantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
}

export function ManageOccupantsModal({ isOpen, onClose, room }: ManageOccupantsModalProps) {
    if (!room) return null;

  const occupants = mockStudents.filter(s => s.roomNumber === room.roomNumber);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Occupants for Room {room.roomNumber}</DialogTitle>
          <DialogDescription>Add or remove students from this room.</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div>
                <h4 className="text-sm font-semibold mb-2">Current Occupants ({occupants.length}/{room.capacity})</h4>
                <div className="space-y-2">
                    {occupants.length > 0 ? occupants.map(occ => (
                        <div key={occ.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{occ.name} ({occ.studentId})</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No occupants in this room.</p>
                    }
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-sm font-semibold mb-2">Add New Occupant</h4>
                <div className="flex gap-2">
                    <Input placeholder="Enter Student ID to add" />
                    <Button>Add Student</Button>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
