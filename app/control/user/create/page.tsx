'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Eye,
  EyeOff,
  RefreshCcw,
  CheckCircle2
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch"; // Cần cài thêm nếu chưa có

export default function CreateUserPage() {
  // State quản lý form
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hàm tạo mật khẩu ngẫu nhiên
  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  // Hàm xử lý upload ảnh (Demo preview)
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

  return (
    <div className="flex flex-col h-full w-full bg-muted/10 p-6 overflow-y-auto">

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9" asChild>
            <Link href="/control/user">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Thêm nhân viên mới</h1>
            <p className="text-muted-foreground text-sm">Tạo tài khoản và thiết lập quyền truy cập hệ thống.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/control/user">Hủy bỏ</Link>
          </Button>
          <Button className="from-red-800 to-indigo-400 hover:bg-green-500">
            <Save className="mr-2 h-4 w-4" /> Lưu nhân viên
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        {/* --- CỘT TRÁI: AVATAR & TRẠNG THÁI --- */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
              <CardDescription>Hỗ trợ định dạng .jpg, .png (Max 2MB)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pb-8">
              <div className="relative group">
                <Avatar className="h-40 w-40 border-4 border-muted cursor-pointer transition-all group-hover:border-primary/50" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={avatarPreview || ""} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-muted font-thin text-muted-foreground">
                    IMG
                  </AvatarFallback>
                </Avatar>
                {/* Overlay icon upload khi hover */}
                <div
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex flex-col items-center gap-2 w-full px-4">
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Tải ảnh lên
                </Button>
                {avatarPreview && (
                  <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setAvatarPreview(null)}>
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái & Quyền</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                <div className="space-y-0.5">
                  <Label className="text-base">Kích hoạt tài khoản</Label>
                  <p className="text-xs text-muted-foreground">Nhân viên có thể đăng nhập ngay lập tức.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                <div className="space-y-0.5">
                  <Label className="text-base">Xác thực 2 bước (2FA)</Label>
                  <p className="text-xs text-muted-foreground">Yêu cầu bảo mật cao hơn.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: FORM THÔNG TIN --- */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Các thông tin cơ bản bắt buộc.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên <span className="text-red-500">*</span></Label>
                <Input id="fullname" placeholder="VD: Nguyễn Văn A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email đăng nhập <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="VD: user@batek.vn" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="VD: 0987..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input id="dob" type="date" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ thường trú</Label>
                <Input id="address" placeholder="VD: Số 1, Đường ABC, Hà Nội" />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin công việc & Bảo mật</CardTitle>
              <CardDescription>Phân công phòng ban và thiết lập mật khẩu.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">

              <div className="space-y-2">
                <Label>Phòng ban</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                    <SelectItem value="manager">Quản lý (Manager)</SelectItem>
                    <SelectItem value="staff">Nhân viên (Staff)</SelectItem>
                    <SelectItem value="intern">Thực tập sinh (Intern)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="md:col-span-2 my-2" />

              <div className="space-y-2 md:col-span-2">
                <Label>Mật khẩu khởi tạo</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button variant="outline" onClick={generatePassword} title="Tạo mật khẩu ngẫu nhiên">
                    <RefreshCcw className="h-4 w-4 mr-2" /> Random
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {password && (
                    <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Mật khẩu hợp lệ
                        </span>
                  )}
                </p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}