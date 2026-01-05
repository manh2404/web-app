import React from 'react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    // Gọi AuthLayout để dùng chung nền Slate/Indigo tĩnh
    <AuthLayout
      title="Tham gia cùng chúng tôi"
      subtitle="Trải nghiệm hệ thống hiện đại và chuyên nghiệp."
      size="large"
    >
      {/* Gọi Form đăng ký */}
      <SignupForm />
    </AuthLayout>
  );
}