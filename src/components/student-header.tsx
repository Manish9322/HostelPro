import { SidebarTrigger } from "@/components/ui/sidebar"
import { mockStudents } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function StudentHeader() {
  const student = mockStudents[0];
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
       <div className="flex-1">
        <h1 className="font-semibold text-lg">Welcome, {student.name.split(' ')[0]}!</h1>
      </div>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}