
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Building, Calendar, Eye, Handshake, Heart, Home, Lightbulb, MapPin, ShieldCheck, Smile, Sparkles, Trophy, Users, Wifi, UserPlus, CalendarClock, PartyPopper, Star, Linkedin, Twitter, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import { Separator } from '@/components/ui/separator';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import type { BoardMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const SectionTag = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center justify-center gap-2 mb-4 text-primary">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium tracking-widest uppercase">{children}</span>
    </div>
);

const AnimatedCounter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: inView ? end : 0 },
    config: { duration },
  });

  return <animated.span ref={ref}>{number.to((n) => n.toFixed(0))}</animated.span>;
};


export default function AboutPage() {
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoardMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/board-members?visible=true');
            if (!response.ok) throw new Error("Failed to fetch board members.");
            const data = await response.json();
            setBoardMembers(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoardMembers();
    }, []);

    const timelineEvents = [
        { year: "2014", title: "Foundation Laid", description: "HostelPro was founded with the mission to provide safe and affordable housing for students.", icon: Home },
        { year: "2016", title: "First 100 Residents", description: "We welcomed our 100th resident, marking a significant milestone in our growth.", icon: Smile },
        { year: "2018", title: "Expansion of Wing B", description: "A new wing was added to accommodate the growing demand, increasing our capacity by 50%.", icon: Building },
        { year: "2020", title: "Digital Transformation", description: "Launched our online portal for applications, payments, and support, streamlining the resident experience.", icon: Sparkles },
        { year: "2023", title: "Best Hostel Award", description: "Recognized as the 'Best Student Hostel' in the city for our outstanding facilities and community.", icon: Award },
    ];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <SectionTag icon={Building}>Our Story</SectionTag>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
              Crafting a Better Student Living Experience
            </h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
              Learn about our journey, our mission, and the values that drive us to create a supportive and thriving community for students.
            </p>
          </div>
        </section>

        {/* 2. About This Hostel (Our Mission) */}
        <section className="w-full py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Image src="https://placehold.co/800x600" alt="Students collaborating in a common area" width={800} height={600} className="rounded-lg shadow-lg" data-ai-hint="hostel common area" />
                    </div>
                    <div className="space-y-4">
                        <SectionTag icon={Heart}>Our Mission</SectionTag>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">More Than Just a Place to Stay</h2>
                        <p className="text-lg text-muted-foreground">
                            At HostelPro, our mission is to provide a secure, comfortable, and enriching environment that empowers students to achieve their academic and personal goals. We believe a good hostel is a cornerstone of a successful university life, and we are dedicated to fostering a community where students can learn, grow, and thrive together.
                        </p>
                         <p className="text-muted-foreground">
                            We are committed to continuous improvement, leveraging technology to simplify processes and listening to resident feedback to enhance our facilities and services.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Features of this hostel */}
        <section className="w-full py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Trophy}>Why We Stand Out</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Facilities Built for Student Success</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 transition-transform group-hover:scale-110">
                        <ShieldCheck className="h-8 w-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-center">24/7 Security</h3>
                    <p className="text-sm text-muted-foreground flex-grow text-center">Monitored premises and secure access for your peace of mind.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group">
                 <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 transition-transform group-hover:scale-110">
                        <Wifi className="h-8 w-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-center">High-Speed Wi-Fi</h3>
                    <p className="text-sm text-muted-foreground flex-grow text-center">Reliable internet coverage for all your study and leisure needs across the campus.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group">
                 <CardContent className="p-6">
                     <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 transition-transform group-hover:scale-110">
                        <Users className="h-8 w-8 text-primary"/>
                     </div>
                    <h3 className="font-semibold text-xl mb-2 text-center">Community Events</h3>
                    <p className="text-sm text-muted-foreground flex-grow text-center">Regular social and academic gatherings to foster connections and a sense of belonging.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group">
                 <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 transition-transform group-hover:scale-110">
                        <Sparkles className="h-8 w-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-center">Modern Amenities</h3>
                    <p className="text-sm text-muted-foreground flex-grow text-center">Includes a modern gym, laundry services, study rooms, and recreation areas.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Our History Timeline */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Calendar}>Our Journey</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">A Legacy of Student Care</h2>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true"></div>
              {timelineEvents.map((event, index) => (
                <div key={event.year} className={cn("mb-12 flex items-center w-full", index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row")}>
                  <div className="hidden md:flex w-5/12"></div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shrink-0">
                    <event.icon className="w-6 h-6" />
                  </div>
                  <div className="w-full md:w-5/12 px-4 py-2">
                    <Card className="p-6 hover:shadow-xl transition-shadow duration-300 transform md:hover:-translate-y-1">
                      <p className="text-primary font-bold text-lg mb-1">{event.year}</p>
                      <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Meet the Board */}
        <section className="w-full py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Handshake}>Meet Our Board</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">The People Guiding HostelPro</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our dedicated board members are committed to making your stay comfortable and memorable.</p>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({length: 3}).map((_, i) => (
                        <Card key={i}><CardContent className="p-6"><Skeleton className="h-64"/></CardContent></Card>
                    ))}
                </div>
            ) : error ? (
                 <div className="text-center py-8">
                    <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
                    <p className="mt-4 text-muted-foreground">{error}</p>
                    <Button onClick={fetchBoardMembers} variant="outline" className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardMembers.map(member => (
                    <Card key={member.name} className="relative group overflow-hidden bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>
                    <CardContent className="text-center p-6 pt-16 relative">
                        <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-background bg-background shadow-lg transition-transform group-hover:scale-105">
                        <AvatarImage src={member.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-primary font-medium">{member.position}</p>
                        <p className="text-muted-foreground text-sm mt-4 min-h-[40px]">{member.bio || "Dedicated to enhancing the student living experience."}</p>
                        <Separator className="my-4"/>
                        <div className="flex justify-center gap-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5"/></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5"/></a>
                            <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors"><Mail className="w-5 h-5"/></a>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            )}
          </div>
        </section>
        
        {/* 6. Our Philosophy */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Lightbulb}>Our Philosophy</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Three Pillars of a Great Hostel Life</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                  <ShieldCheck className="h-12 w-12 mx-auto text-destructive mb-4"/>
                  <h3 className="text-2xl font-semibold mb-2">Safety</h3>
                  <p className="text-muted-foreground">Providing a secure and protected environment is non-negotiable. It's the foundation upon which a positive student experience is built.</p>
              </div>
               <div className="p-6">
                  <Users className="h-12 w-12 mx-auto text-primary mb-4"/>
                  <h3 className="text-2xl font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">We believe in the power of connection. We foster a vibrant community where students can form friendships and support networks.</p>
              </div>
               <div className="p-6">
                  <Sparkles className="h-12 w-12 mx-auto text-accent-foreground mb-4"/>
                  <h3 className="text-2xl font-semibold mb-2">Learning</h3>
                  <p className="text-muted-foreground">Our environment is designed to support academic pursuits, providing quiet study spaces and resources for success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. By the Numbers */}
        <section className="relative w-full py-12 md:py-20 bg-secondary overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-10" aria-hidden="true"></div>
          <div className="container relative mx-auto px-4 md:px-6">
            <SectionTag icon={Trophy}>Our Achievements</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Impact in Numbers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: UserPlus, value: 500, suffix: '+', label: 'Happy Residents' },
                { icon: CalendarClock, value: 10, suffix: '+', label: 'Years of Service' },
                { icon: PartyPopper, value: 50, suffix: '+', label: 'Events Hosted' },
                { icon: Star, value: 98, suffix: '%', label: 'Satisfaction Rate' },
              ].map((stat, i) => (
                <div key={i} className="relative group p-1 rounded-xl bg-gradient-to-b from-primary/20 to-primary/5 hover:[&>div]:!bg-primary/5 transition-all duration-300">
                  <div className="absolute inset-0.5 -z-10 rounded-[10px] bg-gradient-to-b from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow" />
                  <div className="relative pt-12 pb-6 px-6 text-center bg-card/80 backdrop-blur-sm rounded-lg shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground border-4 border-secondary shadow-lg">
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <p className="text-5xl font-bold text-primary">
                      <AnimatedCounter end={stat.value} />
                      {stat.suffix}
                    </p>
                    <p className="text-lg font-medium text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 8. A Day in the Life */}
        <section className="w-full py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <SectionTag icon={Eye}>A Day at HostelPro</SectionTag>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-headline">Experience Life With Us</h2>
                </div>
                <div className="space-y-6">
                    <p className="text-center text-lg text-muted-foreground">Imagine waking up in a comfortable room, grabbing a coffee from the cafeteria, and heading to a quiet study lounge for your morning session. In the afternoon, you join a game of badminton in the courtyard, followed by a collaborative project meeting in a common area. Evenings are for relaxing with friends in the rec room or attending a fun community event. This is the vibrant, balanced life that awaits you at HostelPro.</p>
                </div>
            </div>
        </section>

        {/* 9. Explore Our Spaces */}
        <section className="w-full py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={MapPin}>Explore Our Spaces</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Designed for Comfort & Community</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative group overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400" alt="Modern study lounge" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="study lounge" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">The Study Lounge</h3>
                </div>
              </div>
               <div className="relative group overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400" alt="Outdoor courtyard" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="hostel courtyard" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">The Courtyard</h3>
                </div>
              </div>
               <div className="relative group overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400" alt="Recreation room with games" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="recreation room" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">The Rec Room</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Join Us?</h2>
            <p className="mx-auto max-w-xl mt-4 text-primary-foreground/80">
              Your new home away from home is just an application away. Become part of the HostelPro family and start your journey today.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 shadow-lg transform hover:scale-105 transition-transform">
                <Link href="/apply">Apply Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
