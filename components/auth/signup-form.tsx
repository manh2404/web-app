'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { POST_METHOD } from '@/lib/req';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emptyFields = Object.values(formData).some(x => x.trim() === '');
    if (emptyFields) { toast.error("Vui lòng điền đầy đủ thông tin!"); return; }
    if (formData.password !== formData.confirmPassword) { toast.error("Mật khẩu không khớp!"); return; }

    setLoading(true);
    try {
      await POST_METHOD('/api/signup', formData);
      toast.success("Đăng ký thành công!");
      setTimeout(() => router.push('/login'), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLE COMPACT & ORANGE THEME ---
  const inputClass = cn(
    "pl-9 h-10 rounded-md border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950",
    "text-slate-900 dark:text-white placeholder:text-slate-400 text-sm",
    // [ĐỔI MÀU] Focus sang màu Cam
    "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
  );

  // [ĐỔI MÀU] Icon khi focus sang màu Cam
  const iconClass = "absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors";
  const labelClass = "text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wider";

  return (
    <Card className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden rounded-xl">

      {/* Header ngang */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {/* [ĐỔI MÀU] Thanh nhỏ trang trí màu Cam */}
            <span className="w-1.5 h-5 bg-orange-500 rounded-full inline-block" />
            Đăng ký tài khoản
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-3.5">
            Nhập thông tin chi tiết bên dưới để bắt đầu.
          </p>
        </div>
        <div className="text-sm mt-3 md:mt-0">
          <span className="text-slate-500 dark:text-slate-400">Đã có tài khoản? </span>
          {/* [ĐỔI MÀU] Link màu Cam */}
          <Link href="/login" className="text-orange-600 dark:text-orange-500 font-bold hover:underline transition-colors">
            Đăng nhập
          </Link>
        </div>
      </div>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* HÀNG 1: HỌ - TÊN - SĐT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4">
              <Label htmlFor="lastname" className={labelClass}>Họ</Label>
              <div className="relative group">
                <User className={iconClass} />
                <Input id="lastname" placeholder="Nguyễn" className={inputClass} value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} required />
              </div>
            </div>
            <div className="md:col-span-4">
              <Label htmlFor="firstname" className={labelClass}>Tên</Label>
              <div className="relative group">
                <User className={iconClass} />
                <Input id="firstname" placeholder="Văn An" className={inputClass} value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} required />
              </div>
            </div>
            <div className="md:col-span-4">
              <Label htmlFor="phone" className={labelClass}>Số điện thoại</Label>
              <div className="relative group">
                <Phone className={iconClass} />
                <Input id="phone" type="tel" placeholder="Nhập số điện thoại" className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>
          </div>

          {/* HÀNG 2: EMAIL - MẬT KHẨU - CONFIRM */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-6">
              <Label htmlFor="email" className={labelClass}>Địa chỉ Email</Label>
              <div className="relative group">
                <Mail className={iconClass} />
                <Input id="email" type="email" placeholder="name@company.com" className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="password" className={labelClass}>Mật khẩu</Label>
              <div className="relative group">
                <Lock className={iconClass} />
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••" className={cn(inputClass, "pr-9")} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={6} />
              </div>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="confirmPassword" className={labelClass}>Xác nhận mật khẩu</Label>
              <div className="relative group">
                <CheckCircle2 className={iconClass} />
                <Input id="confirmPassword" type={showPass ? "text" : "password"} placeholder="••••••" className={cn(inputClass, "pr-9")} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-orange-500 transition-colors focus:outline-none">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 order-2 md:order-1 text-center md:text-left">
              Bằng việc đăng ký, bạn đồng ý với <Link href="#" className="underline hover:text-orange-500 font-bold">Điều khoản</Link> & <Link href="#" className="underline hover:text-orange-500 font-bold">Chính sách</Link>.
            </p>

            {/* [ĐỔI MÀU] Nút bấm Gradient Cam -> Đỏ */}
            <Button
              type="submit"
              className="order-1 md:order-2 w-full md:w-auto px-8 h-11 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="flex items-center gap-2">Hoàn tất đăng ký <ArrowRight className="h-4 w-4" /></span>}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
