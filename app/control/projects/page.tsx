'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  RefreshCcw,
  MoreHorizontal,
  Calendar,
  Users,
  LayoutGrid,
  ListFilter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// --- DỮ LIỆU GIẢ LẬP ---
const mockProjects = [
  { id: 1, title: "Website E-commerce", description: "Xây dựng trang bán hàng thời trang tích hợp thanh toán VNPAY.", status: "In Progress", members: [{ name: "Alice", avatar: "https://github.com/shadcn.png" }, { name: "Bob", avatar: "" }, { name: "Charlie", avatar: "" }], dueDate: "2024-12-30" },
  { id: 2, title: "App Quản lý Kho", description: "Ứng dụng mobile Flutter cho nhân viên kho kiểm kê hàng hóa.", status: "Planning", members: [{ name: "David", avatar: "" }, { name: "Eve", avatar: "" }], dueDate: "2025-01-15" },
  { id: 3, title: "Landing Page Marketing", description: "Trang giới thiệu sản phẩm mới cho chiến dịch mùa hè 2025.", status: "Done", members: [{ name: "Alice", avatar: "https://github.com/shadcn.png" }], dueDate: "2023-11-20" },
  { id: 4, title: "Hệ thống HRM", description: "Nâng cấp module tính lương và chấm công vân tay.", status: "In Progress", members: [{ name: "Frank", avatar: "" }, { name: "Grace", avatar: "" }, { name: "Bob", avatar: "" }, { name: "Alice", avatar: "https://github.com/shadcn.png" }], dueDate: "2024-03-10" },
  { id: 5, title: "AI Chatbot Support", description: "Bot trả lời tự động tích hợp OpenAI API.", status: "In Progress", members: [{ name: "John", avatar: "" }], dueDate: "2024-04-20" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'default'; // Màu tối
    case 'Done': return 'secondary'; // Màu xám/xanh nhạt
    case 'Planning': return 'outline'; // Viền
    default: return 'default';
  }
};

export default function ProjectsListPage() {
  // Class kính mờ dùng chung
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300";
  const glassInputClass = "bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-indigo-500/50";

  return (
    // Bỏ bg-muted để lộ Gradient nền global
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">

      {/* --- PHẦN 1: HEADER (Glass Effect) --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-1">

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">Dự Án</h1>
              <Badge variant="secondary" className="bg-white/50 dark:bg-white/10 backdrop-blur-md">{mockProjects.length}</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Quản lý tiến độ và thành viên.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

          {/* Ô Search Kính Mờ */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm dự án..."
              className={cn("pl-9", glassInputClass)}
            />
          </div>

          <Button variant="outline" size="icon" className="bg-white/40 border-white/20 hover:bg-white/60">
            <Filter className="h-4 w-4" />
          </Button>

          {/* --- NÚT ADD PROJECT "SIÊU ĐẸP" --- */}
          <Button
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-0 transition-all duration-300 hover:scale-105 active:scale-95"
            asChild
          >
            <Link href="/control/projects/create">
              <Plus className="h-4 w-4" /> Tạo Dự Án Mới
            </Link>
          </Button>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH DỰ ÁN (GRID) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">

        {mockProjects.map((project) => (
          <Card key={project.id} className={cn("group cursor-pointer", glassCardClass)}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={getStatusColor(project.status) as any} className="backdrop-blur-md bg-opacity-90">
                  {project.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-3 -mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10 mt-1 text-muted-foreground/80">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex items-center text-xs font-medium bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-2 rounded-md w-fit border border-indigo-100/50 dark:border-indigo-800/50">
                <Calendar className="mr-2 h-3 w-3" />
                Hạn chót: {project.dueDate}
              </div>
            </CardContent>

            <Separator className="bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            <CardFooter className="pt-4 flex justify-between items-center">
              {/* Avatar Group nổi bật */}
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-white dark:border-zinc-900 ring-1 ring-white/20 shadow-sm transition-transform hover:-translate-y-1">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-gray-200 to-gray-400 dark:from-zinc-700 dark:to-zinc-900">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-muted-foreground font-medium">
                <Users className="h-3 w-3 mr-1" />
                {project.members.length} tv
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Card Ảo: Add New Project */}
        <Button variant="outline" className="h-full min-h-[220px] flex flex-col gap-4 border-2 border-dashed border-white/30 hover:border-indigo-500/50 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/10 backdrop-blur-sm transition-all duration-300 group rounded-xl" asChild>
          <Link href="/control/projects/create">
            <div className="p-5 rounded-full bg-white/20 dark:bg-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Plus className="h-8 w-8 text-muted-foreground group-hover:text-white" />
            </div>
            <span className="text-muted-foreground font-semibold group-hover:text-indigo-500 transition-colors">Tạo Dự Án Mới</span>
          </Link>
        </Button>

      </div>
    </div>
  );
}