"use client";

import Link from 'next/link';
import { University } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-primary/90 text-primary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <University className="w-6 h-6" />
            <span className="text-xl font-bold font-headline">HostelPro</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
            <Link href="/#features" className="text-sm font-medium hover:underline">Features</Link>
            <Link href="/#amenities" className="text-sm font-medium hover:underline">Amenities</Link>
            <Link href="/#gallery" className="text-sm font-medium hover:underline">Gallery</Link>
            <Link href="/#faq" className="text-sm font-medium hover:underline">FAQ</Link>
            <Link href="/apply" className="text-sm font-medium hover:underline">Apply</Link>
          </nav>
          <p className="text-sm">&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
