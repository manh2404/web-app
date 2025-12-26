'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentPropsWithoutRef, FormEvent, useState } from 'react';
import { POST_METHOD } from '@/lib/req';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect');
	const router = useRouter();
	const { t } = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await POST_METHOD(`/api/login`, { username, password });
			if (redirect) {
				router.push(redirect);
			} else {
				router.push('/control');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-6 w-full max-w-md mx-auto p-4', className)} {...props}>
			{/* Hiệu ứng nền sáng rực rỡ hơn */}
			<div className="absolute -z-10 top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full" />
			<div className="absolute -z-10 bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 blur-[120px] rounded-full" />

			{/* Card với nền kính sáng màu */}
			<Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
				<CardHeader className="text-center space-y-2 pb-2">
					<CardTitle className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
						{t('i_login')}
					</CardTitle>
					<CardDescription className="text-base text-zinc-100 font-medium drop-shadow-sm">
						<Trans
							i18nKey="i_login_desc"
							components={{
								1: <Link href="/signup" className="text-indigo-300 hover:text-indigo-200 font-bold hover:underline underline-offset-4 transition-colors drop-shadow-sm" />
							}}
						/>
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-4">
					<form onSubmit={handleSubmit} className="space-y-6">

						{/* Username Field */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-white font-semibold pl-1 drop-shadow-sm">{t('i_phone_or_email')}</Label>
							<div className="relative group">
								<User className="absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-indigo-300 transition-colors" />
								<Input
									id="email"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Nhập tên đăng nhập..."
									className="pl-10 bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-12 text-white placeholder:text-white/60 rounded-xl transition-all shadow-sm"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<div className="flex items-center justify-between pl-1">
								<Label htmlFor="password" className="text-white font-semibold drop-shadow-sm">{t('i_password')}</Label>
								<Link
									href="/forgot-password"
									className="text-sm text-indigo-300 hover:text-indigo-200 font-medium transition-colors drop-shadow-sm"
									tabIndex={-1}
								>
									Quên mật khẩu?
								</Link>
							</div>

							<div className="relative group">
								<Lock className="absolute left-3 top-3 h-5 w-5 text-white/70 group-focus-within:text-indigo-300 transition-colors" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="pl-10 pr-10 bg-white/20 border-white/30 focus:border-indigo-400 focus:ring-indigo-400/30 h-12 text-white placeholder:text-white/60 rounded-xl transition-all shadow-sm"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors focus:outline-none"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
							disabled={isLoading}
						>
							{isLoading ? (
								<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang xử lý...</>
							) : (
								t('i_login')
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}