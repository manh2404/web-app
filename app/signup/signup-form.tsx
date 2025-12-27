'use client';

import React, { ComponentPropsWithoutRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trans, useTranslation } from 'react-i18next';
import { signupSchema, SignupSchema } from '@/lib/schemas/signup.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export function SignupForm({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const { t } = useTranslation();

  // State quản lý UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  // API check email / phone
  const checkExists = async (field: "email" | "phone", value: string) => {
    if (!value) return;
    try {
      const res = await fetch(`/api/check?field=${field}&value=${value}`);
      const data = await res.json();
      if (data.exists) {
        setError(field, {
          type: "manual",
          message: field === "email" ? "Email đã tồn tại" : "Số điện thoại đã tồn tại"
        });
      }
    } catch (e) {
      console.error("Check failed", e);
    }
  };

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);
    try {
      await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data)
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Style constants (Đồng bộ với Login)
  const inputClass = "pl-10 bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-11 text-white placeholder:text-white/60 rounded-xl transition-all shadow-sm";
  const labelClass = "text-white font-semibold pl-1 drop-shadow-sm";
  const iconClass = "absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-indigo-300 transition-colors";

  return (
    // 1. WRAPPER CỐ ĐỊNH: Chặn thanh cuộn tuyệt đối
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden">

      {/* 2. HIỆU ỨNG NỀN: Nằm ngoài luồng content */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />

      {/* 3. FORM CONTAINER: Nổi lên trên (z-10) */}
      <div className={cn("flex flex-col gap-6 w-full max-w-md p-4 relative z-10", className)} {...props}>

        <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <CardHeader className="text-center space-y-2 pb-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              {t("i_signup")}
            </CardTitle>

            <CardDescription className="text-base text-zinc-100 font-medium drop-shadow-sm">
              <Trans
                i18nKey="i_signup_desc"
                components={{
                  1: <Link href="/login" className="text-indigo-300 hover:text-indigo-200 font-bold hover:underline underline-offset-4 transition-colors drop-shadow-sm" />
                }}
              />
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Hàng 1: Họ và Tên */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className={labelClass}>Họ</Label>
                  <div className="relative group">
                    <User className={iconClass} />
                    <Input {...register("firstname")} className={inputClass} placeholder="Nguyễn" />
                  </div>
                  {errors.firstname && <p className="text-red-300 text-xs pl-1 font-medium">{errors.firstname.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label className={labelClass}>Tên</Label>
                  <div className="relative group">
                    <User className={iconClass} />
                    <Input {...register("lastname")} className={inputClass} placeholder="Văn A" />
                  </div>
                  {errors.lastname && <p className="text-red-300 text-xs pl-1 font-medium">{errors.lastname.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label className={labelClass}>Email <span className="text-zinc-300 text-[10px] font-normal opacity-80">(Tùy chọn)</span></Label>
                <div className="relative group">
                  <Mail className={iconClass} />
                  <Input
                    {...register("email")}
                    className={inputClass}
                    placeholder="name@example.com"
                    onBlur={(e) => {
                      register("email").onBlur(e);
                      checkExists("email", e.target.value);
                    }}
                  />
                </div>
                {errors.email && <p className="text-red-300 text-xs pl-1 font-medium">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label className={labelClass}>Số điện thoại</Label>
                <div className="relative group">
                  <Phone className={iconClass} />
                  <Input
                    {...register("phone")}
                    className={inputClass}
                    placeholder="0912..."
                    onBlur={(e) => {
                      register("phone").onBlur(e);
                      checkExists("phone", e.target.value);
                    }}
                  />
                </div>
                {errors.phone && <p className="text-red-300 text-xs pl-1 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label className={labelClass}>Mật khẩu</Label>
                <div className="relative group">
                  <Lock className={iconClass} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`${inputClass} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-300 text-xs pl-1 font-medium">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang đăng ký...</>
                ) : (
                  t("i_signup")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}