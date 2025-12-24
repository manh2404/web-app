'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  UserPlus,
  Save,
  Briefcase,
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Kiểu dữ liệu thành viên
type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export default function CreateProjectPage() {
  const [date, setDate] = useState<Date>();

  // State quản lý danh sách thành viên
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'vana@batek.vn', avatar: 'https://github.com/shadcn.png' },
  ]);

  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      email: `${newMemberName.toLowerCase().replace(/\s/g, '')}@batek.vn`,
      avatar: '',
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  // Class kính mờ dùng chung
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm";
  const glassInputClass = "bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-indigo-500/50";

  return (
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-white/20 bg-white/20 hover:bg-white/40 backdrop-blur-md" asChild>
            <Link href="/control/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">Tạo Dự Án Mới</h1>
            <p className="text-muted-foreground text-sm font-medium">Điền thông tin để khởi tạo dự án.</p>
          </div>
        </div>

        {/* Actions Desktop */}
        <div className="hidden sm:flex gap-3">
          <Button variant="ghost" className="hover:bg-white/20" asChild>
            <Link href="/control/projects">Hủy bỏ</Link>
          </Button>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-0">
            <Save className="mr-2 h-4 w-4" /> Lưu Dự Án
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* --- CỘT TRÁI: THÔNG TIN CHUNG (Chiếm 2 phần) --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={glassCardClass}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-500"/> Thông tin chung
              </CardTitle>
              <CardDescription>Các thông tin cơ bản về dự án.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Tên dự án <span className="text-red-500">*</span></Label>
                <Input id="projectName" placeholder="Ví dụ: Website Bán Hàng..." className={glassInputClass} />
              </div>

              {/* Deadline & Budget (Ví dụ thêm trường) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thời hạn (Deadline)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          glassInputClass,
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Chọn ngày kết thúc</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Ngân sách (VNĐ)</Label>
                  <Input id="budget" type="number" placeholder="0" className={glassInputClass} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả mục tiêu, phạm vi dự án..."
                  className={cn("min-h-[150px] resize-none", glassInputClass)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: QUẢN LÝ THÀNH VIÊN (Chiếm 1 phần) --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className={cn("h-full flex flex-col", glassCardClass)}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500"/> Thành viên
              </CardTitle>
              <CardDescription>Mời người tham gia vào dự án.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 pt-6">

              {/* Form thêm nhanh thành viên */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nhập tên..."
                    className={cn("pl-9", glassInputClass)}
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  />
                </div>
                <Button onClick={handleAddMember} size="icon" className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="bg-white/10" />

              {/* Bảng danh sách thành viên */}
              <div className="rounded-lg border border-white/10 overflow-hidden bg-white/20 dark:bg-black/10 backdrop-blur-sm flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="text-muted-foreground">Thành viên</TableHead>
                      <TableHead className="w-[50px] text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.length > 0 ? (
                      members.map((member) => (
                        <TableRow key={member.id} className="group border-white/10 hover:bg-white/10">
                          <TableCell className="flex items-center gap-3 py-3">
                            <Avatar className="h-9 w-9 border-2 border-white/50">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm line-clamp-1">{member.name}</span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1">{member.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                          Chưa có thành viên nào.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- MOBILE ACTION FOOTER (Chỉ hiện trên mobile) --- */}
      <div className="flex sm:hidden items-center gap-4 mt-8 pb-4">
        <Button className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 h-12 shadow-lg">
          <Save className="mr-2 h-4 w-4" /> Lưu Dự Án
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 bg-white/40" asChild>
          <Link href="/control/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}