

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
import { LayoutDashboard, Users, MessageSquareWarning, LogOut, University, Bell, Bed, UsersRound, ClipboardList, PanelLeft, CircleDollarSign, Box, KeyRound, BarChart, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { LogoutConfirmationDialog } from './modals/logout-confirmation-modal';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/rooms', label: 'Rooms', icon: Bed },
  { href: '/admin/allocation', label: 'Room Allocation', icon: KeyRound },
  { href: '/admin/fees', label: 'Fee Management', icon: CircleDollarSign },
  { href: '/admin/inventory', label: 'Inventory', icon: Box },
  { href: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { href: '/admin/notices', label: 'Notices', icon: Bell },
  { href: '/admin/board-members', label: 'Board Members', icon: UsersRound },
  { href: '/admin/reports', label: 'Reports', icon: BarChart },
  { href: '/admin/settings', label: 'Settings', icon: SlidersHorizontal },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
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
                  isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
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
              <SidebarMenuButton onClick={() => setLogoutModalOpen(true)} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <LogoutConfirmationDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
