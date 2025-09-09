
"use client";

import Link from 'next/link';
import { University } from 'lucide-react';
import { Button } from './ui/button';

export default function PublicFooter() {

  return (
    <footer className="bg-primary/90 text-primary-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
            <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <University className="w-8 h-8" />
                  <span className="text-2xl font-bold font-headline">HostelPro</span>
                </div>
                 <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">Your new home away from home. Discover a safe, comfortable, and vibrant living space designed exclusively for students.</p>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center">
                  <Link href="/" className="font-medium hover:underline">Home</Link>
                  <Link href="/apply" className="font-medium hover:underline">Apply</Link>
                  <Link href="/notices" className="font-medium hover:underline">Notices</Link>
                  <Link href="/privacy-policy" className="font-medium hover:underline">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="font-medium hover:underline">Terms & Conditions</Link>
                </nav>
            </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-12 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
