import { LoginForm } from '@/app/login/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}