import React from 'react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Khôi phục tài khoản"
      subtitle="Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập."
      size="small"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}