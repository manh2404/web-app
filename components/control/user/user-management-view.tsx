'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

// Icons
import {
  Search, Plus, MoreHorizontal, Download, Trash2, Edit,
  User as UserIcon, Mail, RefreshCw
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Data
import { fetchUsers, deleteUser, UserRow } from "./user-data";

/** Safe normalize: nhận string | null | undefined */
const normalizeText = (value?: string | null) =>
    String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

export function UserManagementView() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Load users
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách (có thể bạn không phải admin)");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalizedSearch = useMemo(
      () => normalizeText(debouncedSearch),
      [debouncedSearch]
  );

  const filteredUsers = useMemo(() => {
    if (!normalizedSearch) return users;

    return users.filter((user) => {
      return (
          normalizeText(user.name).includes(normalizedSearch) ||
          normalizeText(user.email).includes(normalizedSearch) ||
          normalizeText(user.role).includes(normalizedSearch) ||
          normalizeText(user.department).includes(normalizedSearch)
      );
    });
  }, [users, normalizedSearch]);

  // Stats
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(
      (u) => normalizeText(u.status) === "active"
  ).length;

  const glassCardClass =
      "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm hover:shadow-md transition-all";

  // Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
      toast.success("Đã làm mới danh sách");
    } catch (e) {
      console.error(e);
      toast.error("Làm mới thất bại");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const ok = confirm("Bạn chắc chắn muốn xóa tài khoản này?");
    if (!ok) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Đã xóa tài khoản");
    } catch (e) {
      console.error(e);
      toast.error("Xóa thất bại (có thể bạn không phải admin)");
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    const dataToExport = filteredUsers.map((user) => ({
      "Mã NV": user.id,
      "Họ và tên": user.name,
      "Email": user.email,
      "Chức vụ": user.role,
      "Phòng ban": user.department ?? "",
      "Trạng thái": user.status,
      "Hoạt động cuối": user.lastActive
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNhanSu");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Danh_sach_nhan_su_${dateStr}.xlsx`);
    toast.success("Đã xuất file Excel thành công!");
  };

  return (
      <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto custom-scrollbar">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">Nhân Sự</h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Quản lý tài khoản và quyền truy cập hệ thống.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
                variant="outline"
                className="gap-2 bg-white/40 dark:bg-black/40 border-white/20 backdrop-blur-md hover:bg-white/60"
                onClick={handleRefresh}
                disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              Làm mới
            </Button>

            <Button
                variant="outline"
                className="gap-2 bg-white/40 dark:bg-black/40 border-white/20 backdrop-blur-md hover:bg-white/60"
                onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" /> Xuất Excel
            </Button>

            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" asChild>
              <Link href="/control/user/create">
                <Plus className="h-4 w-4" />
                Thêm nhân sự
              </Link>
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <Card className={cn("flex-1", glassCardClass)}>
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <CardTitle>Danh sách nhân sự</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-2 py-0.5 h-6 text-xs font-normal bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    Total: {totalUsers}
                  </Badge>
                  <Badge variant="secondary" className="px-2 py-0.5 h-6 text-xs font-normal bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                    Active: {activeUsers}
                  </Badge>
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm nhân sự..."
                    className="pl-9 bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-blue-500/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <div className="relative w-full overflow-auto">
            {loading ? (
                <div className="p-6 text-muted-foreground">Đang tải dữ liệu...</div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="w-[300px] text-muted-foreground">Thông tin nhân sự</TableHead>
                      <TableHead className="text-muted-foreground">Chức vụ</TableHead>
                      <TableHead className="text-muted-foreground">Phòng ban</TableHead>
                      <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                      <TableHead className="text-muted-foreground">Hoạt động cuối</TableHead>
                      <TableHead className="text-right text-muted-foreground">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            Không tìm thấy nhân sự phù hợp
                          </TableCell>
                        </TableRow>
                    ) : (
                        filteredUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                className="group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 border-white/10 transition-colors"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border-2 border-white/50 dark:border-white/10 shadow-sm">
                                    <AvatarImage
                                        src={user.avatar ? `/${user.avatar}` : undefined}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-bold">
                                      {(user.name?.[0] ?? "?").toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "rounded-md border px-2 py-1 font-medium capitalize",
                                        user.role === "Admin" &&
                                        "bg-red-500/10 text-red-600 border-red-200 dark:text-red-400 dark:border-red-900/40",
                                        user.role === "Staff" &&
                                        "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-900/40",
                                        user.role === "Customer" &&
                                        "bg-white text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
                                    )}
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-1 text-sm font-medium opacity-80">
                                  {user.department ?? "—"}
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            {normalizeText(user.status) === "active" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            )}
                            <span
                                className={cn(
                                    "relative inline-flex rounded-full h-2.5 w-2.5",
                                    normalizeText(user.status) === "active"
                                        ? "bg-green-500"
                                        : normalizeText(user.status) === "offline"
                                            ? "bg-yellow-500"
                                            : "bg-slate-400"
                                )}
                            />
                          </span>
                                  <span className="text-sm font-medium">{user.status}</span>
                                </div>
                              </TableCell>

                              <TableCell className="text-muted-foreground text-sm">
                                {user.lastActive}
                              </TableCell>

                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent align="end" className="w-48 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl">
                                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                                    <DropdownMenuItem>
                                      <UserIcon className="mr-2 h-4 w-4" /> Xem hồ sơ
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                          e.preventDefault();
                                          router.push(`/control/user/${user.id}/edit`);
                                        }}
                                    >
                                      <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                      <Mail className="mr-2 h-4 w-4" /> Gửi email
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDelete(user.id);
                                        }}
                                        className="text-red-600 focus:text-red-600 bg-red-50 dark:bg-red-900/10 mt-1"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Xóa tài khoản
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
            )}
          </div>
        </Card>
      </div>
  );
}
