import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, FileText, ShieldCheck } from 'lucide-react';
import PublicHeader from '@/components/public-header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Experience a New Standard of Hostel Living.
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ready to find your new home? Our application process is quick and easy.
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
