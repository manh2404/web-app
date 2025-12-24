'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentPropsWithoutRef, FormEvent, useState } from 'react';
import { POST_METHOD } from '@/lib/req';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Lock } from 'lucide-react';


export function LoginForm({
							  className,
							  ...props
						  }: ComponentPropsWithoutRef<'div'>) {
	const redirect = typeof window !== 'undefined'
		? new URLSearchParams(window.location.search).get('redirect')
		: null;
	const { t } = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');

		console.log('CLICK LOGIN');

		try {
			const res = await POST_METHOD('/api/login', {
				username,
				password,
			});

			console.log('LOGIN RESPONSE:', res);

			window.location.href = redirect || '/control';

		} catch (err) {
			console.error(err);
			setError('Sai tài khoản hoặc mật khẩu');
		}
	};



	return (
		<div className={cn("flex min-h-screen items-center justify-center bg-[#e0f7ff] dark:bg-[#0f3a46] p-6", className)} {...props}>
			<Card className="w-full max-w-md rounded-2xl shadow-xl">
				<CardHeader className="px-8 pt-8">
					<CardTitle className="text-2xl text-center font-semibold text-[#1fb6e0]">{t('i_login')}</CardTitle>
					<CardDescription className="text-center">
						<Trans
							i18nKey="i_login_desc"
							components={{
								0: <strong className="font-bold" />,
								1: (
									<Link
										href="/signup"
										className="text-[#1fb6e0] font-medium underline underline-offset-4 hover:text-[#159ec5] transition-colors"
									/>
								),
							}}
						/>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label>{t('i_phone_or_email')}</Label>

								<div className="relative">
									<User
										className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
									/>

									<Input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder={t('i_phone_or_email')}
										className="pl-10 focus-visible:border-[#1fb6e0] focus-visible:ring-[#1fb6e0]"
										required
									/>
								</div>
							</div>
							<div className="grid gap-2">
								<Label>{t('i_password')}</Label>

								<div className="relative">
									<Lock
										className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
									/>

									<Input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder={t('i_password')}
										className="pl-10 h-11 rounded-lg focus-visible:border-[#1fb6e0] focus-visible:ring-[#1fb6e0]"
										required
									/>
								</div>
							</div>

							{error && (
								<p className="text-sm text-red-500">{error}</p>
							)}

							<Button type="submit"
									className="w-full bg-[#1fb6e0] hover:bg-[#159ec5] text-white">
								{t('i_login')}
							</Button>
						</div>
						<div className="mt-3 text-center">
							<Link
								href="/forgot-password"
								className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
							>
								{t('Forgot Password ?')}
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}