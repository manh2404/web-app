'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowLeft, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Tự động phát hiện người dùng đang nhập Email hay Số điện thoại
  useEffect(() => {
    const phoneRegex = /^[0-9+]+$/;
    if (phoneRegex.test(inputValue) && inputValue.length > 0) {
      setInputType('phone');
    } else {
      setInputType('email');
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập gọi API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] p-4">

      {/* --- HIỆU ỨNG NỀN --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-700" />

      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative z-10">

        {!isSubmitted ? (
          /* --- FORM NHẬP LIỆU --- */
          <>
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 shadow-inner">
                {/* Icon đổi theo ngữ cảnh */}
                {inputType === 'phone' ? <Phone className="h-6 w-6 text-white" /> : <Mail className="h-6 w-6 text-white" />}
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                Quên mật khẩu?
              </CardTitle>
              <CardDescription className="text-base text-zinc-100 font-medium">
                Nhập <strong>email</strong> hoặc <strong>số điện thoại</strong> đã đăng ký. Chúng tôi sẽ gửi mã xác nhận cho bạn.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-white font-semibold pl-1">
                    Email hoặc Số điện thoại
                  </Label>
                  <div className="relative group">
                    {/* Icon trong Input cũng đổi theo */}
                    <div className="absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-indigo-300 transition-colors">
                      {inputType === 'phone' ? <Phone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                    </div>

                    <Input
                      id="contact"
                      type="text" // Để text để nhập được cả 2
                      placeholder="name@example.com hoặc 0912..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang xử lý...</>
                  ) : (
                    "Gửi yêu cầu"
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
          /* --- MÀN HÌNH THÀNH CÔNG --- */
          <>
            <CardHeader className="text-center space-y-4 pb-8 pt-8">
              <div className="mx-auto w-16 h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(74,222,128,0.3)] animate-in zoom-in duration-300">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                Đã gửi yêu cầu!
              </CardTitle>

              <CardDescription className="text-base text-zinc-100 font-medium">
                {inputType === 'email' ? (
                  // Nội dung cho Email
                  <>Chúng tôi đã gửi hướng dẫn đến email <br/><span className="text-white font-bold">{inputValue}</span>. Vui lòng kiểm tra hộp thư.</>
                ) : (
                  // Nội dung cho Số điện thoại
                  <>Chúng tôi đã gửi mã xác nhận SMS đến số <br/><span className="text-white font-bold">{inputValue}</span>. Vui lòng kiểm tra tin nhắn.</>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {inputType === 'email' ? (
                <Button
                  className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                >
                  <Mail className="mr-2 h-5 w-5" /> Mở Gmail ngay
                </Button>
              ) : (
                <Button
                  className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
                  // Logic mở app tin nhắn (trên mobile) hoặc chỉ là nút placeholder
                >
                  <MessageSquare className="mr-2 h-5 w-5" /> Mở Tin nhắn
                </Button>
              )}

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