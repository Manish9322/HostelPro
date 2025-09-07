
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Users, ShieldCheck, Wifi, Dumbbell, UtensilsCrossed, BookOpen, Tv, Star, University, FileCheck2, Building, Handshake, Smile, Shield, Trophy, PartyPopper, Lightbulb, Images, HeartHandshake, HelpCircle, MapPin, Sparkles } from 'lucide-react';
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

const SectionTag = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium text-primary tracking-widest uppercase">{children}</span>
  </div>
)

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="space-y-6">
                        <SectionTag icon={University}>Welcome to HostelPro</SectionTag>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
                           Your New Home Away from Home.
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
                            Discover a safe, comfortable, and vibrant living space designed exclusively for students. Simplify your life with our modern amenities and streamlined digital experience.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
                            <Link href="/apply">Apply for a Room</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="transform hover:scale-105 transition-transform">
                            <Link href="#features">Explore Features</Link>
                        </Button>
                    </div>
                    <div className="w-full max-w-5xl pt-12">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Smile className="w-8 h-8 text-primary"/>
                          <p className="text-xl font-bold">500+</p>
                          <p className="text-sm text-muted-foreground">Happy Residents</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Shield className="w-8 h-8 text-primary"/>
                          <p className="text-xl font-bold">150+</p>
                          <p className="text-sm text-muted-foreground">Secure Rooms</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Trophy className="w-8 h-8 text-primary"/>
                          <p className="text-xl font-bold">10+</p>
                          <p className="text-sm text-muted-foreground">Years of Service</p>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                          <University className="w-8 h-8 text-primary"/>
                          <p className="text-xl font-bold">5</p>
                          <p className="text-sm text-muted-foreground">Partner Universities</p>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                          <PartyPopper className="w-8 h-8 text-primary"/>
                          <p className="text-xl font-bold">20+</p>
                          <p className="text-sm text-muted-foreground">Community Events</p>
                        </div>
                      </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x600.png" data-ai-hint="hostel room" alt="Spacious and bright hostel room" width={400} height={600} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x300.png" data-ai-hint="hostel lounge" alt="Comfortable common lounge area" width={400} height={300} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x300.png" data-ai-hint="study area" alt="Quiet and well-lit study room" width={400} height={300} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x600.png" data-ai-hint="hostel exterior" alt="Modern exterior of the hostel building" width={400} height={600} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x300.png" data-ai-hint="hostel cafeteria" alt="Hostel cafeteria with various food options" width={400} height={300} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="overflow-hidden rounded-lg shadow-md group">
                  <Image src="https://placehold.co/400x300.png" data-ai-hint="recreation area" alt="Recreation area with games" width={400} height={300} className="rounded-lg object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-14 w-14 mr-4 border-2 border-primary">
                      <AvatarImage src="https://placehold.co/56x56.png" data-ai-hint="person avatar" alt="Avatar of Sarah J." />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">Sarah J.</p>
                      <p className="text-sm text-muted-foreground">Computer Science, Year 2</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current text-foreground" />)}
                  </div>
                  <blockquote className="text-muted-foreground italic text-base border-l-4 border-primary pl-4">
                    "Living at HostelPro has been a fantastic experience. It's clean, safe, and the community is amazing. The staff is always helpful and responsive to any issues."
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-14 w-14 mr-4 border-2 border-primary">
                      <AvatarImage src="https://placehold.co/56x56.png" data-ai-hint="person avatar" alt="Avatar of Michael B." />
                      <AvatarFallback>MB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">Michael B.</p>
                      <p className="text-sm text-muted-foreground">Mechanical Engineering, Year 3</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current text-foreground" />)}
                  </div>
                  <blockquote className="text-muted-foreground italic text-base border-l-4 border-primary pl-4">
                    "Great facilities, especially the high-speed Wi-Fi and dedicated study areas. It's the perfect environment for focusing on my studies without any distractions."
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-14 w-14 mr-4 border-2 border-primary">
                      <AvatarImage src="https://placehold.co/56x56.png" data-ai-hint="person avatar" alt="Avatar of Linda K." />
                      <AvatarFallback>LK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">Linda K.</p>
                      <p className="text-sm text-muted-foreground">Fine Arts, Year 1</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current text-foreground" />)}
                    <Star className="w-5 h-5 text-muted" />
                  </div>
                  <blockquote className="text-muted-foreground italic text-base border-l-4 border-primary pl-4">
                    "I've made so many friends here. The common rooms and community events are great for socializing. It truly feels like a second home, not just a hostel."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">What is the application deadline?</AccordionTrigger>
                <AccordionContent className="text-base">
                  Applications are accepted on a rolling basis. However, we recommend applying at least two months before the start of the semester to secure your spot, as rooms are allocated on a first-come, first-served basis.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">Are utilities included in the rent?</AccordionTrigger>
                <AccordionContent className="text-base">
                  Yes, all utilities including water, electricity, heating, and high-speed Wi-Fi are included in the monthly rent. There are no hidden charges.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">Is there a curfew?</AccordionTrigger>
                <AccordionContent className="text-base">
                  For the safety and security of all our residents, the main gates are closed from 11:00 PM to 5:00 AM. Residents can enter and exit during these hours using their personal electronic access cards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">What is the guest policy?</AccordionTrigger>
                <AccordionContent className="text-base">
                  Residents are allowed to have guests in common areas during visiting hours (9:00 AM to 9:00 PM). For safety reasons, overnight guests are not permitted in the rooms.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">Can I choose my roommate?</AccordionTrigger>
                <AccordionContent className="text-base">
                  You can specify a preferred roommate in your application form. We do our best to accommodate such requests, provided both students have applied and listed each other.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg">Are there laundry facilities available?</AccordionTrigger>
                <AccordionContent className="text-base">
                  Yes, we have on-site laundry rooms equipped with modern washers and dryers that are available for use 24/7 at a nominal cost.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
            <div className="rounded-lg overflow-hidden border-4 border-white shadow-2xl">
              <Image src="https://placehold.co/1200x400.png" data-ai-hint="city map" alt="Hostel Location Map" width={1200} height={400} className="w-full object-cover" />
            </div>
            <div className="text-center mt-8">
              <p className="font-semibold text-xl">HostelPro, 123 University Lane, College Town, USA 12345</p>
              <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Just a 5-minute walk from the main university campus and a 10-minute bus ride from the city center. All essential services are within easy reach.</p>
              <Button asChild variant="link" className="mt-2 text-lg">
                <a href="#" target="_blank" rel="noopener noreferrer">Get Directions on Google Maps</a>
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
  );
}
