
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
import { mockStudents } from "@/lib/data";
import { User, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import type { Student, Room } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ManageOccupantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onUpdate: () => void;
}

export function ManageOccupantsModal({ isOpen, onClose, room, onUpdate }: ManageOccupantsModalProps) {
  const [occupants, setOccupants] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOccupants = async () => {
      if (room) {
        // In a real app, you might fetch occupants by room ID.
        // Here, we filter the mock data.
        const allStudents: Student[] = await (await fetch('/api/students')).json();
        const roomOccupants = allStudents.filter(s => s.roomNumber === room.roomNumber);
        setOccupants(roomOccupants);
      }
    };
    if (isOpen) {
      fetchOccupants();
    }
  }, [isOpen, room]);

  if (!room) return null;

  const handleAddOccupant = async () => {
    if (!studentId) return;
    
    // Check capacity
    if (occupants.length >= room.capacity) {
      toast({ title: "Error", description: "Room is already at full capacity.", variant: "destructive" });
      return;
    }
    
    // In a real app, you'd find the student in the DB
    const allStudents: Student[] = await (await fetch('/api/students')).json();
    const studentToAdd = allStudents.find(s => s.studentId.toLowerCase() === studentId.toLowerCase() && s.roomNumber === "Unassigned");
    
    if (!studentToAdd) {
      toast({ title: "Error", description: "Student not found or already assigned to a room.", variant: "destructive" });
      return;
    }
    
    // Update student's roomNumber
    const response = await fetch(`/api/students?id=${studentToAdd._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber: room.roomNumber }),
    });

    if (response.ok) {
      setOccupants(prev => [...prev, studentToAdd]);
      setStudentId("");
      onUpdate(); // Re-fetch data on the parent page
      toast({ title: "Success", description: "Student added to the room." });
    } else {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    }
  };

  const handleRemoveOccupant = async (studentToRemove: Student) => {
     // Update student's roomNumber to "Unassigned"
    const response = await fetch(`/api/students?id=${studentToRemove._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber: "Unassigned" }),
    });

    if (response.ok) {
      setOccupants(prev => prev.filter(s => s._id !== studentToRemove._id));
      onUpdate();
      toast({ title: "Success", description: "Student removed from the room." });
    } else {
       toast({ title: "Error", description: "Failed to remove student.", variant: "destructive" });
    }
  };


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
                        <div key={occ._id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{occ.name} ({occ.studentId})</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveOccupant(occ)}>
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
                    <Input 
                      placeholder="Enter Student ID to add" 
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                    />
                    <Button onClick={handleAddOccupant}>Add Student</Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Only students with 'Unassigned' room status can be added.</p>
            </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
