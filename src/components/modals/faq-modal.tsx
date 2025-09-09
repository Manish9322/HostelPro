
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
import { Faq } from "@/lib/types";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
  onSubmit: (data: Omit<Faq, '_id' | 'order'>) => void;
}

export function FaqModal({ isOpen, onClose, faq, onSubmit }: FaqModalProps) {
  const isEditMode = !!faq;
  const title = isEditMode ? "Edit FAQ" : "Create New FAQ";
  const description = isEditMode ? "Update the question and answer." : "Enter a new question and its answer.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
        question: formData.get('question') as string,
        answer: formData.get('answer') as string,
    };
    onSubmit(data);
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="question" className="text-right pt-2">Question</Label>
              <Textarea id="question" name="question" defaultValue={faq?.question || ''} className="col-span-3 min-h-[80px]" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="answer" className="text-right pt-2">Answer</Label>
              <Textarea id="answer" name="answer" defaultValue={faq?.answer || ''} className="col-span-3 min-h-[150px]" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Create FAQ"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
