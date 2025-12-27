'use client';

import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  IdCard,
  ShieldCheck,
  KeyRound,
  Settings,
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  Pen,
  Eye,      // Import thêm icon Mắt mở
  EyeOff,   // Import thêm icon Mắt đóng
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type ViewMode = 'VIEW' | 'EDIT_PROFILE' | 'CHANGE_PASSWORD';

export default function AccountPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('VIEW');

  // --- STATE QUẢN LÝ ẢNH ---
  const [avatarUrl, setAvatarUrl] = useState<string>("https://github.com/shadcn.png");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- STATE QUẢN LÝ MẬT KHẨU (MỚI THÊM) ---
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // State quản lý ẩn/hiện cho từng ô input riêng biệt
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // --- REFS ---
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // --- XỬ LÝ CHỌN ẢNH ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarUrl(previewUrl);
        toast.success("Đã thay đổi ảnh đại diện!");
      } else {
        setCoverUrl(previewUrl);
        toast.success("Đã thay đổi ảnh bìa!");
      }
    }
  };

  // --- XỬ LÝ ĐỔI MẬT KHẨU (MỚI THÊM) ---
  const handleChangePassword = () => {
    // 1. Kiểm tra rỗng (Bắt buộc)
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }

    // 2. Kiểm tra mật khẩu mới trùng khớp (Optional logic nhưng nên có)
    if (passwords.new !== passwords.confirm) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    // 3. Giả lập gọi API thành công
    toast.success("Đổi mật khẩu thành công!");

    // Reset form và về trang view
    setPasswords({ current: '', new: '', confirm: '' });
    setViewMode('VIEW');
  };

  // Hàm toggle ẩn hiện
  const toggleShow = (field: keyof typeof showPass) => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- STYLE ---
  const glassCard = "bg-white/10 dark:bg-black/40 backdrop-blur-xl border-white/10 shadow-sm hover:bg-white/15 transition-all duration-300";
  // Thêm padding-right (pr-10) để chữ không bị đè lên icon con mắt
  const inputStyle = "bg-white/5 border-white/10 focus:border-indigo-500/50 h-10 text-sm pr-10";

  // --- 1. VIEW MODE ---
  if (viewMode === 'VIEW') {
    return (
      <div className="relative w-full h-full bg-[#050505] text-white overflow-y-auto">

        {/* INPUT ẨN */}
        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />

        {/* COVER IMAGE */}
        <div className="relative w-full h-44 group/cover">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-zinc-900 relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 transition-colors duration-300" />

          <div className="absolute top-4 right-16 z-20 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="sm" className="h-8 gap-2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 shadow-lg" onClick={() => coverInputRef.current?.click()}>
              <Pen className="h-3.5 w-3.5" /> <span className="text-xs font-medium">Đổi ảnh bìa</span>
            </Button>
          </div>

          <div className="absolute top-4 right-6 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-black/20 border-white/20 hover:bg-white/10 text-white rounded-full h-8 w-8 backdrop-blur-md">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-zinc-900/95 backdrop-blur-xl border-white/10 text-white">
                <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => setViewMode('EDIT_PROFILE')} className="cursor-pointer gap-2 text-sm hover:bg-white/10 focus:bg-white/10">
                  <User className="h-4 w-4 text-indigo-400" /> Cập nhật hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('CHANGE_PASSWORD')} className="cursor-pointer gap-2 text-sm hover:bg-white/10 focus:bg-white/10">
                  <KeyRound className="h-4 w-4 text-orange-400" /> Đổi mật khẩu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 md:px-10 -mt-14 pb-8 relative z-10 w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-end gap-5 mb-6">
            <div className="relative group/avatar inline-block">
              <Avatar className="h-32 w-32 border-[4px] border-[#050505] shadow-2xl rounded-full transition-transform group-hover/avatar:scale-105 cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="text-3xl bg-zinc-800 text-white">US</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-indigo-600 p-1.5 rounded-full text-white shadow-lg border-[3px] border-[#050505] cursor-pointer hover:bg-indigo-700 transition-colors z-20" onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}>
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-black/90 flex items-center justify-center z-[9999] outline-none">
                <DialogTitle className="hidden">Xem ảnh đại diện</DialogTitle>
                <button onClick={() => setIsPreviewOpen(false)} className="absolute top-5 right-5 text-white transition-all z-50 hover:opacity-70"></button>
                <div className="relative w-full h-full p-4 flex items-center justify-center" onClick={() => setIsPreviewOpen(false)}>
                  <img src={avatarUrl} alt="Full Avatar" className="max-w-full max-h-full object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300" />
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex-1 pb-2 text-center md:text-left space-y-0.5">
              <h1 className="text-3xl font-bold text-white drop-shadow-md">Nguyễn Văn User</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400 text-sm">
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Software Engineer</span>
                <span className="hidden md:inline text-zinc-600">•</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Thái Nguyên</span>
              </div>
            </div>
            <div className="pb-3 hidden md:block">
              <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 px-3 py-1 text-xs backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <Card className={cn("lg:col-span-2", glassCard)}>
              <CardHeader className="pb-3 pt-4 px-5 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                  <User className="h-4 w-4 text-indigo-400"/> Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <InfoItem label="Họ và tên" value="Nguyễn Văn User" icon={<IdCard className="h-3.5 w-3.5" />}/>
                  <InfoItem label="Số điện thoại" value="0987654321" icon={<Phone className="h-3.5 w-3.5"/>} />
                  <InfoItem label="Email" value="user@batek.vn" icon={<Mail className="h-3.5 w-3.5"/>} />
                  <div className="md:col-span-2">
                    <InfoItem label="Địa chỉ" value="16 Ngõ 21 Đường Chu Văn An, Hàng Văn Thụ, Thành phố Thái Nguyên, Thái Nguyên" icon={<MapPin className="h-3.5 w-3.5 "/>} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={glassCard}>
              <CardHeader className="pb-3 pt-4 px-5 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                  <Briefcase className="h-4 w-4 text-green-400"/> Hệ thống
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between p-2.5 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-500/20 rounded text-purple-400"><Briefcase className="h-4 w-4" /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Phòng ban</p>
                      <p className="text-sm font-medium text-white">IT Department</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-md bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded text-blue-400"><Calendar className="h-4 w-4" /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">Tham gia</p>
                      <p className="text-sm font-medium text-white">24/12/2025</p>
                    </div>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  <span>Login cuối: 09:30 AM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. EDIT PROFILE MODE ---
  if (viewMode === 'EDIT_PROFILE') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-[#050505] animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 pointer-events-none" />
        <Card className={cn("w-full max-w-xl relative z-10", glassCard)}>
          <CardHeader className="border-b border-white/10 pb-3 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" /> Cập nhật hồ sơ
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('VIEW')} className="text-zinc-400 hover:text-white h-8 w-8 p-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 px-6 pb-6">
            <div className="grid gap-1.5">
              <Label className="text-zinc-300 text-xs uppercase">Họ và tên</Label>
              <Input defaultValue="Nguyễn Văn User" className={inputStyle} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-300 text-xs uppercase">Email</Label>
                <Input defaultValue="user@batek.vn" className={cn(inputStyle, "opacity-70")} disabled />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-zinc-300 text-xs uppercase">Số điện thoại</Label>
                <Input defaultValue="0987654321" className={inputStyle} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-zinc-300 text-xs uppercase">Địa chỉ</Label>
              <Input defaultValue="Số 1, Đại Cồ Việt..." className={inputStyle} />
            </div>
            <div className="flex justify-end pt-2 gap-2">
              <Button variant="ghost" onClick={() => setViewMode('VIEW')} className="text-zinc-400 hover:text-white">Hủy</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
                <Save className="mr-2 h-3.5 w-3.5" /> Lưu lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- 3. CHANGE PASSWORD MODE (ĐÃ CẬP NHẬT) ---
  if (viewMode === 'CHANGE_PASSWORD') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-[#050505] animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-900/10 to-red-900/10 pointer-events-none" />

        <Card className={cn("w-full max-w-lg relative z-10", glassCard)}>
          <CardHeader className="border-b border-white/10 pb-3 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-orange-400" /> Đổi mật khẩu
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 px-6 pb-6">

            {/* Ô Mật khẩu hiện tại */}
            <div className="grid gap-1.5">
              <Label className="text-zinc-300 text-xs uppercase flex items-center gap-1">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPass.current ? 'text' : 'password'}
                  className={inputStyle}
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => toggleShow('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPass.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Ô Mật khẩu mới */}
              <div className="grid gap-1.5">
                <Label className="text-zinc-300 text-xs uppercase flex items-center gap-1">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPass.new ? 'text' : 'password'}
                    className={inputStyle}
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPass.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Ô Xác nhận mật khẩu mới */}
              <div className="grid gap-1.5">
                <Label className="text-zinc-300 text-xs uppercase flex items-center gap-1">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPass.confirm ? 'text' : 'password'}
                    className={inputStyle}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPass.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <Button variant="ghost" onClick={() => { setViewMode('VIEW'); setPasswords({current: '', new: '', confirm: ''}); }} className="text-zinc-400 hover:text-white">Hủy</Button>
              <Button
                onClick={handleChangePassword}
                className="bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-500/20"
              >
                Cập nhật
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

// --- Component Info Item ---
const InfoItem = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-3 py-1">
      {icon && (
        <div className="mt-0.5 shrink-0 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className="text-sm font-medium text-foreground whitespace-normal break-words leading-snug">
          {value}
        </span>
      </div>
    </div>
  );
};