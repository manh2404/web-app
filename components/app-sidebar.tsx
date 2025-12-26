'use client';

import * as React from 'react';
import { useEffect, useState } from 'react'; // Thêm hook
import axios from 'axios'; // Thêm axios
import { useParams } from 'next/navigation'; // Thêm để lấy ID từ URL
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
  LinkIcon,
  Settings2
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
import { cn } from "@/lib/utils"; // Import cn để xử lý class động

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: IUser;
  data: IMenuSideBar
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { config } = useAppContext()
  const { t } = useTranslation();
  const params = useParams(); // Lấy params từ URL
  const currentProjectId = params?.id; // ID dự án hiện tại

  // 1. STATE CHỨA DỰ ÁN THẬT
  const [projects, setProjects] = useState<any[]>([]);

  // 2. FETCH DATA TỪ MONGODB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        // Map dữ liệu MongoDB sang format Sidebar cần
        const mappedProjects = response.data.map((p: any) => ({
          id: p._id,
          name: p.title,
          icon: '📦', // Icon mặc định vì DB chưa có field icon
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

  const mergedNavMain = [...(props.data.navMain || []), projectMenuStatic];

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
            {/* 3. SỬA LABEL ĐỂ THÊM NÚT PLUS */}
            <div className="group flex items-center justify-between pr-2 mb-2">
              <SidebarGroupLabel asChild className="p-0 flex-1">
                <CollapsibleTrigger className="flex items-center cursor-pointer h-8 text-zinc-300 hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase tracking-wider pl-2 select-none">
                    Dự Án
                  </span>
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Nút tạo nhanh dự án */}
                <Link href="/control/projects/create">
                  <SidebarMenuButton
                    size="sm"
                    className="h-6 w-6 rounded-md hover:bg-white/10 text-zinc-400 hover:text-indigo-400 transition-all p-0 flex items-center justify-center"
                  >
                    <Plus className="size-3.5" />
                  </SidebarMenuButton>
                </Link>

                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    size="sm"
                    className="h-6 w-6 rounded-md bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white p-0 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/workspace:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent>
              <SidebarMenu>
                {/* 4. MAP DỰ ÁN THẬT TỪ STATE */}
                {projects.map((project) => (
                  <Collapsible
                    key={project.id}
                    asChild
                    className="group/project"
                    defaultOpen={project.id === currentProjectId} // Tự mở nếu đang ở dự án này
                  >
                    <SidebarMenuItem className="relative">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "hover:bg-white/5 cursor-pointer pr-16 h-9",
                            project.id === currentProjectId && "bg-white/10 text-indigo-400" // Highlight
                          )}
                        >
                          <span className="text-base">{project.icon}</span>
                          <span className="font-medium">{project.name}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <div className="absolute right-1.5 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover/project:opacity-100 transition-opacity z-10">
                        {/* Dropdown Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              className="hover:bg-white/10 h-7 w-7 flex items-center justify-center rounded-md transition-colors mr-8"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                              <MoreHorizontal className="size-4 text-white/50" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>

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
                                alert("Đã sao chép liên kết dự án!");
                              }}
                            >
                              <LinkIcon className="size-4 opacity-70" />
                              <span>Sao chép liên kết</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer focus:bg-white/10 py-2.5 text-red-400 focus:text-red-400"
                              onClick={() => {
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
                              {/* Cập nhật Link WorkItem động theo ID */}
                              <Link href={`/control/projects/${project.id}/workitems`} className="flex items-center gap-2">
                                <SquareKanban className="size-3.5" />
                                <span>WorkItem</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              {/* Cập nhật Link Thống kê động theo ID */}
                              <Link href={`/control/projects/${project.id}/statistics`} className="flex items-center gap-2">
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

                {/* Hiển thị khi chưa có dự án */}
                {projects.length === 0 && (
                  <div className="text-[10px] text-zinc-600 px-4 py-2 italic text-center">
                    Đang tải hoặc chưa có dự án...
                  </div>
                )}
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