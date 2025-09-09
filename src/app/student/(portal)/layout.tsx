
'use client';

import StudentSidebar from "@/components/student-sidebar";
import StudentHeader from "@/components/student-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('studentAuthToken');
    if (!token) {
      router.replace('/student/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full p-4">
        <Skeleton className="hidden md:block md:w-64" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-[calc(100vh-8rem)]" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <SidebarInset className="bg-muted/40">
          <StudentHeader />
          <main className="grid flex-1 items-start gap-8 p-4 sm:px-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
