
"use client";

import Link from 'next/link';
import { University, Star, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PublicFooter() {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      rating,
    };

    if (rating === 0) {
        toast({ title: 'Rating Required', description: 'Please select a star rating.', variant: 'destructive'});
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
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to submit feedback.', variant: 'destructive' });
    }
  };


  return (
    <footer className="bg-primary/90 text-primary-foreground pt-12">
      <div className="container mx-auto px-4 md:px-6">

        <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
                <h3 className="text-2xl font-bold font-headline mb-4">Leave Us Your Feedback</h3>
                <p className="text-primary-foreground/80 mb-6">We value your opinion and use it to improve our services. Let us know how we're doing!</p>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input name="name" placeholder="Your Name" required className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70"/>
                        <Input name="email" type="email" placeholder="Your Email" required className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
                    </div>
                    <Textarea name="message" placeholder="Your feedback..." required className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70"/>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Label>Rating:</Label>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)}>
                              <Star className={`w-6 h-6 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-primary-foreground/50'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button type="submit" variant="secondary">
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                </form>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-4">
                  <University className="w-8 h-8" />
                  <span className="text-2xl font-bold font-headline">HostelPro</span>
                </div>
                 <p className="text-primary-foreground/80 mb-6">Your new home away from home. Discover a safe, comfortable, and vibrant living space designed exclusively for students. Simplify your life with our modern amenities and streamlined digital experience.</p>
                <nav className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm">
                  <Link href="/" className="font-medium hover:underline">Home</Link>
                  <Link href="/apply" className="font-medium hover:underline">Apply</Link>
                  <Link href="/notices" className="font-medium hover:underline">Notices</Link>
                  <Link href="/privacy-policy" className="font-medium hover:underline">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="font-medium hover:underline">Terms & Conditions</Link>
                </nav>
            </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
