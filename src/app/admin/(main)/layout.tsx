
'use client';

import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!adminLoggedIn) {
      router.replace('/admin/login');
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
        <AdminSidebar />
        <SidebarInset className="bg-muted/40">
          <AdminHeader />
          <main className="grid flex-1 items-start gap-8 p-4 sm:px-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
