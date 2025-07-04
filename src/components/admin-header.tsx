import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      {/* Header content can go here in the future, e.g. breadcrumbs */}
    </header>
  )
}
