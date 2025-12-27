'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'; // 👈 1. Import thêm cái này

const greetings = ["Xin chào", "Welcome"];

export default function RootPage() {
	const router = useRouter();
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % greetings.length);
		}, 1500);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress >= 100) {
					clearInterval(timer);
					return 100;
				}
				return oldProgress + 1;
			});
		}, 40);

		const redirectTimeout = setTimeout(() => {
			checkAuthAndRedirect();
		}, 6500);

		return () => {
			clearInterval(timer);
			clearTimeout(redirectTimeout);
		};
	}, []);

	const checkAuthAndRedirect = () => {
		// Logic check login của cậu
		const isLoggedIn = false;
		if (isLoggedIn) {
			router.push('/dashboard');
		} else {
			router.push('/login');
		}
	};

	return (
		<div className="relative h-screen w-full flex flex-col items-center justify-center bg-[#020617] overflow-hidden font-sans">

			{/* Background Effect */}
			<div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80" />
			<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

			<div className="relative z-10 flex flex-col items-center gap-8">

				{/* 👇 2. LOGO ẢNH Ở ĐÂY */}
				<motion.div
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="relative w-28 h-28 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)] backdrop-blur-xl overflow-hidden"
				>
					{/* Thay '/logo.jpg' bằng tên file ảnh của cậu trong thư mục public */}
					<div className="relative w-16 h-16">
						<Image
							src="/logo.jpg"
							alt="App Logo"
							fill
							className="object-contain"
							priority // Load ảnh ngay lập tức không đợi
						/>
					</div>
				</motion.div>

				{/* Greetings */}
				<div className="h-12 flex items-center justify-center min-w-[200px]">
					<AnimatePresence mode="wait">
						<motion.h1
							key={greetings[index]}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight"
						>
							{greetings[index]}
						</motion.h1>
					</AnimatePresence>
				</div>

				{/* Loading Bar */}
				<div className="flex flex-col items-center gap-3 w-[250px]">
					<div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
							initial={{ width: "0%" }}
							animate={{ width: `${progress}%` }}
						/>
					</div>

					<div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
						<Loader2 className="h-3 w-3 animate-spin" />
						<span>Loading... {progress}%</span>
					</div>
				</div>

			</div>

			<div className="absolute bottom-8 text-zinc-600 text-xs font-mono z-10">
				© 2025 Product by @HokaDev
			</div>
		</div>
	);
}