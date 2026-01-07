'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Save, Loader2, Briefcase, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ProfileForm() {
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật thông tin cá nhân!");
    }, 1000);
  };

  // --- STYLE CLASSES ---
  // Input: Light (Nền xám nhạt) / Dark (Nền đen than)
  const inputClass = cn(
    "h-11 pl-10 transition-all",
    "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-0",
    "dark:bg-[#1a1a1d] dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-600"
  );

  // Icon trong Input
  const iconClass = "absolute left-3 top-3 h-5 w-5 text-zinc-400 dark:text-zinc-500";

  // Label
  const labelClass = "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block";

  return (
    <Card className="h-full flex flex-col border shadow-sm bg-white border-zinc-200 dark:bg-[#121214] dark:border-zinc-800 transition-colors">

      {/* HEADER */}
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-6 flex-1 flex flex-col gap-6">

        {/* Form Fields */}
        <div>
          <Label className={labelClass}>Họ và tên</Label>
          <div className="relative">
            <User className={iconClass} />
            <Input defaultValue="Nguyễn Văn User" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className={labelClass}>Địa chỉ Email</Label>
            <div className="relative">
              <Mail className={iconClass} />
              <Input defaultValue="user@batek.vn" className={inputClass} />
            </div>
          </div>
          <div>
            <Label className={labelClass}>Số điện thoại</Label>
            <div className="relative">
              <Phone className={iconClass} />
              <Input defaultValue="0987654321" className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <Label className={labelClass}>Địa chỉ liên hệ</Label>
          <div className="relative">
            <MapPin className={iconClass} />
            <Input defaultValue="TP Thái Nguyên, Thái Nguyên" className={inputClass} />
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-end pb-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 min-w-[120px] dark:hover:bg-indigo-500"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Lưu thay đổi</>}
          </Button>
        </div>

        {/* FOOTER: System Info */}
        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-500 dark:text-zinc-400">

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span>Phòng ban: <b className="text-zinc-700 dark:text-zinc-200 ml-1">IT Department</b></span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <span>Tham gia: <b className="text-zinc-700 dark:text-zinc-200 ml-1">24/12/2025</b></span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span>Login cuối: <b className="text-zinc-700 dark:text-zinc-200 ml-1">09:30 AM</b></span>
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  );
}