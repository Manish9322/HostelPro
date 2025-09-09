
"use client";

import Link from 'next/link';
import { University } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { FeedbackModal } from './modals/feedback-modal';

export default function PublicFooter() {
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <>
    <footer className="bg-primary/90 text-primary-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <div className="flex items-center gap-2 mb-4">
                  <University className="w-8 h-8" />
                  <span className="text-2xl font-bold font-headline">HostelPro</span>
                </div>
                 <p className="text-primary-foreground/80 mb-6">Your new home away from home. Discover a safe, comfortable, and vibrant living space designed exclusively for students. Simplify your life with our modern amenities and streamlined digital experience.</p>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <Link href="/" className="font-medium hover:underline">Home</Link>
                  <Link href="/apply" className="font-medium hover:underline">Apply</Link>
                  <Link href="/notices" className="font-medium hover:underline">Notices</Link>
                  <Link href="/privacy-policy" className="font-medium hover:underline">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="font-medium hover:underline">Terms & Conditions</Link>
                </nav>
            </div>
            <div className="bg-card/20 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold font-headline mb-4">Have Feedback?</h3>
                <p className="text-primary-foreground/80 mb-6">We value your opinion and use it to improve our services. Click the button below to share your experience!</p>
                <Button variant="secondary" size="lg" onClick={() => setFeedbackModalOpen(true)}>
                    Leave Feedback
                </Button>
            </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-12 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />
    </>
  );
}
