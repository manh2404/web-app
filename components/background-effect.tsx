'use client';

import React from 'react';

export const BackgroundEffect = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">

      {/* 1. Lớp nhiễu hạt (Noise) mờ để tạo texture xịn xò */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

      {/* --- HÌNH TRÒN 1: Tím Indigo (Góc Trái Trên) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse"
           style={{ animationDuration: '4s' }} />

      {/* --- HÌNH TRÒN 2: Xanh Blue (Góc Phải Dưới) --- */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"
           style={{ animationDuration: '6s', animationDelay: '1s' }} />

      {/* --- HÌNH TRÒN 3: Hồng Tím (Ở giữa lệch phải xíu) --- */}
      {/* Cái này nhỏ hơn chút để tạo điểm nhấn */}
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-purple-500/20 blur-[100px] rounded-full animate-pulse"
           style={{ animationDuration: '5s', animationDelay: '2s' }} />

    </div>
  );
};