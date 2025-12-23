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
  Users
} from 'lucide-react';

// Import các component cậu vừa tạo
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

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
const mockProjects = [
  {
    id: 1,
    title: "Website E-commerce",
    description: "Xây dựng trang bán hàng thời trang tích hợp thanh toán VNPAY.",
    status: "In Progress",
    members: [
      { name: "Alice", avatar: "https://github.com/shadcn.png" }, // Avatar thật
      { name: "Bob", avatar: "" }, // Avatar chữ cái
      { name: "Charlie", avatar: "" },
    ],
    dueDate: "2024-12-30",
  },
  {
    id: 2,
    title: "App Quản lý Kho",
    description: "Ứng dụng mobile Flutter cho nhân viên kho kiểm kê hàng hóa.",
    status: "Planning",
    members: [
      { name: "David", avatar: "" },
      { name: "Eve", avatar: "" },
    ],
    dueDate: "2025-01-15",
  },
  {
    id: 3,
    title: "Landing Page Marketing",
    description: "Trang giới thiệu sản phẩm mới cho chiến dịch mùa hè 2025.",
    status: "Done",
    members: [
      { name: "Alice", avatar: "https://github.com/shadcn.png" },
    ],
    dueDate: "2023-11-20",
  },
  {
    id: 4,
    title: "Hệ thống HRM",
    description: "Nâng cấp module tính lương và chấm công vân tay.",
    status: "In Progress",
    members: [
      { name: "Frank", avatar: "" },
      { name: "Grace", avatar: "" },
      { name: "Bob", avatar: "" },
      { name: "Alice", avatar: "https://github.com/shadcn.png" },
    ],
    dueDate: "2024-03-10",
  },
  {
    id: 5,
    title: "AI Chatbot Support",
    description: "Bot trả lời tự động tích hợp OpenAI API.",
    status: "In Progress",
    members: [
      { name: "John", avatar: "" },
    ],
    dueDate: "2024-04-20",
  },
];

// Hàm lấy màu Badge dựa theo trạng thái
const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'default';    // Đen (Mặc định)
    case 'Done': return 'secondary';         // Xám
    case 'Planning': return 'outline';       // Viền trắng
    default: return 'default';
  }
};

export default function ProjectsListPage() {
  return (
    <div className="flex flex-col h-full bg-muted/10">

      {/* --- PHẦN 1: HEADER --- */}
      <div className="flex items-center justify-between px-6 py-4 bg-background border-b sticky top-0 z-10">

        {/* Title to và đậm bên trái */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full"></div> {/* Điểm nhấn trang trí */}
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <Badge variant="secondary" className="ml-2">{mockProjects.length}</Badge>
        </div>

        {/* Toolbar bên phải */}
        <div className="flex items-center gap-2">

          {/* Nút Refresh */}
          <Button variant="ghost" size="icon" title="Refresh Data">
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Ô Search */}
          <div className="relative w-64 hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 bg-background"
            />
          </div>

          {/* Nút Filter */}
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          {/* Nút Add Project - Link sang trang create */}
          <Button size="sm" className="h-9 gap-2 from-red-800 to-indigo-400 hover:bg-green-500" asChild>
            <Link href="/control/projects/create">
              <Plus className="h-4 w-4" /> Add Project
            </Link>
          </Button>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH DỰ ÁN (GRID) --- */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {mockProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-muted-foreground/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getStatusColor(project.status) as any}>
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-3 -mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 mt-1">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted/50 p-2 rounded-md w-fit">
                  <Calendar className="mr-2 h-3 w-3" />
                  Due: {project.dueDate}
                </div>
              </CardContent>

              <Separator className="bg-border/50" />

              <CardFooter className="pt-4 flex justify-between items-center">
                {/* Avatar Group */}
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-background ring-1 ring-muted">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-[9px] font-bold">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 3 && (
                    <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium z-10">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  {project.members.length}
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Card ảo để Add nhanh (Optional - nếu thích thì giữ, ko thì xóa) */}
          <Button variant="outline" className="h-full min-h-[200px] flex flex-col gap-4 border-dashed border-2 hover:border-primary/50 hover:bg-muted/50" asChild>
            <Link href="/control/projects/create">
              <div className="p-4 rounded-full bg-muted">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">Create New Project</span>
            </Link>
          </Button>

        </div>
      </div>
    </div>
  );
}