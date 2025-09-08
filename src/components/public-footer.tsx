"use client";

import Link from 'next/link';
import { University } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-primary/90 text-primary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <University className="w-6 h-6" />
            <span className="text-xl font-bold font-headline">HostelPro</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link href="/" className="font-medium hover:underline">Home</Link>
            <Link href="/apply" className="font-medium hover:underline">Apply</Link>
            <Link href="/notices" className="font-medium hover:underline">Notices</Link>
            <Link href="/privacy-policy" className="font-medium hover:underline">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="font-medium hover:underline">Terms & Conditions</Link>
          </nav>
        </div>
         <div className="mt-6 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
