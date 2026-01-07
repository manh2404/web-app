import React from 'react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    // 1. Gọi Layout (Cung cấp nền Lava)
    // 2. Truyền title/subtitle nếu muốn hiển thị ở trên Form
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Nhập thông tin để truy cập."
      size="small"
    >
      {/* 3. Gọi Form (Nội dung chính) */}
      <LoginForm />
    </AuthLayout>
  );
}