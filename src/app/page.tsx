
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Users, ShieldCheck, Wifi, Dumbbell, UtensilsCrossed, BookOpen, Tv, Star, University, FileCheck2, Building, Handshake, Smile, Shield, Trophy, PartyPopper, Lightbulb, Images, HeartHandshake, HelpCircle, MapPin, Sparkles, RefreshCw, AlertTriangle, MessageSquarePlus, CheckCircle, Award } from 'lucide-react';
import PublicHeader from '@/components/public-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PublicFooter from '@/components/public-footer';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Faq, GalleryImage, Feedback } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GalleryImageModal } from '@/components/modals/gallery-image-modal';
import { FeedbackModal } from '@/components/modals/feedback-modal';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';

const SectionTag = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium text-primary tracking-widest uppercase">{children}</span>
  </div>
)

const AnimatedCounter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: inView ? end : 0 },
    config: { duration },
  });

  return <animated.span ref={ref}>{number.to((n) => n.toFixed(0))}</animated.span>;
};


export default function Home() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [testimonials, setTestimonials] = useState<Feedback[]>([]);
    const [location, setLocation] = useState<{address: string, mapLink: string}>({address: '', mapLink: ''});
    
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqRes, galleryRes, feedbackRes, settingsRes] = await Promise.all([
                    fetch('/api/faqs'),
                    fetch('/api/gallery'),
                    fetch('/api/feedback'),
                    fetch('/api/settings'),
                ]);

                if (!faqRes.ok) throw new Error('Failed to load FAQs');
                const faqData = await faqRes.json();
                setFaqs(faqData.filter((faq: Faq) => faq.visible)); // Only show visible FAQs
                setLoadingFaqs(false);

                if (!galleryRes.ok) throw new Error('Failed to load gallery');
                const galleryData = await galleryRes.json();
                setGalleryImages(galleryData);
                setLoadingGallery(false);

                if (!feedbackRes.ok) throw new Error('Failed to load testimonials');
                const feedbackData = await feedbackRes.json();
                setTestimonials(feedbackData.filter((fb: Feedback) => fb.rating >= 4).slice(0, 3));
                setLoadingTestimonials(false);

                if(!settingsRes.ok) throw new Error('Failed to load settings');
                const settingsData = await settingsRes.json();
                setLocation({ address: settingsData.locationAddress, mapLink: settingsData.locationMapLink });
                setLoadingLocation(false);

            } catch (err) {
                setError((err as Error).message);
                setLoadingFaqs(false);
                setLoadingGallery(false);
                setLoadingTestimonials(false);
                setLoadingLocation(false);
            }
        };

        fetchData();
    }, []);

  return (
    <>
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center space-y-4">
                    <div className="w-full text-center">
                        <div className="inline-block bg-accent text-accent-foreground text-xs font-semibold tracking-wider uppercase rounded-full px-3 py-1 mb-2">
                            Limited Spots Available for Fall 2024!
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
                       Your New Home Away From Home
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
                        Experience the perfect blend of comfort, community, and convenience. Our modern facilities and streamlined digital services are designed to make your student life easier and more enjoyable.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
                            <Link href="/apply">Apply Now & Waive Application Fees</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="transform hover:scale-105 transition-transform">
                            <Link href="#features">Explore Features</Link>
                        </Button>
                    </div>

                    <div className="pt-6">
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
                            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50">
                                <BedDouble className="w-6 h-6 text-primary" />
                                <span className="font-semibold text-sm">Modern Rooms</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50">
                                <Users className="w-6 h-6 text-primary" />
                                <span className="font-semibold text-sm">Vibrant Community</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50 col-span-2 sm:col-span-1">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="font-semibold text-sm">24/7 Security</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                      <div className="flex justify-center items-center gap-4">
                          <div className="flex -space-x-2 overflow-hidden">
                              <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                  <AvatarImage src="https://picsum.photos/seed/1/40/40" data-ai-hint="person avatar" alt="User 1"/>
                                  <AvatarFallback>U1</AvatarFallback>
                              </Avatar>
                               <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                  <AvatarImage src="https://picsum.photos/seed/2/40/40" data-ai-hint="person avatar" alt="User 2"/>
                                  <AvatarFallback>U2</AvatarFallback>
                              </Avatar>
                               <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                                  <AvatarImage src="https://picsum.photos/seed/3/40/40" data-ai-hint="person avatar" alt="User 3"/>
                                  <AvatarFallback>U3</AvatarFallback>
                              </Avatar>
                          </div>
                          <div className="flex flex-col items-start">
                              <div className="flex items-center">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              </div>
                              <p className="text-xs text-muted-foreground">"Best hostel experience ever!"</p>
                          </div>
                      </div>
                    </div>
                     <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="text-center p-2 bg-background/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary"><AnimatedCounter end={500} />+</p>
                          <p className="text-xs text-muted-foreground">Happy Residents</p>
                        </div>
                        <div className="text-center p-2 bg-background/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary"><AnimatedCounter end={250} />+</p>
                          <p className="text-xs text-muted-foreground">Rooms Secured</p>
                        </div>
                        <div className="text-center p-2 bg-background/50 rounded-lg">
                           <p className="text-2xl font-bold text-primary"><AnimatedCounter end={50} />+</p>
                          <p className="text-xs text-muted-foreground">Events Hosted</p>
                        </div>
                         <div className="text-center p-2 bg-background/50 rounded-lg">
                           <p className="text-2xl font-bold text-primary"><AnimatedCounter end={10} />+</p>
                          <p className="text-xs text-muted-foreground">Years of Service</p>
                        </div>
                    </div>
                    <div className="pt-6 max-w-2xl mx-auto">
                        <Accordion type="single" collapsible className="w-full bg-background/50 rounded-lg px-4">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>What are the room options?</AccordionTrigger>
                                <AccordionContent>We offer single and shared occupancy rooms with various amenities.</AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2" className="border-b-0">
                                <AccordionTrigger>Is there a deadline to apply?</AccordionTrigger>
                                <AccordionContent>We accept applications on a rolling basis, but we recommend applying early as spots fill up quickly.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Lightbulb}>Features</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose HostelPro?</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We provide more than just a room. We offer a comprehensive living experience tailored to student life, focusing on convenience, community, and security.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-accent group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <BedDouble className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                  <CardTitle>Streamlined Living</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From a hassle-free online application to managing your stay, our platform simplifies every step. Track your application, receive important notices, and communicate with administration, all in one place.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-accent group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                  <CardTitle>Safety & Security First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your well-being is our top priority. With 24/7 security, a secure campus, and an anonymous complaint system, we ensure a safe and protected environment for all residents.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-accent group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                  <CardTitle>Vibrant Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Become part of a thriving student community. Our common areas, study lounges, and organized events are designed to help you connect, collaborate, and create lasting friendships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="w-full py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Images}>Gallery</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Glimpses of Our Hostel</h2>
              <p className="mt-2 text-muted-foreground">A modern, clean, and welcoming environment designed for student success.</p>
            </div>
             {loadingGallery ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
                </div>
            ) : error ? (
                <p className="text-destructive text-center">Could not load gallery images.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={image._id} 
                            className={cn("overflow-hidden rounded-lg shadow-md group cursor-pointer",
                            index === 0 && "md:col-span-2 md:row-span-2",
                            index === 5 && "md:col-span-2",
                            )}
                            onClick={() => setSelectedImage(image)}>
                            <Image src={image.url} alt={image.alt} width={600} height={600} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                        </div>
                    ))}
                </div>
            )}
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={Sparkles}>Amenities</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything You Need</h2>
              <p className="mt-2 text-muted-foreground">Our amenities are curated to support your academic and personal life.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <Wifi className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">High-Speed Wi-Fi</h3>
                <p className="text-sm text-muted-foreground">Stay connected with reliable, high-speed internet access available 24/7 throughout the hostel.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Quiet Study Rooms</h3>
                <p className="text-sm text-muted-foreground">Dedicated quiet zones and collaborative spaces perfect for exam preparation and group projects.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <UtensilsCrossed className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">On-site Cafeteria</h3>
                <p className="text-sm text-muted-foreground">Enjoy nutritious and delicious meals at our on-site cafeteria, catering to various dietary needs.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <Dumbbell className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Modern Gymnasium</h3>
                <p className="text-sm text-muted-foreground">Stay active and healthy with our fully-equipped gym, accessible to all residents.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <Tv className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Recreation Room</h3>
                <p className="text-sm text-muted-foreground">Unwind and socialize in our common room featuring TV, games, and comfortable seating.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">24/7 Security</h3>
                <p className="text-sm text-muted-foreground">Our campus is monitored around the clock with professional security staff and CCTV surveillance.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-4-3-5s-3-3-3-3-1 2-3 5-3 3-3 5a7 7 0 0 0 7 7Z"/><path d="M10 9a2 2 0 1 1 4 0c0 .6-.2 1.4-.6 2.4C13 12 12 13.2 12 14"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Hot Water Supply</h3>
                <p className="text-sm text-muted-foreground">Enjoy consistent hot water supply for your comfort, available in all bathrooms.</p>
              </div>
               <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10Z"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Laundry Facilities</h3>
                <p className="text-sm text-muted-foreground">Convenient on-site laundry facilities with modern washers and dryers for all your needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={HeartHandshake}>Testimonials</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">What Our Residents Say</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Real stories from students who have experienced life at HostelPro. Their satisfaction is our best advertisement.</p>
            </div>
            {loadingTestimonials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                </div>
            ) : error ? (
                <p className="text-destructive text-center">Could not load testimonials.</p>
            ) : testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <Card key={testimonial._id} className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center mb-4">
                                    <Avatar className="h-14 w-14 mr-4 border-2 border-primary">
                                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-lg">{testimonial.name}</p>
                                    </div>
                                </div>
                                <div className="flex mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                                    {[...Array(5 - testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-muted-foreground" />)}
                                </div>
                                <blockquote className="text-muted-foreground italic text-base border-l-4 border-primary pl-4">
                                    {testimonial.message}
                                </blockquote>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center">No testimonials yet.</p>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <SectionTag icon={HelpCircle}>FAQ</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Frequently Asked Questions</h2>
              <p className="mt-2 text-muted-foreground">Have questions? We have answers. Here are some of the most common inquiries we receive.</p>
            </div>
             {loadingFaqs ? (
                <div className="space-y-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
            ) : error ? (
                <p className="text-destructive text-center">Could not load FAQs.</p>
            ) : faqs.length > 0 ? (
                 <Accordion type="single" collapsible className="w-full">
                    {faqs.map(faq => (
                        <AccordionItem key={faq._id} value={faq._id}>
                            <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                 <p className="text-muted-foreground text-center">No FAQs available at the moment.</p>
            )}
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="w-full py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={MapPin}>Location</SectionTag>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Prime Location</h2>
              <p className="mt-2 text-muted-foreground">Conveniently located to keep you connected to campus and the city.</p>
            </div>
            <div className="rounded-lg overflow-hidden border-4 border-white shadow-2xl aspect-[16/6]">
                {loadingLocation ? (
                    <Skeleton className="w-full h-full" />
                ) : location.mapLink ? (
                    <iframe
                        src={location.mapLink}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Map link not available.</p>
                    </div>
                )}
            </div>
             <div className="text-center mt-8">
              {loadingLocation ? (
                <>
                  <Skeleton className="h-7 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-full max-w-2xl mx-auto mt-3" />
                  <Skeleton className="h-5 w-48 mx-auto mt-3" />
                </>
              ) : (
                <>
                  <p className="font-semibold text-xl">{location.address || 'Address not set'}</p>
                  <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Just a 5-minute walk from the main university campus and a 10-minute bus ride from the city center. All essential services are within easy reach.</p>
                  {location.mapLink && (
                    <Button asChild variant="link" className="mt-2 text-lg">
                        <a href={location.mapLink.replace('/embed','/view')} target="_blank" rel="noopener noreferrer">Get Directions on Google Maps</a>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* New Feedback Section */}
        <section id="feedback" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <SectionTag icon={MessageSquarePlus}>Share Your Feedback</SectionTag>
            <div className="max-w-3xl mx-auto text-center">
               <h2 className="text-3xl md:text-4xl font-bold font-headline">Help Us Improve</h2>
               <p className="mt-4 text-lg text-muted-foreground">Your feedback is invaluable to us. Whether you have a suggestion, a compliment, or a concern, we want to hear it. Sharing your experience helps us make HostelPro a better place for everyone.</p>
               <Button size="lg" className="mt-8 transform hover:scale-105 transition-transform" onClick={() => setFeedbackModalOpen(true)}>
                 Leave Feedback
               </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Join the HostelPro Community?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our application process is quick, easy, and completely online. Secure your spot and find your new home today. We can't wait to welcome you.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform">
                <Link href="/apply">Apply Now & Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>

    <GalleryImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
    />
    <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
    />
    </>
  );
}
