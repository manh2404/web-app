'use client';

import React from 'react';
import { ProfileHeader } from './profile-header';
import { ProfileForm } from './profile-form';
import { SecurityForm } from './security-form';

export function AccountView() {
  return (
    // [LAYOUT CHÍNH]
    // 1. h-[calc(100vh-4rem)]: Chiều cao cố định (trừ header web).
    // 2. bg-zinc-50 (Sáng) / dark:bg-[#0a0a0a] (Tối).
    <div className="flex flex-col h-[calc(100vh-5.1rem)] w-full bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">

      {/* VÙNG CUỘN NỘI DUNG */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth min-h-0">
        <div className="max-w-6xl mx-auto space-y-8 pb-10">

          {/* Header (Banner & Avatar) */}
          <ProfileHeader />

          {/* Grid Layout: Chia 2 cột (2/3 và 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cột trái: Thông tin cá nhân */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileForm />
            </div>

            {/* Cột phải: Bảo mật */}
            <div className="space-y-8">
              <SecurityForm />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}