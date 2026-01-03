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

// Import Dialog vừa tạo
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'default';
    case 'Done': return 'secondary';
    case 'Planning': return 'outline';
    default: return 'default';
  }
};

export function ProjectListView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State bật tắt form tạo mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const router = useRouter();

  const fetchProjects = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Lỗi API:", error);
      // setProjects(MOCK_PROJECTS); // Nếu muốn test
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

  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300";
  const glassInputClass = "bg-white/40 dark:bg-white/5 border-white/20 focus-visible:ring-orange-500/50"; // Focus màu cam

  return (
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto min-h-screen bg-[#0a0a0a]">

      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Logo Icon cũng đổi sang tone cam cho đồng bộ */}
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Quản lý Dự Án</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Danh sách tổng hợp</span>
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {projects.length}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-orange-400"
          >
            <RefreshCcw className={cn("h-4 w-4 transition-all duration-700", isRefreshing && "animate-spin text-orange-500")} />
          </Button>

          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input type="search" placeholder="Tìm kiếm dự án..." className={cn("pl-9 text-white placeholder:text-zinc-500", glassInputClass)} />
          </div>

          {/* [ĐỔI MÀU]: Nút Tạo mới sang Cam */}
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/20"
          >
            <Plus className="h-4 w-4" /> Tạo mới
          </Button>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* GRID CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">

        {/* Loading */}
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[250px] rounded-xl bg-white/5 animate-pulse border border-white/5" />
        ))}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
            <LayoutGrid className="h-16 w-16 mb-4 opacity-20" />
            <p>Chưa có dự án nào. Hãy tạo dự án đầu tiên!</p>
          </div>
        )}

        {/* Projects List */}
        {!isLoading && projects.map((project) => (
          <Card
            key={project._id || project.id}
            onClick={() => router.push(`/control/projects/${project._id || project.id}/workitems`)}
            className={cn("group cursor-pointer relative overflow-hidden hover:border-orange-500/30", glassCardClass)}
          >
            {/* Hover Glow Effect Cam */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-500" />

            <CardHeader className="pb-3 relative z-10">
              <div className="flex justify-between items-start mb-3">
                <Badge className={cn("backdrop-blur-md shadow-none",
                  project.status === 'In Progress' ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" :
                    project.status === 'Done' ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" :
                      "bg-zinc-500/20 text-zinc-300 hover:bg-zinc-500/30"
                )}>
                  {project.status}
                </Badge>

                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10 -mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/control/projects/${project._id || project.id}/settings`);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* [ĐỔI MÀU]: Hover text title sang cam */}
              <CardTitle className="text-lg font-bold text-white leading-tight group-hover:text-orange-400 transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10 mt-2 text-zinc-400 text-xs">
                {project.description}
              </CardDescription>
            </CardHeader>

            <div className="px-6">
              <Separator className="bg-white/10" />
            </div>

            <CardFooter className="pt-4 flex justify-between items-center relative z-10">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 3).map((member, i) => (
                  <Avatar key={i} className="h-7 w-7 border-2 border-[#18181b]">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[9px] bg-zinc-800 text-zinc-300">
                      {member.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.members?.length > 3 && (
                  <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-300 border-2 border-[#18181b]">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center text-xs text-zinc-500 font-medium">
                <Users className="h-3 w-3 mr-1.5" /> {project.members?.length || 0}
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* [ĐỔI MÀU]: Hover icon tạo mới sang cam */}
        {!isLoading && (
          <div
            onClick={() => setIsCreateOpen(true)}
            className="group h-full min-h-[220px] cursor-pointer"
          >
            <div className="h-full w-full rounded-xl border-2 border-dashed border-white/10 hover:border-orange-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-orange-500 group-hover:text-white text-zinc-400 transition-all duration-300">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-semibold text-zinc-500 group-hover:text-orange-400 transition-colors text-sm">
                Tạo Dự Án Mới
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nhúng Dialog vào đây */}
      <ProjectCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />

    </div>
  );
}