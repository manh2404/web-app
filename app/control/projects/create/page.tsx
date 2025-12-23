'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  UserPlus,
  Save
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

// Kiểu dữ liệu thành viên
type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export default function CreateProjectPage() {
  // State quản lý danh sách thành viên
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'vana@example.com', avatar: '' }, // Dữ liệu mẫu
  ]);

  // State cho ô nhập thêm thành viên
  const [newMemberName, setNewMemberName] = useState('');

  // Hàm thêm thành viên
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      email: 'user@example.com', // Email giả lập
      avatar: '',
    };

    setMembers([...members, newMember]);
    setNewMemberName(''); // Reset ô nhập
  };

  // Hàm xóa thành viên
  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full bg-background/95 overflow-hidden p-6">

      {/* --- HEADER: Nút Back & Tiêu đề --- */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/control/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tạo Dự Án Mới</h1>
          <p className="text-muted-foreground text-sm">Điền thông tin để khởi tạo dự án.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:max-w-4xl">

        {/* --- CỘT TRÁI: THÔNG TIN CHUNG --- */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Các thông tin cơ bản về dự án.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Tên dự án <span className="text-red-500">*</span></Label>
                <Input id="projectName" placeholder="Ví dụ: Website Bán Hàng..." />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả mục tiêu, phạm vi dự án..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: QUẢN LÝ THÀNH VIÊN --- */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Thành viên dự án</CardTitle>
              <CardDescription>Thêm những người sẽ tham gia dự án này.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">

              {/* Form thêm nhanh thành viên */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nhập tên thành viên..."
                    className="pl-9"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  />
                </div>
                <Button onClick={handleAddMember}>
                  <Plus className="h-4 w-4 mr-2" /> Thêm
                </Button>
              </div>

              <Separator />

              {/* Bảng danh sách thành viên */}
              <div className="border rounded-md flex-1 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thành viên</TableHead>
                      <TableHead className="w-[80px] text-center">Xóa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.length > 0 ? (
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{member.name}</span>
                              <span className="text-xs text-muted-foreground">{member.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
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

      {/* --- FOOTER: NÚT ACTION --- */}
      <div className="mt-8 flex items-center gap-4 lg:max-w-4xl">
        <Button size="lg" className="flex-1 md:flex-none from-red-800 to-indigo-400 hover:bg-green-500">
          <Save className="mr-2 h-4 w-4" /> Tạo dự án
        </Button>
        <Button variant="outline" size="lg" asChild className="flex-1 md:flex-none">
          <Link href="/control/projects">Hủy bỏ</Link>
        </Button>
      </div>

    </div>
  );
}