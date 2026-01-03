import React from 'react';
import { ProfileHeader } from './profile-header';
import { ProfileForm } from './profile-form';
import { SecurityForm } from './security-form';
// [XÓA] import { SystemInfo } from './system-info'; -> Không dùng nữa

export function AccountView() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <ProfileHeader />

        {/* Nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cột trái: Form thông tin cá nhân (Giờ đã bao gồm System Info ở đáy) */}
          <div className="lg:col-span-2">
            <ProfileForm />
          </div>

          {/* Cột phải: Chỉ còn mỗi Form Bảo mật */}
          <div className="space-y-6">
            <SecurityForm />
          </div>

        </div>
      </div>
    </div>
  );
}