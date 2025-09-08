
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: any;
}

export function NoticeModal({ isOpen, onClose, notice }: NoticeModalProps) {
  const isEditMode = !!notice;
  const title = isEditMode ? "Edit Notice" : "Create New Notice";
  const description = isEditMode ? "Update the details of the public notice." : "Enter the details for the new public notice.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" defaultValue={notice?.title || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">Author</Label>
              <Input id="author" defaultValue={notice?.author || 'Admin'} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">Content</Label>
              <Textarea id="content" defaultValue={notice?.content || ''} className="col-span-3 min-h-[150px]" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select defaultValue={notice?.category || 'General'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <div />
                <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox id="featured" defaultChecked={notice?.featured || false} />
                    <Label htmlFor="featured" className="font-normal">Mark as featured notice</Label>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Post Notice"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
