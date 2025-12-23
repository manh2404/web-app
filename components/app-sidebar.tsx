'use client';

import * as React from 'react';
// Import thêm icon LifeBuoy (Hỗ trợ) và Send (Phản hồi)
import { Command, FolderKanban, SquareKanban, Briefcase, Rocket, LifeBuoy, Send } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import { IUser } from "@/models/user.model";
import { IMenuSideBar } from "@/models/menu-sidebar.model";
import { useTranslation } from "react-i18next";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: IUser;
  data: IMenuSideBar
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { config } = useAppContext()
  const { t } = useTranslation();

  // --- PHẦN 1: MENU DỰ ÁN (CẬU ĐÃ LÀM) ---
  const projectMenu = {
    title: "Dự Án",
    url: "/control/projects",
    icon: SquareKanban,
    isActive: false,
    items: [
      {
        title: "Tạo project",
        url: "/control/projects/create",
      },
      {
        title: "WorkItem",
        url: "/control/projects/workitem",
      },
    ],
  };

  // Support & Feedback
  const supportMenu = [
    {
      title: "Hỗ trợ",
      url: "/control/support",
      icon: LifeBuoy,
    },
    {
      title: "Phản hồi",
      url: "/control/feedback",
      icon: Send,
    },
  ];

  // --- PHẦN 3: GỘP MENU ---
  const mergedNavMain = [...(props.data.navMain || []), projectMenu];

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/control">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{config.title}</span>
                  <span className="truncate text-xs">{t('i_dashboard')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mergedNavMain} />

        {/* --- PHẦN 4: DÙNG MENU HỖ TRỢ MỚI TẠO --- */}
        {/* Thay vì dùng props.data.navSecondary, ta dùng biến supportMenu vừa tạo */}
        <NavSecondary items={supportMenu} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}