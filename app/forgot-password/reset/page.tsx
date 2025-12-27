'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import thêm Link
// Thêm ArrowLeft vào import icon
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false); // Dùng chung 1 state cho cả 2 ô

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    // Giả lập API đổi pass
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Sau 2s tự về login
      setTimeout(() => router.push('/login'), 2000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] p-4">
      {/* BACKGROUND GIỮ NGUYÊN */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-700" />

      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative z-10">

        {!isSuccess ? (
          <>
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 shadow-inner">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                Đặt lại mật khẩu
              </CardTitle>
              <CardDescription className="text-base text-zinc-100">
                Tạo mật khẩu mới cho tài khoản của bạn. <br/>Vui lòng không chia sẻ với người khác.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Mật khẩu mới */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold pl-1">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-12 text-white placeholder:text-white/60 rounded-xl pr-10"
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu (ĐÃ SỬA: Thêm nút mắt) */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold pl-1">Nhập lại mật khẩu</Label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"} // Dùng chung state showPass
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      // Thêm pr-10 để chừa chỗ cho icon
                      className="bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-12 text-white placeholder:text-white/60 rounded-xl pr-10"
                      required
                    />
                    {/* Nút mắt copy từ trên xuống */}
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang cập nhật...</>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </Button>

                {/* Nút quay lại (ĐÃ THÊM) */}
                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-indigo-200 hover:text-white font-medium transition-colors hover:underline underline-offset-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại đăng nhập
                  </Link>
                </div>

              </form>
            </CardContent>
          </>
        ) : (
          /* --- MÀN HÌNH THÀNH CÔNG (GIỮ NGUYÊN) --- */
          <div className="py-10 text-center animate-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(74,222,128,0.4)]">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Thành công!</h2>
            <p className="text-zinc-200 mb-6">
              Mật khẩu của bạn đã được thay đổi. <br/>
              Đang chuyển về trang đăng nhập...
            </p>
            <Loader2 className="h-6 w-6 text-white/50 animate-spin mx-auto" />
          </div>
        )}
      </Card>
    </div>
  );
}