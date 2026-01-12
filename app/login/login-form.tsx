'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { POST_METHOD } from '@/lib/req';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    // [MỚI] State lưu lỗi
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Reset lỗi cũ

        try {
            await POST_METHOD('/api/login', formData);
            toast.success("Đăng nhập thành công!");
            router.push(searchParams.get('redirect') || '/control');
        } catch (err: any) {
            console.error(err);
            // [MỚI] Hiển thị lỗi theo yêu cầu
            setError("Tài khoản hoặc mật khẩu không đúng. Vui lòng nhập lại.");
            // Hoặc rung form nếu muốn (Optional)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-xl">

            <CardHeader className="space-y-1 text-center pb-6 border-b border-slate-100 dark:border-slate-800/50 pt-6">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                    Đăng nhập hệ thống
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Chưa có tài khoản? <Link href="/signup" className="text-orange-600 dark:text-orange-500 font-semibold hover:underline transition-colors">Đăng ký ngay</Link>
                </div>
            </CardHeader>

            <CardContent className="pt-8 px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-semibold">
                            Email hoặc Số điện thoại
                        </Label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                                id="username"
                                placeholder="name@example.com"
                                className={cn(
                                    "pl-11 h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950",
                                    "text-slate-900 dark:text-white placeholder:text-slate-400",
                                    "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                )}
                                value={formData.username}
                                onChange={e => { setFormData({...formData, username: e.target.value}); setError(''); }}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">
                                Mật khẩu
                            </Label>
                            {/* Link chuyển sang trang Quên Mật Khẩu */}
                            <Link href="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-500 transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                                id="password"
                                type={showPass ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "pl-11 pr-11 h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950",
                                    "text-slate-900 dark:text-white placeholder:text-slate-400",
                                    "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                )}
                                value={formData.password}
                                onChange={e => { setFormData({...formData, password: e.target.value}); setError(''); }}
                                required
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* [MỚI] Khu vực hiển thị lỗi */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-1 fade-in duration-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-base rounded-lg shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <span className="flex items-center gap-2">Đăng nhập <ArrowRight className="h-4 w-4" /></span>}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
