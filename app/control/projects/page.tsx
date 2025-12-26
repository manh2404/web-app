  'use client';

  import * as React from 'react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import Link from 'next/link';
  import {
    Plus, Search, LayoutGrid, MoreHorizontal, Users, RefreshCcw
  } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Separator } from '@/components/ui/separator';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { cn } from '@/lib/utils';

  // --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
  interface Member {
    name: string;
    avatar: string;
  }

  interface Project {
    id: string; // Chuyển sang string để khớp với MongoDB ID (_id)
    _id?: string;
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

  export default function ProjectsListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Hàm fetch dữ liệu dùng chung
    const fetchProjects = async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dự án:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    // Gọi lần đầu khi mount
    useEffect(() => {
      fetchProjects();
    }, []);

    // Hàm Refresh dữ liệu
    const handleRefresh = async () => {
      setIsRefreshing(true);
      await fetchProjects(false); // Không hiện chữ "Đang kết nối API" để tránh nháy màn hình
    };

    const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300";
    const glassInputClass = "bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-indigo-500/50";

    return (
      <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dự Án</h1>
                <Badge variant="secondary" className="bg-white/50 dark:bg-white/10 backdrop-blur-md">
                  {projects.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

            {/* NÚT REFRESH: Đặt bên trái Search */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="bg-white/40 border-white/20 hover:bg-white/60 dark:bg-black/20 backdrop-blur-md transition-all group"
            >
              <RefreshCcw className={cn(
                "h-4 w-4 transition-all duration-700",
                isRefreshing ? "animate-spin text-indigo-500" : "group-hover:rotate-180"
              )} />
            </Button>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm dự án thật..."
                className={cn("pl-9", glassInputClass)}
              />
            </div>

            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-indigo-500/20 transition-all" asChild>
              <Link href="/control/projects/create">
                <Plus className="h-4 w-4" /> Tạo Dự Án
              </Link>
            </Button>
          </div>
        </div>

        {/* Danh sách dự án */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {isLoading ? (
            <p className="text-green-50 animate-pulse font-medium">Đang kết nối...</p>
          ) : (
            projects.map((project) => (
              <Card key={project._id || project.id} className={cn("group cursor-pointer", glassCardClass)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={getStatusColor(project.status) as any} className="backdrop-blur-md">
                      {project.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                      <Link href={`/control/projects/${project._id || project.id}/settings`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-green-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10 mt-1">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <Separator className="bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                <CardFooter className="pt-4 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-white dark:border-zinc-900 shadow-sm">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-[10px] font-bold">
                          {member.name ? member.name.substring(0, 2).toUpperCase() : "??"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members?.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-white/80 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-zinc-900">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <Users className="h-3 w-3 mr-1" /> {project.members?.length || 0} tv
                  </div>
                </CardFooter>
              </Card>
            ))
          )}

          {/* Nút Tạo Mới Card Ảo */}
          {!isLoading && (
            <Button variant="outline" className="h-full min-h-[200px] flex flex-col gap-4 border-2 border-dashed border-white/30 hover:border-indigo-500/50 hover:bg-white/50 dark:hover:bg-white/5 transition-all rounded-xl group" asChild>
              <Link href="/control/projects/create">
                <div className="p-4 rounded-full bg-white/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-semibold text-muted-foreground group-hover:text-indigo-600 transition-all">
          Tạo Dự Án Mới
        </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }