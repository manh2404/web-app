'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Đảm bảo cậu có file utils này

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State để chuyển đổi giao diện sau khi gửi

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập gọi API gửi mail (Cậu thay bằng API thật sau này)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true); // Chuyển sang màn hình thông báo thành công
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] p-4">

      {/* --- HIỆU ỨNG NỀN ĐỒNG BỘ VỚI LOGIN --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-700" />

      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative z-10">

        {/* TRƯỜNG HỢP 1: CHƯA GỬI FORM (HIỂN THỊ Ô NHẬP EMAIL) */}
        {!isSubmitted ? (
          <>
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 shadow-inner">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                Quên mật khẩu?
              </CardTitle>
              <CardDescription className="text-base text-zinc-100 font-medium">
                Đừng lo, hãy nhập email đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold pl-1">Email đăng ký</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-indigo-300 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-12 text-white placeholder:text-white/60 rounded-xl transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang gửi...</>
                  ) : (
                    "Gửi hướng dẫn"
                  )}
                </Button>

                <div className="text-center">
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
          /* TRƯỜNG HỢP 2: ĐÃ GỬI THÀNH CÔNG (HIỂN THỊ THÔNG BÁO) */
          <>
            <CardHeader className="text-center space-y-4 pb-8 pt-8">
              <div className="mx-auto w-16 h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(74,222,128,0.3)] animate-in zoom-in duration-300">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                Đã gửi email!
              </CardTitle>
              <CardDescription className="text-base text-zinc-100 font-medium">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="text-white font-bold">{email}</span>.
                <br/>Vui lòng kiểm tra hộp thư (cả mục spam nhé).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
                onClick={() => window.open('https://mail.google.com', '_blank')}
              >
                Mở Gmail ngay
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-zinc-300">
                  Chưa nhận được?{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-indigo-300 hover:text-white font-bold hover:underline underline-offset-4 transition-colors"
                  >
                    Gửi lại
                  </button>
                </p>
              </div>
              <div className="text-center pt-4 border-t border-white/10">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Về trang đăng nhập
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}