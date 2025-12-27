'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Dùng CheckCircle2 (Xanh lá) thay vì Shield
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target') || 'email/sđt của bạn'; // Lấy thông tin từ URL

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // Logic đếm ngược
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Logic nhập OTP (Giữ nguyên)
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/forgot-password/reset');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] p-4">
      {/* BACKGROUND */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-700" />

      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative z-10">

        {/* HEADER: THÔNG BÁO XANH LÁ */}
        <CardHeader className="text-center space-y-4 pb-6 pt-8 animate-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            Đã gửi yêu cầu!
          </CardTitle>

          <CardDescription className="text-base text-zinc-200 font-medium px-2 leading-relaxed">
            Chúng tôi đã gửi mã xác nhận về <br/>
            <span className="text-white font-bold text-lg">{target}</span>. <br/>
            Vui lòng kiểm tra tin nhắn/email của bạn.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-8">

            {/* VÙNG NHẬP OTP */}
            <div className="space-y-2 text-center">
              <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Nhập mã xác nhận</p>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el) as any}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 text-white rounded-lg transition-all"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl shadow-lg transition-all active:scale-[0.98]"
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang kiểm tra...</>
              ) : (
                "Xác nhận"
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-zinc-300">
                Chưa nhận được mã?{' '}
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={() => setTimer(60)}
                  className={`font-bold transition-colors ${timer > 0 ? 'text-zinc-500 cursor-not-allowed' : 'text-indigo-400 hover:text-white hover:underline'}`}
                >
                  {timer > 0 ? `Gửi lại sau ${timer}s` : 'Gửi lại ngay'}
                </button>
              </p>

              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại bước trước
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}