'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Save,
  Eye,
  EyeOff,
  RefreshCcw,
  CheckCircle2,
  ShieldAlert,
  Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

export default function CreateUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Class kính mờ dùng chung
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm";
  const glassInputClass = "bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-blue-500/50";

  return (
    <div className="flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-white/20 bg-white/20 hover:bg-white/40 backdrop-blur-md" asChild>
            <Link href="/control/user">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">Thêm nhân viên mới</h1>
            <p className="text-muted-foreground text-white text-sm font-medium">Tạo tài khoản và thiết lập quyền truy cập hệ thống.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="ghost" className="flex-1 sm:flex-none hover:bg-white/20" asChild>
            <Link href="/control/user">Hủy bỏ</Link>
          </Button>
          <Button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 border-0">
            <Save className="mr-2 h-4 w-4" /> Lưu hồ sơ
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        {/* --- CỘT TRÁI: AVATAR & TRẠNG THÁI --- */}
        <div className="xl:col-span-1 space-y-6">
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pb-6">
              <div className="relative group">
                <Avatar className="h-48 w-48 border-4 border-white/30 dark:border-white/10 shadow-xl cursor-pointer transition-all group-hover:scale-105" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={avatarPreview || ""} className="object-cover" />
                  <AvatarFallback className="text-5xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900 font-thin text-muted-foreground">
                    IMG
                  </AvatarFallback>
                </Avatar>

                <div
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 text-white drop-shadow-md" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex flex-col items-center gap-3 w-full px-2">
                <p className="text-xs text-center text-amber-400 font-medium">
                  Hỗ trợ định dạng .jpg, .png (Tối đa 5MB)
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="bg-white/40 border-white/20 hover:bg-white/60" onClick={() => fileInputRef.current?.click()}>
                    Upload
                  </Button>
                  {avatarPreview ? (
                    <Button variant="destructive" className="bg-red-500/80 hover:bg-red-600/90" onClick={() => setAvatarPreview(null)}>
                      Xóa
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled>Xóa</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-orange-500"/> Bảo mật & Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/20 dark:bg-black/20">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Kích hoạt</Label>
                  <p className="text-xs text-muted-foreground">Cho phép đăng nhập ngay.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/20 dark:bg-black/20">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Xác thực 2 bước</Label>
                  <p className="text-xs text-muted-foreground">Tăng cường bảo mật (2FA).</p>
                </div>
                <Switch className="data-[state=checked]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: FORM THÔNG TIN --- */}
        <div className="xl:col-span-2 space-y-6">
          <Card className={glassCardClass}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-500"/> Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">

              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên <span className="text-red-500">*</span></Label>
                <Input id="fullname" placeholder="Nhập tên đầy đủ" className={glassInputClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="user@example.com" className={glassInputClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="VD: 098..." className={glassInputClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input id="dob" type="date" className={glassInputClass} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" placeholder="Nhập địa chỉ thường trú..." className={glassInputClass} />
              </div>

            </CardContent>
          </Card>

          <Card className={glassCardClass}>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle>Công việc & Mật khẩu</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">

              <div className="space-y-2">
                <Label>Phòng ban</Label>
                <Select>
                  <SelectTrigger className={glassInputClass}>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
                    <SelectItem value="it">IT Department</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chức vụ (Role)</Label>
                <Select defaultValue="staff">
                  <SelectTrigger className={glassInputClass}>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
                    <SelectItem value="admin" className="text-red-500 font-medium">Quản trị viên (Admin)</SelectItem>
                    <SelectItem value="manager" className="text-blue-500 font-medium">Quản lý (Manager)</SelectItem>
                    <SelectItem value="staff">Nhân viên (Staff)</SelectItem>
                    <SelectItem value="intern">Thực tập sinh (Intern)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="md:col-span-2 my-2 bg-white/10" />

              <div className="space-y-2 md:col-span-2">
                <Label>Mật khẩu khởi tạo</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${glassInputClass} pr-10`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button variant="outline" onClick={generatePassword} className="bg-white/40 border-white/20 hover:bg-white/60">
                    <RefreshCcw className="h-4 w-4 mr-2" /> Random
                  </Button>
                </div>
                {password && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center font-medium animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Mật khẩu mạnh & hợp lệ
                  </p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}