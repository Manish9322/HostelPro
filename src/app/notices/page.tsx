"use client";

import { useState } from "react";
import PublicHeader from "@/components/public-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { mockNotices } from "@/lib/data";
import { format } from 'date-fns';
import type { Notice } from "@/lib/types";
import { X } from "lucide-react";

// The Modal component for displaying a single notice
function NoticeModal({ notice, onClose }: { notice: Notice | null, onClose: () => void }) {
  if (!notice) return null;

  return (
    <Dialog open={!!notice} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-transparent border-none shadow-none p-2 sm:p-4 w-full max-w-3xl">
        {/* The Notice Board Frame */}
        <div className="bg-notice-board p-4 sm:p-6 rounded-lg shadow-2xl data-[state=open]:animate-modal-show relative border-8 border-yellow-950/50">
          <button
            onClick={onClose}
            aria-label="Close notice"
            className="absolute -top-4 -right-4 z-20 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/80 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* The Pinned Paper */}
          <div className="bg-notice-paper text-notice-paper-foreground p-6 sm:p-8 rounded-sm shadow-inner relative font-code">
            {/* Pushpin */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 bg-red-500 rounded-full shadow-md border-2 border-white/50 flex items-center justify-center">
              <div className="h-3 w-3 bg-red-700 rounded-full" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center break-words">{notice.title}</h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed mb-8 break-words">{notice.content}</p>
            
            <div className="border-t border-dashed border-current/50 pt-4 text-right">
              <p className="font-semibold">By: {notice.author}</p>
              <p className="text-sm">{format(new Date(notice.publishedAt), 'PPP')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const sortedNotices = [...mockNotices].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return (
    <>
      <div className="flex flex-col min-h-screen bg-secondary/50">
        <PublicHeader />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">Notice Board</h1>
              <p className="mt-2 text-muted-foreground">Latest news and announcements from the hostel administration.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedNotices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className="transition-shadow hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
                  onClick={() => setSelectedNotice(notice)}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedNotice(notice)}
                >
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{notice.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{notice.content}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground flex justify-between">
                    <span>By: <strong>{notice.author}</strong></span>
                    <span>{format(new Date(notice.publishedAt), 'PP')}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
    </>
  );
}
