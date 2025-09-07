import StudentSidebar from "@/components/student-sidebar";
import StudentHeader from "@/components/student-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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