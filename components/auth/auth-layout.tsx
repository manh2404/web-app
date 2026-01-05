
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  // Prop này tên là 'size' (chuỗi string)
  size?: 'small' | 'large';
}

// Destructuring: đổi tên 'size' thành 'layoutSize' ngay tại đây để an toàn tuyệt đối
export function AuthLayout({ children, title, subtitle, size: layoutSize = 'small' }: AuthLayoutProps) {

  // Logic chọn chiều rộng dựa trên layoutSize
  // 'large' -> max-w-5xl (cho Signup)
  // 'small' -> max-w-md (cho Login)
  const widthClass = layoutSize === 'large' ? 'max-w-5xl' : 'max-w-md';

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-600">

      {/* NỀN (Giữ nguyên) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] bg-purple-200/50 dark:bg-indigo-500/20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] bg-cyan-200/50 dark:bg-cyan-500/20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* CONTAINER CHÍNH */}
      {/* Áp dụng class độ rộng đã tính toán ở trên */}
      <div className={cn("w-full relative z-10 flex flex-col items-center justify-center transition-all duration-500", widthClass)}>

        {(title || subtitle) && (
          <div className="text-center mb-6 space-y-2 animate-in slide-in-from-top-5 duration-500">
            {title && (
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="w-full animate-in zoom-in-95 duration-500">
          {children}
        </div>

        <div className="absolute bottom-[-40px] text-xs text-slate-400 font-medium opacity-50">
          © 2025 Product by @HokaDev
        </div>
      </div>
    </div>
  );
}