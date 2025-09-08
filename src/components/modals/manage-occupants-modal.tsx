
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
import { User, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import type { Student, Room } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

interface ManageOccupantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onUpdate: () => void;
}

export function ManageOccupantsModal({ isOpen, onClose, room, onUpdate }: ManageOccupantsModalProps) {
  const [occupants, setOccupants] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (room) {
        setLoading(true);
        try {
          const allStudentsRes = await fetch('/api/students');
          if (!allStudentsRes.ok) throw new Error("Failed to fetch students");
          const allStudents: Student[] = await allStudentsRes.json();

          const roomOccupants = allStudents.filter(s => s.roomNumber === room.roomNumber);
          const availableStudents = allStudents.filter(s => s.roomNumber === 'Unassigned');
          
          setOccupants(roomOccupants);
          setUnassignedStudents(availableStudents);
        } catch(err) {
            toast({ title: "Error", description: "Could not load student data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, room, toast]);

  if (!room) return null;

  const handleAddOccupant = async () => {
    if (!selectedStudentId) return;
    
    if (occupants.length >= room.capacity) {
      toast({ title: "Error", description: "Room is already at full capacity.", variant: "destructive" });
      return;
    }
    
    const studentToAdd = unassignedStudents.find(s => s._id === selectedStudentId);
    if (!studentToAdd) return;
    
    const response = await fetch(`/api/students?id=${studentToAdd._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber: room.roomNumber }),
    });

    if (response.ok) {
      setOccupants(prev => [...prev, studentToAdd]);
      setUnassignedStudents(prev => prev.filter(s => s._id !== selectedStudentId));
      setSelectedStudentId("");
      onUpdate();
      toast({ title: "Success", description: "Student added to the room." });
    } else {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    }
  };

  const handleRemoveOccupant = async (studentToRemove: Student) => {
    const response = await fetch(`/api/students?id=${studentToRemove._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber: "Unassigned" }),
    });

    if (response.ok) {
      setOccupants(prev => prev.filter(s => s._id !== studentToRemove._id));
      setUnassignedStudents(prev => [...prev, studentToRemove]);
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
                 {loading ? (
                    <div className="flex gap-2">
                       <Skeleton className="h-10 flex-grow" />
                       <Skeleton className="h-10 w-28" />
                    </div>
                ) : (
                <div className="flex gap-2">
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an unassigned student" />
                        </SelectTrigger>
                        <SelectContent>
                            {unassignedStudents.map(student => (
                                <SelectItem key={student._id} value={student._id}>
                                    {student.name} ({student.studentId})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddOccupant} disabled={!selectedStudentId}>Add Student</Button>
                </div>
                )}
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
