'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Download,
  Trash2,
  Edit,
  UserCog,
  ShieldCheck,
  User,
  Mail,
  Phone
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

// --- DỮ LIỆU GIẢ LẬP ---
const users = [
  {
    id: "U-001",
    name: "Nguyễn Văn Mạnh",
    email: "manh.nguyen@batek.vn",
    role: "Admin",
    department: "IT Dept",
    status: "Active",
    lastActive: "Just now",
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: "U-002",
    name: "Trần Thị B",
    email: "b.tran@batek.vn",
    role: "Manager",
    department: "Marketing",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: ""
  },
  {
    id: "U-003",
    name: "Lê Văn C",
    email: "c.le@batek.vn",
    role: "Staff",
    department: "Sales",
    status: "Offline",
    lastActive: "2 days ago",
    avatar: ""
  },
  {
    id: "U-004",
    name: "Phạm Thị D",
    email: "d.pham@batek.vn",
    role: "Staff",
    department: "HR",
    status: "Active",
    lastActive: "5 mins ago",
    avatar: ""
  },
  {
    id: "U-005",
    name: "Hoàng Văn E",
    email: "e.hoang@batek.vn",
    role: "Intern",
    department: "IT Dept",
    status: "Inactive",
    lastActive: "1 week ago",
    avatar: ""
  },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc user theo tên hoặc email
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-muted/10 p-6 space-y-6 overflow-y-auto">

      {/* --- PHẦN 1: HEADER & STATS --- */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhân Sự</h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản và quyền truy cập hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Xuất Excel
          </Button>
          <Button className="gap-2  from-red-800 to-indigo-400 hover:bg-green-500" asChild>
            <Link href="/control/user/create">
              <Plus className="h-4 w-4" />
              Thêm nhân viên
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Thống kê nhanh */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Hiện đang online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản trị viên</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Quyền cao nhất</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm khóa</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Cần xem xét lại</p>
          </CardContent>
        </Card>
      </div>

      {/* --- PHẦN 2: BẢNG DANH SÁCH --- */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách thành viên</CardTitle>
            {/* Search Bar */}
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Thông tin nhân viên</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="group cursor-pointer hover:bg-muted/50">

                  {/* Cột 1: Avatar + Tên + Email */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="font-bold text-primary">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 2: Role */}
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'} className="rounded-md font-normal">
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* Cột 3: Dept */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      {user.department}
                    </div>
                  </TableCell>

                  {/* Cột 4: Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' :
                          user.status === 'Offline' ? 'bg-yellow-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm">{user.status}</span>
                    </div>
                  </TableCell>

                  {/* Cột 5: Last Active */}
                  <TableCell className="text-muted-foreground text-sm">
                    {user.lastActive}
                  </TableCell>

                  {/* Cột 6: Actions Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Gửi email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Xóa nhân viên</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}