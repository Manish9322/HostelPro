
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, User, MessageSquareWarning, LogOut, University, Bed, UsersRound, PanelLeft, CreditCard, Home, HelpCircle } from 'lucide-react';

const menuItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/student/room', label: 'Room Details', icon: Bed },
  { href: '/student/complaints', label: 'My Complaints', icon: MessageSquareWarning },
  { href: '/student/payments', label: 'Payments', icon: CreditCard },
  { href: '/student/directory', label: 'Resident Directory', icon: UsersRound },
  { href: '/student/inquiry', label: 'Inquiry / Request', icon: HelpCircle },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link href="/student/dashboard" className="flex items-center gap-2.5">
          <University className="w-6 h-6 text-sidebar-primary" />
          <span className="text-lg font-semibold font-headline group-data-[state=collapsed]:hidden whitespace-nowrap">HostelPro</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleSidebar()} tooltip="Collapse Sidebar">
              <PanelLeft />
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to Public Site">
              <Link href="/">
                <Home />
                <span>Public Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/student/login">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
