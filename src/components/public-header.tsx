import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, University, User, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
    {children}
  </Link>
);

export default function PublicHeader() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/apply', label: 'Apply' },
    { href: '/status', label: 'Check Status' },
    { href: '/notices', label: 'Notices' },
    { href: '/complaint', label: 'File Complaint' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <University className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">HostelPro</span>
          </Link>
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
            ))}
          </nav>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
              <University className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">HostelPro</span>
            </Link>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search bar here if needed */}
          </div>
          <nav className="flex items-center gap-2">
             <Button asChild variant="ghost" size="icon">
              <Link href="/student/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Student Login</span>
              </Link>
            </Button>
             <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                 <Shield className="h-5 w-5" />
                 <span className="sr-only">Admin Login</span>
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
