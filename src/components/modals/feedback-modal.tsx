
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
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Send, Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      rating,
    };

    if (rating === 0) {
        toast({ title: 'Rating Required', description: 'Please select a star rating.', variant: 'destructive'});
        setIsSubmitting(false);
        return;
    }

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to submit feedback');
        toast({ title: 'Thank You!', description: 'Your feedback has been submitted successfully.' });
        (e.target as HTMLFormElement).reset();
        setRating(0);
        onClose();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to submit feedback.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Us Your Feedback</DialogTitle>
          <DialogDescription>
            We value your opinion and use it to improve our services. Let us know how we're doing!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-2 gap-4">
                  <Input name="name" placeholder="Your Name" required />
                  <Input name="email" type="email" placeholder="Your Email" required />
              </div>
              <Textarea name="message" placeholder="Your feedback..." required className="min-h-[120px]" />
              <div className='flex items-center gap-2'>
                <Label>Rating:</Label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      <Star className={`w-6 h-6 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                    </button>
                  ))}
                </div>
              </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    