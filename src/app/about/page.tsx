
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Building, Calendar, Eye, Handshake, Heart, Home, Lightbulb, MapPin, ShieldCheck, Smile, Sparkles, Trophy, Users, Wifi } from 'lucide-react';
import PublicHeader from '@/components/public-header';
import PublicFooter from '@/components/public-footer';
import { Separator } from '@/components/ui/separator';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    const teamMembers = [
        { name: "Dr. Alisha Verma", position: "Chief Warden", avatar: "https://picsum.photos/seed/person1/100/100", dataAiHint: "person" },
        { name: "Rajesh Kumar", position: "Head of Operations", avatar: "https://picsum.photos/seed/person2/100/100", dataAiHint: "person" },
        { name: "Priya Singh", position: "Student Life Coordinator", avatar: "https://picsum.photos/seed/person3/100/100", dataAiHint: "person" },
    ];

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
                        <Image src="https://picsum.photos/seed/hostel-mission/800/600" alt="Students collaborating in a common area" width={800} height={600} className="rounded-lg shadow-lg" data-ai-hint="hostel common area" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card className="text-center items-center p-6 bg-card hover:shadow-lg transition-shadow">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4"/>
                <h3 className="font-semibold text-lg">24/7 Security</h3>
                <p className="text-sm text-muted-foreground mt-1">Monitored premises and secure access.</p>
              </Card>
              <Card className="text-center items-center p-6 bg-card hover:shadow-lg transition-shadow">
                <Wifi className="h-10 w-10 mx-auto text-primary mb-4"/>
                <h3 className="font-semibold text-lg">High-Speed Wi-Fi</h3>
                <p className="text-sm text-muted-foreground mt-1">Reliable internet for study and leisure.</p>
              </Card>
              <Card className="text-center items-center p-6 bg-card hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 mx-auto text-primary mb-4"/>
                <h3 className="font-semibold text-lg">Community Events</h3>
                <p className="text-sm text-muted-foreground mt-1">Regular social and academic gatherings.</p>
              </Card>
              <Card className="text-center items-center p-6 bg-card hover:shadow-lg transition-shadow">
                <Sparkles className="h-10 w-10 mx-auto text-primary mb-4"/>
                <h3 className="font-semibold text-lg">Modern Amenities</h3>
                <p className="text-sm text-muted-foreground mt-1">Gym, laundry, study rooms, and more.</p>
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
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
              {timelineEvents.map((event, index) => (
                <div key={event.year} className={cn("mb-12 flex items-center w-full", index % 2 === 0 ? "md:flex-row-reverse" : "")}>
                  <div className="hidden md:flex w-5/12"></div>
                  <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg">
                    <event.icon className="w-6 h-6" />
                  </div>
                  <div className="w-full md:w-5/12 p-4">
                    <Card className="p-6 hover:shadow-xl transition-shadow">
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

        {/* 5. Meet the Team */}
        <section className="w-full py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Handshake}>Meet the Team</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">The People Behind HostelPro</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our dedicated team is committed to making your stay comfortable and memorable.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map(member => (
                <Card key={member.name} className="text-center p-6 bg-card transition-transform transform hover:-translate-y-2">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarImage src={member.avatar} data-ai-hint={member.dataAiHint} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.position}</p>
                </Card>
              ))}
            </div>
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
        <section className="w-full py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Trophy}>Our Achievements</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Impact in Numbers</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-4 bg-card rounded-lg shadow">
                  <p className="text-4xl font-bold text-primary"><AnimatedCounter end={500} />+</p>
                  <p className="text-sm text-muted-foreground mt-1">Happy Residents</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg shadow">
                  <p className="text-4xl font-bold text-primary"><AnimatedCounter end={10} />+</p>
                  <p className="text-sm text-muted-foreground mt-1">Years of Service</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg shadow">
                  <p className="text-4xl font-bold text-primary"><AnimatedCounter end={50} />+</p>
                  <p className="text-sm text-muted-foreground mt-1">Events Hosted</p>
              </div>
               <div className="text-center p-4 bg-card rounded-lg shadow">
                  <p className="text-4xl font-bold text-primary"><AnimatedCounter end={98} />%</p>
                  <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
              </div>
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
                <Image src="https://picsum.photos/seed/space1/600/400" alt="Modern study lounge" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="study lounge" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">The Study Lounge</h3>
                </div>
              </div>
               <div className="relative group overflow-hidden rounded-lg">
                <Image src="https://picsum.photos/seed/space2/600/400" alt="Outdoor courtyard" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="hostel courtyard" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">The Courtyard</h3>
                </div>
              </div>
               <div className="relative group overflow-hidden rounded-lg">
                <Image src="https://picsum.photos/seed/space3/600/400" alt="Recreation room with games" width={600} height={400} className="w-full h-full object-cover transition-transform group-hover:scale-105" data-ai-hint="recreation room" />
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
