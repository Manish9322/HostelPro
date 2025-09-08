
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
import { useRef } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const utilities: string[] = [];
    if(formData.get('util-ac') === 'on') utilities.push('AC');
    if(formData.get('util-wifi') === 'on') utilities.push('Wi-Fi');
    if(formData.get('util-bathroom') === 'on') utilities.push('Attached Bathroom');

    const data = {
        roomNumber: formData.get('roomNumber'),
        capacity: Number(formData.get('capacity')),
        status: formData.get('status'),
        condition: formData.get('condition'),
        utilities,
    };
    
    onSubmit(data);
  };

  const defaultUtilities = room?.utilities || [];

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
              <Input id="roomNumber" name="roomNumber" defaultValue={room?.roomNumber || ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue={room?.capacity || ''} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select name="status" defaultValue={room?.status}>
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
              <Select name="condition" defaultValue={room?.condition}>
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
                    <div className="flex items-center space-x-2">
                        <Checkbox id="util-ac" name="util-ac" defaultChecked={defaultUtilities.includes('AC')} />
                        <Label htmlFor="util-ac" className="font-normal">Air Conditioning</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="util-wifi" name="util-wifi" defaultChecked={defaultUtilities.includes('Wi-Fi')} />
                        <Label htmlFor="util-wifi" className="font-normal">Wi-Fi</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="util-bathroom" name="util-bathroom" defaultChecked={defaultUtilities.includes('Attached Bathroom')} />
                        <Label htmlFor="util-bathroom" className="font-normal">Attached Bathroom</Label>
                    </div>
                </div>
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
