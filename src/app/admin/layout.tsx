import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarRail />
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
