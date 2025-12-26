'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  User,
  Mail,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
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
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// --- DỮ LIỆU GIẢ LẬP ---
const users = [
  { id: "U-001", name: "Lý Hoàng Khiêm", email: "hoangkhiem@batek.vn", role: "Admin", department: "IT Dept", status: "Active", lastActive: "Vừa xong", avatar: "avt.jpg" },
  { id: "U-002", name: "Nguyễn Thị Tâm", email: "tam@batek.vn", role: "Staff", department: "Marketing", status: "Active", lastActive: "2 giờ trước", avatar: "tam.jpg" },
  { id: "U-003", name: "Nguyễn Hồng Nhung", email: "hongnhung@batek.vn", role: "Staff", department: "Sales", status: "Offline", lastActive: "2 ngày trước", avatar: "nhung.jpg" },
  { id: "U-004", name: "Bùi Văn Mạnh", email: "buimanh@batek.vn", role: "Staff", department: "HR", status: "Active", lastActive: "5 phút trước", avatar: "manh.jpg" },
  { id: "U-005", name: "Trần Tuấn Khôi", email: "trankhoi@batek.vn", role: "Intern", department: "IT Dept", status: "Inactive", lastActive: "1 tuần trước", avatar: "khoi.jpg" },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Class chung cho các thẻ kính mờ (Glass Effect)
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm hover:shadow-md transition-all";

  const handleRefresh = async () => {
    setIsRefreshing(true); // Bắt đầu xoay
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false); // Dừng xoay
    }, 800);
  };
  return (
    // Bỏ bg-muted, để trong suốt để thấy Gradient nền
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">Nhân Sự</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Quản lý tài khoản và quyền truy cập hệ thống.
          </p>
        </div>

        {/* Nhóm các nút hành động */}
        <div className="flex gap-2">

          {/* --- NÚT LÀM MỚI (Đã thêm vào đây) --- */}
          <Button
            variant="outline"
            className="gap-2 bg-white/40 dark:bg-black/40 border-white/20 backdrop-blur-md hover:bg-white/60"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Làm mới
          </Button>

          {/* Nút Xuất Excel trong suốt */}
          <Button variant="outline" className="gap-2 bg-white/40 dark:bg-black/40 border-white/20 backdrop-blur-md hover:bg-white/60">
            <Download className="h-4 w-4" /> Xuất Excel
          </Button>

          {/* Nút Thêm mới nổi bật */}
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" asChild>
            <Link href="/control/user/create">
              <Plus className="h-4 w-4" />
              Thêm nhân viên
            </Link>
          </Button>
        </div>
      </div>

      {/*/!* --- STATS CARDS (Kính mờ) --- *!/*/}
      {/*<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">*/}
      {/* {[*/}
      {/* { title: "Tổng nhân viên", value: users.length, sub: "+2 nhân sự mới", icon: User, color: "text-blue-600" },*/}
      {/* { title: "Đang hoạt động", value: "3", sub: "Hiện đang online", icon: CheckCircle2, color: "text-green-600" },*/}
      {/* { title: "Quản trị viên", value: "1", sub: "Quyền cao nhất", icon: ShieldCheck, color: "text-purple-600" },*/}
      {/* { title: "Tạm khóa", value: "1", sub: "Cần xem xét", icon: UserCog, color: "text-orange-600" },*/}
      {/* ].map((item, index) => (*/}
      {/* <Card key={index} className={glassCardClass}>*/}
      {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
      {/* <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>*/}
      {/* <item.icon className={cn("h-4 w-4", item.color)} />*/}
      {/* </CardHeader>*/}
      {/* <CardContent>*/}
      {/* <div className="text-2xl font-bold">{item.value}</div>*/}
      {/* <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>*/}
      {/* </CardContent>*/}
      {/* </Card>*/}
      {/* ))}*/}
      {/*</div>*/}

      {/* --- MAIN TABLE (Kính mờ lớn) --- */}
      <Card className={cn("flex-1", glassCardClass)}>
        <CardHeader className="pb-3 border-b border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Danh sách thành viên</CardTitle>

            {/* Search Bar trong suốt */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm nhân viên..."
                className="pl-9 bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="w-[300px] text-muted-foreground">Thông tin nhân viên</TableHead>
                <TableHead className="text-muted-foreground">Chức vụ</TableHead>
                <TableHead className="text-muted-foreground">Phòng ban</TableHead>
                <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                <TableHead className="text-muted-foreground">Hoạt động cuối</TableHead>
                <TableHead className="text-right text-muted-foreground">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 border-white/10 transition-colors">

                  {/* Cột 1: Avatar + Tên */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-white/50 dark:border-white/10 shadow-sm">
                        <AvatarImage src={`/${user.avatar}`}
                                     className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-bold">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 2: Role */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md border-0 px-2 py-1 font-medium",
                        user.role === 'Admin'
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* Cột 3: Dept */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-medium opacity-80">
                      {user.department}
                    </div>
                  </TableCell>

                  {/* Cột 4: Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        {user.status === 'Active' && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span className={cn(
                          "relative inline-flex rounded-full h-2.5 w-2.5",
                          user.status === 'Active' ? 'bg-green-500' :
                            user.status === 'Offline' ? 'bg-yellow-500' : 'bg-slate-400'
                        )}></span>
                      </span>
                      <span className="text-sm font-medium">{user.status}</span>
                    </div>
                  </TableCell>

                  {/* Cột 5: Last Active */}
                  <TableCell className="text-muted-foreground text-sm">
                    {user.lastActive}
                  </TableCell>

                  {/* Cột 6: Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Xem hồ sơ</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Sửa thông tin</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Gửi email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 bg-red-50 dark:bg-red-900/10 mt-1">
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}