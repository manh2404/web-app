// components/ui/global-loading.tsx
import React from 'react';

export default function GlobalLoading() {
  return (
    // Lớp phủ mờ toàn màn hình
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Container của thanh loading (hình viên thuốc) */}
      <div className="relative h-4 w-48 overflow-hidden rounded-full border border-red-200 bg-red-50/50 shadow-sm">
        {/* Thanh trượt màu đỏ bên trong */}
        <div className="absolute top-0 h-full rounded-full animate-sliding-red opacity-80"></div>
      </div>
    </div>
  );
}