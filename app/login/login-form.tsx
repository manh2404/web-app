'use client';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useRouter, useSearchParams} from 'next/navigation';
import {ComponentPropsWithoutRef, FormEvent, useState} from 'react';
import {POST_METHOD} from '@/lib/req';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'next/link';

export function LoginForm({className, ...props}: ComponentPropsWithoutRef<'div'>) {
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect');
	const router = useRouter();
  const {t} = useTranslation();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		await POST_METHOD(`/api/login`, {username, password}).then().catch();

		if (redirect) {
			router.push(redirect);
		} else {
			router.push('/control'); // hoặc redirect theo logic app của bạn
		}
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">{t('i_login')}</CardTitle>
					<CardDescription>
            <Trans
              i18nKey="i_login_desc"
              components={{
                1: <Link href="/signup" className="text-primary underline" />
              }}
            />
          </CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">{t('i_phone_or_email')}</Label>
								<Input id="email" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
								       placeholder="Username" required/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">{t('i_password')}</Label>
								</div>
								<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
								       placeholder="Password" required/>
							</div>
							<Button type="submit" className="w-full">
                {t('i_login')}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
