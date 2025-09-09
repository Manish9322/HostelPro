
"use client";

import { useState, useMemo, useEffect } from "react";
import PublicHeader from "@/components/public-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from 'date-fns';
import type { Notice } from "@/lib/types";
import { X, Search, Pin, Megaphone, HeartHandshake, ShieldCheck, Users, Wifi, AlertTriangle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PublicFooter from "@/components/public-footer";
import { Skeleton } from "@/components/ui/skeleton";

// The Modal component for displaying a single notice
function NoticeModal({ notice, onClose }: { notice: Notice | null, onClose: () => void }) {
  if (!notice) return null;

  return (
    <Dialog open={!!notice} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-transparent border-none shadow-none p-2 sm:p-4 w-full max-w-3xl">
        {/* The Notice Board Frame */}
        <div className="bg-notice-board p-4 sm:p-6 rounded-lg shadow-2xl data-[state=open]:animate-modal-show relative border-8 border-gray-800/50">
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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 bg-gray-500 rounded-full shadow-md border-2 border-white/50 flex items-center justify-center">
              <div className="h-3 w-3 bg-gray-700 rounded-full" />
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

const categoryBadgeVariant = (category: Notice['category']) => {
  switch (category) {
    case 'Urgent':
      return 'destructive';
    case 'Maintenance':
      return 'secondary';
    case 'Event':
      return 'default';
    case 'General':
    default:
      return 'outline';
  }
};


export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const noticeCategories: Notice['category'][] = ['Maintenance', 'Event', 'General', 'Urgent'];

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/notices');
        if (!response.ok) throw new Error("Failed to fetch notices.");
        const data = await response.json();
        setNotices(data);
    } catch(err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);


  const featuredNotice = useMemo(() => notices.find(n => n.featured), [notices]);
  const otherNotices = useMemo(() => notices
    .filter(n => !n.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()), [notices]);

  const filteredNotices = useMemo(() => {
    return otherNotices.filter(notice => {
      const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            notice.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, otherNotices]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-secondary/50">
        <PublicHeader />
        {/* Hero Section */}
        <section className="w-full py-16 bg-background border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
                Official Notice Board
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Stay informed with the latest news, announcements, and important updates from the hostel administration.
              </p>
            </div>
          </div>
        </section>
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            
            {/* Featured Notice */}
            {loading ? (
                <Skeleton className="mb-12 h-44 w-full" />
            ) : featuredNotice && (
              <Card 
                className="mb-12 bg-card/60 border-primary/20 shadow-lg hover:shadow-primary/20 transition-shadow cursor-pointer"
                onClick={() => setSelectedNotice(featuredNotice)}
              >
                <CardContent className="p-6 flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                       <Badge variant={categoryBadgeVariant(featuredNotice.category)}>{featuredNotice.category}</Badge>
                       <div className="flex items-center gap-2 text-primary font-semibold">
                         <Pin className="h-4 w-4" />
                         <span>Featured Notice</span>
                       </div>
                    </div>
                    <h2 className="text-2xl font-bold font-headline mb-2">{featuredNotice.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{featuredNotice.content}</p>
                    <div className="text-sm text-muted-foreground flex justify-between items-center">
                      <span>By: <strong>{featuredNotice.author}</strong></span>
                      <span>{format(new Date(featuredNotice.publishedAt), 'PP')}</span>
                    </div>
                  </div>
                   <Button variant="outline" className="w-full md:w-auto flex-shrink-0">Read More</Button>
                </CardContent>
              </Card>
            )}

            {/* Filters and Search */}
            <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="search"
                            placeholder="Search notices by title, content, or author..."
                            className="pl-10 h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <Button 
                            variant={activeCategory === 'All' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('All')}
                        >
                            All
                        </Button>
                        {noticeCategories.map(category => (
                            <Button 
                                key={category}
                                variant={activeCategory === category ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notices Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({length:6}).map((_, i) => <Skeleton key={i} className="h-48"/>)}
                </div>
            ) : error ? (
                <Card className="md:col-span-3 text-center text-destructive p-12 bg-card">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Failed to load notices</h3>
                    <p>{error}</p>
                    <Button onClick={fetchNotices} variant="outline" className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Try Again
                    </Button>
                </Card>
            ) : filteredNotices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNotices.map((notice) => (
                    <Card 
                        key={notice._id} 
                        className="transition-shadow hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col bg-card"
                        onClick={() => setSelectedNotice(notice)}
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedNotice(notice)}
                    >
                        <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="font-headline text-xl mb-2">{notice.title}</CardTitle>
                          <Badge variant={categoryBadgeVariant(notice.category)} className="capitalize flex-shrink-0 ml-2">{notice.category}</Badge>
                        </div>
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
            ) : (
                <Card className="md:col-span-3 text-center text-muted-foreground p-12 bg-card">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold">No Notices Found</h3>
                    <p>There are no notices matching your current search and filter criteria. Try adjusting your search.</p>
                </Card>
            )}
            
          </div>
        </main>
        {/* New Section */}
        <section className="w-full py-16 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-2 mb-4">
                      <HeartHandshake className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-primary tracking-widest uppercase">Our Commitment</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-headline">More Than Just a Room</h2>
                  <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We're dedicated to providing an environment that supports your success and well-being.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Your Safety, Our Priority</h3>
                  <p className="text-muted-foreground">With round-the-clock security personnel, CCTV surveillance, and secure access systems, we ensure you can focus on your studies with peace of mind.</p>
                </div>
                <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                  <Users className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">A Community to Belong To</h3>
                  <p className="text-muted-foreground">Join a diverse and vibrant community of students. Our common areas and regular events are perfect for making new friends and lifelong connections.</p>
                </div>
                <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                  <Wifi className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Hassle-Free Living</h3>
                  <p className="text-muted-foreground">All-inclusive amenities like high-speed Wi-Fi, laundry services, and maintenance support mean you have more time to focus on what matters most.</p>
                </div>
              </div>
          </div>
        </section>
        <PublicFooter />
      </div>

      <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
    </>
  );
}
