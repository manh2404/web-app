'use client';

import * as React from 'react';
import {
  Command,
  SquareKanban,
  LifeBuoy,
  Send,
  PieChart,
  ChevronRight,
  Plus,
  FolderKanban,
  MoreHorizontal,
  LinkIcon, // Thêm icon này để làm nút sao chép
  Settings2  // Thêm icon này để làm nút cài đặt
} from 'lucide-react';

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
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

// Import thêm DropdownMenu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

  const projectMenuStatic = {
    title: "Dự Án",
    url: "/control/projects",
    icon: SquareKanban,
    isActive: false,
  };

  const mergedNavMain = [...(props.data.navMain || []), projectMenuStatic];

  const realProjects = [
    { id: '1', name: 'Batek', icon: '👇' },
    { id: '2', name: 'AI Platform', icon: '🚀' },
  ];

  const supportMenu = [
    { title: "Hỗ trợ", url: "/control/support", icon: LifeBuoy },
    { title: "Phản hồi", url: "/control/feedback", icon: Send },
  ];

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

      <SidebarContent className="overflow-y-auto custom-scrollbar">
        <NavMain items={mergedNavMain} />

        <div className="px-3 my-2">
          <div className="h-[1px] bg-white/10 w-full" />
        </div>

        <Collapsible defaultOpen className="group/workspace">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-white transition-colors cursor-pointer">
                <span>Dự Án</span>
                <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/workspace:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarMenu>
                {realProjects.map((project) => (
                  <Collapsible key={project.id} asChild className="group/project">
                    <SidebarMenuItem className="relative">

                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="hover:bg-white/5 cursor-pointer pr-16 h-9">
                          <span className="text-base">{project.icon}</span>
                          <span className="font-medium">{project.name}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <div className="absolute right-1.5 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover/project:opacity-100 transition-opacity z-10">

                        {/* --- PHẦN SỬA: BIẾN NÚT 3 CHẤM THÀNH DROPDOWN MENU --- */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              className="hover:bg-white/10 h-7 w-7 flex items-center justify-center rounded-md transition-colors mr-8"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                              <MoreHorizontal className="size-4 text-white/50" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>

                          {/* FORM NHO NHỎ NHƯ ẢNH MẪU */}
                          <DropdownMenuContent
                            align="end"
                            side="right"
                            className="w-48 bg-zinc-900/95 border-white/10 text-white backdrop-blur-xl rounded-xl shadow-2xl"
                          >
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5"
                              onClick={() => {
                                const link = `${window.location.origin}/control/projects/${project.id}`;
                                navigator.clipboard.writeText(link);
                                // Thêm thông báo nếu cậu đã cài Toast, không thì alert tạm
                                alert("Đã sao chép liên kết dự án!");
                              }}
                            >
                              <LinkIcon className="size-4 opacity-70" />
                              <span>Sao chép liên kết</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5 text-red-400 focus:text-red-400"
                              onClick={() => {
                                // Logic lưu trữ nếu cần
                                alert("Đã đưa vào lưu trữ!");
                              }}
                            >
                              <FolderKanban className="size-4 opacity-70" />
                              <span>Lưu trữ</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5"
                              asChild
                            >
                              <Link href={`/control/projects/${project.id}/settings`}>
                                <Settings2 className="size-4 opacity-70" />
                                <span>Cài đặt</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="h-7 w-7 flex items-center justify-center hover:bg-white/10 rounded-md transition-all data-[state=open]:rotate-90">
                            <ChevronRight className="size-3.5 text-white/50" />
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-white/10 ml-4">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/control/projects/workitem`} className="flex items-center gap-2">
                                <SquareKanban className="size-3.5" />
                                <span>WorkItem</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/control/projects/statistics`} className="flex items-center gap-2">
                                <PieChart className="size-3.5" />
                                <span>Thống kê</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <NavSecondary items={supportMenu} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}