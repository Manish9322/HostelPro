import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, FileText, ShieldCheck, Wifi, Dumbbell, UtensilsCrossed, BookOpen, Tv, Star } from 'lucide-react';
import PublicHeader from '@/components/public-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-primary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary-foreground bg-primary rounded-lg px-4 py-2 inline-block shadow-lg font-headline">
              HostelPro
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Your all-in-one solution for seamless hostel management.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/apply">Apply for a Room</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/notices">View Notices</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose HostelPro?</h2>
              <p className="mt-2 text-muted-foreground">Everything you need for a better living experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <BedDouble className="w-8 h-8 text-accent" />
                  <CardTitle>Easy Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A simple and straightforward online application process. Track your application status anytime.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <FileText className="w-8 h-8 text-accent" />
                  <CardTitle>Stay Informed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Never miss an update. Get access to the latest news and announcements via the public notice board.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                  <CardTitle>Safe & Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your safety is our priority. Submit complaints anonymously and trust our transparent handling process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Glimpses of Our Hostel</h2>
              <p className="mt-2 text-muted-foreground">A place you can call home.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-4">
                <Image src="https://placehold.co/400x600.png" data-ai-hint="hostel room" alt="Hostel Room" width={400} height={600} className="rounded-lg object-cover w-full h-full" />
              </div>
              <div className="grid gap-4">
                <Image src="https://placehold.co/400x300.png" data-ai-hint="hostel lounge" alt="Common Area" width={400} height={300} className="rounded-lg object-cover w-full h-full" />
                <Image src="https://placehold.co/400x300.png" data-ai-hint="study area" alt="Study Room" width={400} height={300} className="rounded-lg object-cover w-full h-full" />
              </div>
              <div className="grid gap-4">
                <Image src="https://placehold.co/400x600.png" data-ai-hint="hostel exterior" alt="Hostel Exterior" width={400} height={600} className="rounded-lg object-cover w-full h-full" />
              </div>
              <div className="grid gap-4">
                <Image src="https://placehold.co/400x300.png" data-ai-hint="hostel cafeteria" alt="Cafeteria" width={400} height={300} className="rounded-lg object-cover w-full h-full" />
                <Image src="https://placehold.co/400x300.png" data-ai-hint="recreation area" alt="Recreation" width={400} height={300} className="rounded-lg object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Amenities</h2>
              <p className="mt-2 text-muted-foreground">Modern facilities to make your stay comfortable.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Wifi className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">High-Speed Wi-Fi</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Study Rooms</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Cafeteria</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Dumbbell className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Gymnasium</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Tv className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Common Room</h3>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">24/7 Security</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">What Our Residents Say</h2>
              <p className="mt-2 text-muted-foreground">Real stories from students who call HostelPro home.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="https://placehold.co/48x48.png" data-ai-hint="person avatar" alt="Student 1" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sarah J.</p>
                      <p className="text-sm text-muted-foreground">Computer Science, Year 2</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "Living at HostelPro has been a fantastic experience. It's clean, safe, and the community is amazing. The staff is always helpful."
                  </blockquote>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="https://placehold.co/48x48.png" data-ai-hint="person avatar" alt="Student 2" />
                      <AvatarFallback>MB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Michael B.</p>
                      <p className="text-sm text-muted-foreground">Mechanical Engineering, Year 3</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "Great facilities, especially the high-speed Wi-Fi and study areas. It's the perfect environment for focusing on my studies."
                  </blockquote>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="https://placehold.co/48x48.png" data-ai-hint="person avatar" alt="Student 3" />
                      <AvatarFallback>LK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Linda K.</p>
                      <p className="text-sm text-muted-foreground">Fine Arts, Year 1</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "I've made so many friends here. The common rooms are great for socializing. It truly feels like a second home."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is the application deadline?</AccordionTrigger>
                <AccordionContent>
                  Applications are accepted on a rolling basis. However, we recommend applying at least two months before the start of the semester to secure your spot.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are utilities included in the rent?</AccordionTrigger>
                <AccordionContent>
                  Yes, all utilities including water, electricity, and high-speed Wi-Fi are included in the monthly rent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a curfew?</AccordionTrigger>
                <AccordionContent>
                  For the safety and security of all our residents, the main gates are closed from 11:00 PM to 5:00 AM. Residents can enter during these hours using their access cards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What is the guest policy?</AccordionTrigger>
                <AccordionContent>
                  Residents are allowed to have guests in common areas during visiting hours (9:00 AM to 9:00 PM). Overnight guests are not permitted.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Location</h2>
              <p className="mt-2 text-muted-foreground">Conveniently located near the university campus.</p>
            </div>
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <Image src="https://placehold.co/1200x400.png" data-ai-hint="city map" alt="Hostel Location Map" width={1200} height={400} className="w-full object-cover" />
            </div>
            <div className="text-center mt-6">
              <p className="font-semibold text-lg">HostelPro, 123 University Lane, College Town, USA 12345</p>
              <Button asChild variant="link" className="mt-2">
                <a href="#" target="_blank" rel="noopener noreferrer">Get Directions</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Join Our Community?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our application process is quick, easy, and completely online. Find your new home today.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/apply">Apply Now</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>&copy; {new Date().getFullYear()} HostelPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
