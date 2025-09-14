

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Room } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { v4 as uuidv4 } from 'uuid';

interface Utility {
  _id: string;
  name: string;
  price: number;
}

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSubmit: (data: any) => void;
}

export function RoomModal({ isOpen, onClose, room, onSubmit }: RoomModalProps) {
  const isEditMode = !!room;
  const title = isEditMode ? `Edit Room ${room.roomNumber}` : "Add New Room";
  const description = isEditMode ? "Update the details of the room." : "Enter the details for the new room.";
  const formRef = useRef<HTMLFormElement>(null);
  
  const [roomNumber, setRoomNumber] = useState('');
  const [baseRent, setBaseRent] = useState(room?.rent || 500);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>(room?.utilities || []);
  const [totalRent, setTotalRent] = useState(0);

  const [availableUtilities, setAvailableUtilities] = useState<Utility[]>([]);
  const [loadingUtilities, setLoadingUtilities] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (!isEditMode) {
        const block = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
        const floor = Math.floor(Math.random() * 3) + 1;
        const num = Math.floor(Math.random() * 10) + 1;
        setRoomNumber(`${block}-${floor}0${num}`);
      } else if (room) {
        setRoomNumber(room.roomNumber);
        setSelectedUtilities(room.utilities);
        setBaseRent(room.rent)
      }

      const fetchUtilities = async () => {
        try {
          setLoadingUtilities(true);
          const response = await fetch('/api/utilities');
          const utilities = await response.json();
          setAvailableUtilities(utilities || []);
        } catch (error) {
          console.error("Failed to fetch utilities", error);
          setAvailableUtilities([]);
        } finally {
          setLoadingUtilities(false);
        }
      };
      fetchUtilities();
    }
  }, [isOpen, isEditMode, room]);

  useEffect(() => {
    const utilityCost = selectedUtilities.reduce((acc, utilName) => {
        const utility = availableUtilities.find(u => u.name === utilName);
        return acc + (utility ? utility.price : 0);
    }, 0);
    setTotalRent(Number(baseRent) + utilityCost);
  }, [baseRent, selectedUtilities, availableUtilities]);


  const handleUtilityChange = (utilityName: string, checked: boolean) => {
      setSelectedUtilities(prev => 
          checked ? [...prev, utilityName] : prev.filter(name => name !== utilityName)
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const data = {
        roomNumber: roomNumber,
        capacity: Number(formData.get('capacity')),
        rent: Number(formData.get('rent')),
        status: formData.get('status'),
        condition: formData.get('condition'),
        utilities: selectedUtilities,
    };
    
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Room No.</Label>
              <Input id="roomNumber" name="roomNumber" value={roomNumber} className="col-span-3" readOnly required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue={room?.capacity || ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rent" className="text-right">Base Rent ($)</Label>
              <Input id="rent" name="rent" type="number" value={baseRent} onChange={(e) => setBaseRent(Number(e.target.value))} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select name="status" defaultValue={room?.status || "Available"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">Condition</Label>
              <Select name="condition" defaultValue={room?.condition || "Good"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-2"/>

            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Utilities</Label>
                <div className="col-span-3 space-y-2">
                    {loadingUtilities ? (
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    ) : (
                      availableUtilities.map(util => (
                        <div key={util._id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`util-${util._id}`} 
                                name={`util-${util.name}`} 
                                checked={selectedUtilities.includes(util.name)}
                                onCheckedChange={(checked) => handleUtilityChange(util.name, Boolean(checked))}
                             />
                            <Label htmlFor={`util-${util._id}`} className="font-normal">{util.name} (+${util.price})</Label>
                        </div>
                      ))
                    )}
                </div>
            </div>
            <Separator className="my-2"/>
             <div className="grid grid-cols-4 items-center gap-4 font-bold">
                 <Label className="text-right">Total Rent</Label>
                 <div className="col-span-3 text-lg">${totalRent.toFixed(2)} / month</div>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Add Room"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
