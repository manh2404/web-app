'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AccountPage() {
  // State giả lập dữ liệu user
  const [isLoading, setIsLoading] = useState(false);

  // Class kính mờ dùng chung
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm";
  const glassInputClass = "bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-indigo-500/50";

  return (
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">

      {/* --- HEADER --- */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground font-medium">Quản lý thông tin và bảo mật tài khoản của bạn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* --- CỘT TRÁI: AVATAR --- */}
        <div className="md:col-span-1 space-y-6">
          <Card className={cn("text-center h-full", glassCardClass)}>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <Avatar className="h-32 w-32 border-4 border-white/30 shadow-xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-4xl">US</AvatarFallback>
                </Avatar>
                {/* Overlay Upload */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold">Nguyễn Văn User</h3>
                <p className="text-sm text-muted-foreground">Software Engineer</p>
              </div>

              <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/30 border-0">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified Account
              </Badge>

              <Separator className="bg-white/20 w-full" />

              <div className="w-full text-left space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tham gia:</span>
                  <span className="font-medium">24/12/2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phòng ban:</span>
                  <span className="font-medium">IT Dept</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: FORM EDIT --- */}
        <div className="md:col-span-2 space-y-6">

          {/* Form Thông tin cơ bản */}
          <Card className={glassCardClass}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" /> Thông tin cơ bản
              </CardTitle>
              <CardDescription>Cập nhật thông tin liên hệ của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">

              <div className="grid gap-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input id="fullname" defaultValue="Nguyễn Văn User" className={glassInputClass} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="email" defaultValue="user@batek.vn" className={cn("pl-9", glassInputClass)} disabled />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" defaultValue="0987654321" className={cn("pl-9", glassInputClass)} />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="address" placeholder="Nhập địa chỉ..." className={cn("pl-9", glassInputClass)} />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Form Mật khẩu */}
          <Card className={glassCardClass}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-orange-500" /> Đổi mật khẩu
              </CardTitle>
              <CardDescription>Để bảo mật, vui lòng không chia sẻ mật khẩu cho người khác.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="current-pass">Mật khẩu hiện tại</Label>
                <Input id="current-pass" type="password" className={glassInputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-pass">Mật khẩu mới</Label>
                  <Input id="new-pass" type="password" className={glassInputClass} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-pass">Nhập lại mật khẩu mới</Label>
                  <Input id="confirm-pass" type="password" className={glassInputClass} />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" className="bg-white/40 hover:bg-white/60 border-white/20">
                  Cập nhật mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}