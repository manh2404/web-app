'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  Command, SquareKanban, LifeBuoy, Send, PieChart, ChevronRight, Plus, MoreHorizontal, LinkIcon, Settings2
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction, SidebarGroup, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import { IUser } from "@/models/user.model";
import { IMenuSideBar } from "@/models/menu-sidebar.model";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: IUser;
  data: IMenuSideBar
}


function getRoles(user: IUser): string[] {
  const anyUser = user as any;
  if (Array.isArray(anyUser.roles)) return anyUser.roles.map(String);
  if (typeof anyUser.role === "string") return [anyUser.role];
  return [];
}

function hasRole(user: IUser, role: string) {
  return getRoles(user).includes(role);
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { config } = useAppContext();
  const { t } = useTranslation();
  const params = useParams();
  const currentProjectId = params?.id; // Lấy ID từ URL để highlight menu đang chọn
  const [projects, setProjects] = useState<any[]>([]);

  // Lấy danh sách dự án từ Database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        const mappedProjects = response.data.map((p: any) => ({
          id: p._id, // Map _id của MongoDB sang id dùng cho giao diện
          name: p.title,
          icon: '📦',
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Lỗi tải sidebar projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const projectMenuStatic = {
    title: "Dự Án",
    url: "/control/projects",
    icon: SquareKanban,
    isActive: false,
  };
  const isAdmin = hasRole(props.user, "admin");
  const isStaff = hasRole(props.user, "staff");
  // const isCustomer = hasRole(props.user, "customer");
  // if (isCustomer) return null;


  const canSeeAnyMenu = isAdmin || isStaff;
  const canSeeProjects = isAdmin || isStaff;
  const canSeeUsersMenu = isAdmin;
  // const canSeeFooterUser = isAdmin || isStaff || isCustomer;

  const supportMenu = [
    { title: "Hỗ trợ", url: "/control/support", icon: LifeBuoy },
    { title: "Phản hồi", url: "/control/feedback", icon: Send },
  ];
  const filteredSupportMenu = canSeeAnyMenu ? supportMenu : [];
  const filteredNavMain = (props.data.navMain || []).filter((item: any) => {
    // customer: ẩn hết
    if (!canSeeAnyMenu) return false;

    // staff: ẩn menu người dùng
    if (!canSeeUsersMenu) {
      if (String(item.url || "").startsWith("/control/user")) return false;
    }

    return true;
  });

  const mergedNavMain = [...filteredNavMain, projectMenuStatic];

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

      {/* --- SIDEBAR CONTENT: CHIA LÀM 3 PHẦN FLEXBOX --- */}
      <SidebarContent className="flex flex-col h-full overflow-hidden p-0 gap-0">

        {/* PHẦN 1: MENU CHÍNH (Cố định) */}
        <div className="flex-shrink-0 px-2 py-2">
          {canSeeAnyMenu && <NavMain items={mergedNavMain} />}
          <div className="px-3 mt-2">
            <div className="h-[1px] bg-white/10 w-full" />
          </div>
        </div>

        {/* PHẦN 2: KHU VỰC DỰ ÁN (Cuộn độc lập) */}
        {canSeeProjects &&
        <div className="flex-1 flex flex-col min-h-0">
          <Collapsible defaultOpen className="flex flex-col h-full group/workspace">
            {/* TIÊU ĐỀ DỰ ÁN (Cố định) */}
            <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between group hover:bg-white/5 mx-2 rounded-md mt-2 transition-colors">
              <CollapsibleTrigger className="flex items-center cursor-pointer text-zinc-200 group-hover:text-white transition-colors flex-1">
                <span className="text-xs font-bold uppercase tracking-wider select-none">
                  Dự Án
                </span>
              </CollapsibleTrigger>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link href="/control/projects/create" title="Tạo dự án mới">
                  <SidebarMenuButton size="sm" className="h-5 w-5 rounded bg-transparent hover:bg-white/20 text-zinc-400 hover:text-indigo-400 p-0 flex items-center justify-center">
                    <Plus className="size-3.5" />
                  </SidebarMenuButton>
                </Link>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton size="sm" className="h-5 w-5 rounded bg-transparent text-zinc-400 hover:bg-white/20 hover:text-white p-0 flex items-center justify-center cursor-pointer">
                    <ChevronRight className="size-3 transition-transform duration-200 group-data-[state=open]/workspace:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* DANH SÁCH DỰ ÁN (Phần duy nhất cuộn ở giữa) */}
            <CollapsibleContent className="flex-1 overflow-y-auto min-h-0 custom-scrollbar px-2 pb-2">
              <SidebarMenu>
                {projects.map((project) => (
                  <Collapsible key={project.id} asChild className="group/project" defaultOpen={project.id === currentProjectId}>
                    <SidebarMenuItem className="relative">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "hover:bg-white/5 cursor-pointer pr-16 h-9",
                            // Highlight nếu đang xem dự án này
                            project.id === currentProjectId && "bg-white/10 text-indigo-400"
                          )}
                        >
                          <span className="text-base">{project.icon}</span>
                          <span className="font-medium">{project.name}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      {/* Dropdown Menu 3 chấm */}
                      <div className="absolute right-1.5 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover/project:opacity-100 transition-opacity z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction className="hover:bg-white/10 h-7 w-7 flex items-center justify-center rounded-md transition-colors mr-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                              <MoreHorizontal className="size-4 text-white/50" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="right" className="w-48 bg-zinc-900/95 border-white/10 text-white backdrop-blur-xl rounded-xl shadow-2xl">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5" onClick={() => { const link = `${window.location.origin}/control/projects/${project.id}`; navigator.clipboard.writeText(link); alert("Đã sao chép liên kết dự án!"); }}>
                              <LinkIcon className="size-4 opacity-70" /><span>Sao chép liên kết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5" asChild>
                              <Link href={`/control/projects/${project.id}/settings`}><Settings2 className="size-4 opacity-70" /><span>Cài đặt</span></Link>
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

                          {/* --- LINK WORK ITEMS (Đã bao gồm ID dự án) --- */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/control/projects/${project.id}/workitems`} className="flex items-center gap-2">
                                <SquareKanban className="size-3.5" /><span>WorkItem</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* --- LINK STATISTICS (Đã bao gồm ID dự án) --- */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/control/projects/${project.id}/statistics`} className="flex items-center gap-2">
                                <PieChart className="size-3.5" /><span>Thống kê</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}

                {projects.length === 0 && (
                  <div className="text-[10px] text-zinc-300 px-4 py-2 italic text-center opacity-70">
                    Đang load dự án...
                  </div>
                )}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </div>}

        <div className="px-5">
          <div className="h-[1px] bg-white/10 w-full" />
        </div>

        {/* PHẦN 3: MENU ĐÁY (Cố định) */}
        <div className="flex-shrink-0 mt-auto px-2 py-2">
          {canSeeAnyMenu && <NavSecondary items={filteredSupportMenu} />}
        </div>

      </SidebarContent>

      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}