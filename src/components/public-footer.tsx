
"use client";

import Link from 'next/link';
import { University } from 'lucide-react';

export default function PublicFooter() {

  return (
    <footer className="bg-primary/90 text-primary-foreground py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <University className="w-5 h-5" />
              <span className="font-bold font-headline">HostelPro</span>
            </Link>
            <nav className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-sm justify-center">
              <Link href="/privacy-policy" className="font-medium hover:underline">Privacy</Link>
              <Link href="/terms-and-conditions" className="font-medium hover:underline">Terms</Link>
              <Link href="/#faq" className="font-medium hover:underline">FAQ</Link>
              <Link href="/admin/login" className="font-medium hover:underline">Admin Portal</Link>
            </nav>
            <p className="text-sm text-primary-foreground/80">&copy; {new Date().getFullYear()} HostelPro</p>
        </div>
      </div>
    </footer>
  );
}
