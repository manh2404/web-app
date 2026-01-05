'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import {
  Plus, Search, LayoutGrid, MoreHorizontal, Users, RefreshCcw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import Dialog
import { ProjectCreateDialog } from './project-create-dialog';

interface Member {
  name: string;
  avatar: string;
}

interface Project {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  members: Member[];
  dueDate: string;
}

export function ProjectListView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const router = useRouter();

  const fetchProjects = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProjects(false);
    toast.success("Đã làm mới dữ liệu");
  };

  // --- STYLE CLASSES ---
  const cardClass = cn(
    "group cursor-pointer relative overflow-hidden transition-all duration-300",
    "bg-white dark:bg-[#121212]",
    "border-2 border-zinc-200 dark:border-zinc-800",
    "hover:border-orange-500 dark:hover:border-orange-500",
    "shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
  );

  const inputClass = cn(
    "pl-9 bg-white dark:bg-zinc-900",
    "border-2 border-zinc-200 dark:border-zinc-800",
    "text-zinc-900 dark:text-white placeholder:text-zinc-400",
    "focus-visible:ring-0 focus-visible:border-orange-500 transition-colors"
  );

  return (
    // [FIX QUAN TRỌNG]
    // 1. h-[calc(100vh-4rem)]: Chiều cao = Màn hình - (Chiều cao Topbar ~64px).
    //    Nếu Topbar của cậu cao hơn hoặc thấp hơn, hãy chỉnh số 4rem này (ví dụ 3.5rem hoặc 5rem).
    // 2. overflow-hidden: Cắt bỏ mọi thứ thừa ra ngoài, bắt buộc con phải cuộn bên trong.
    <div className="flex flex-col w-full bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white overflow-hidden h-[calc(100vh-5.1rem)]">

      {/* HEADER: Cố định (flex-none) */}
      <div className="flex-none p-6 pb-4 space-y-6 bg-zinc-50 dark:bg-[#0a0a0a] z-20 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quản lý Dự Án</h1>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>Danh sách tổng hợp</span>
                <Badge variant="secondary" className="bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-white">
                  {projects.length}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:text-orange-500 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
            >
              <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin text-orange-500")} />
            </Button>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input type="search" placeholder="Tìm kiếm dự án..." className={inputClass} />
            </div>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-md shadow-orange-500/20 border-0"
            >
              <Plus className="h-5 w-5" /> Tạo mới
            </Button>
          </div>
        </div>
      </div>

      {/* [FIX QUAN TRỌNG] CONTENT:
          - min-h-0: Bắt buộc để scroll hoạt động trong Flexbox lồng nhau.
          - overflow-y-auto: Tạo thanh cuộn riêng cho vùng này.
      */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0 scroll-smooth">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">

          {/* Loading Skeletons */}
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-xl bg-zinc-200 dark:bg-zinc-900 animate-pulse border-2 border-transparent" />
          ))}

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
              <LayoutGrid className="h-16 w-16 mb-4 opacity-20" />
              <p>Chưa có dự án nào. Hãy tạo dự án đầu tiên!</p>
            </div>
          )}

          {/* Projects List */}
          {!isLoading && projects.map((project) => (
            <Card
              key={project._id || project.id}
              onClick={() => router.push(`/control/projects/${project._id || project.id}/workitems`)}
              className={cardClass}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-500/5 dark:via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-3 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1"></div>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 -mr-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/control/projects/${project._id || project.id}/settings`);
                    }}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 mt-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <div className="px-6">
                <Separator className="bg-zinc-100 dark:bg-zinc-800" />
              </div>

              <CardFooter className="pt-4 flex justify-between items-center relative z-10">
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                  {project.members?.slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-white dark:border-[#121212] shadow-sm">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-[10px] bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold">
                        {member.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border-2 border-white dark:border-[#121212] shadow-sm">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  {project.members?.length || 0}
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Card */}
          {!isLoading && (
            <div
              onClick={() => setIsCreateOpen(true)}
              className="group h-full min-h-[220px] cursor-pointer"
            >
              <div className={cn(
                "h-full w-full rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300",
                "border-2 border-dashed border-zinc-300 dark:border-zinc-800",
                "bg-zinc-50 dark:bg-white/5",
                "hover:border-orange-500 dark:hover:border-orange-500",
                "hover:bg-orange-50/50 dark:hover:bg-orange-500/10"
              )}>
                <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm group-hover:bg-orange-500 group-hover:text-white text-zinc-400 transition-all duration-300 group-hover:scale-110">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Tạo Dự Án Mới
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />

    </div>
  );
}