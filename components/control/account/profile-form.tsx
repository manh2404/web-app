'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Save, Loader2, Briefcase, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function ProfileForm() {
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật thông tin cá nhân!");
    }, 1000);
  };

  const inputClass = "bg-white/5 border-white/10 text-white focus:border-indigo-500/50 h-11 placeholder:text-zinc-600";
  const labelClass = "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-400" /> Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col gap-6">

        {/* Form Fields */}
        <div>
          <Label className={labelClass}>Họ và tên</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input defaultValue="Nguyễn Văn User" className={`${inputClass} pl-10`} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className={labelClass}>Địa chỉ Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              {/* [SỬA] Đã bỏ disabled, cho phép sửa */}
              <Input defaultValue="user@batek.vn" className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div>
            <Label className={labelClass}>Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input defaultValue="0987654321" className={`${inputClass} pl-10`} />
            </div>
          </div>
        </div>

        <div>
          <Label className={labelClass}>Địa chỉ liên hệ</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input defaultValue="TP Thái Nguyên, Thái Nguyên" className={`${inputClass} pl-10`} />
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-end pb-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 min-w-[120px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Lưu thay đổi</>}
          </Button>
        </div>

        {/* [MỚI] Phần Trạng thái hệ thống chuyển xuống đây (Footer) */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded text-purple-400"><Briefcase className="h-3.5 w-3.5" /></div>
              <span>Phòng ban: <b className="text-zinc-300 ml-1">IT Department</b></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded text-blue-400"><Calendar className="h-3.5 w-3.5" /></div>
              <span>Tham gia: <b className="text-zinc-300 ml-1">24/12/2025</b></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/10 rounded text-green-400"><Clock className="h-3.5 w-3.5" /></div>
              <span>Login cuối: <b className="text-zinc-300 ml-1">09:30 AM</b></span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}