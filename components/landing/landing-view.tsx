'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const greetings = ["Xin chào", "Welcome"];

export function LandingView() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Logic đổi lời chào
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Logic thanh loading và redirect
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
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  const checkAuthAndRedirect = () => {
    const isLoggedIn = false;
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    // Sử dụng bg-background để ăn theo màu Stone/Slate của theme global
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden font-sans">

      {/* Background Decor (Màu Cam Tĩnh - Không Animation) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* LOGO BOX (Tĩnh, màu cam) */}
        <div className="relative w-28 h-28 bg-card border border-border rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/10 overflow-hidden">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.jpg" // Đảm bảo file ảnh có trong public
              alt="App Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Greetings (Text tĩnh, đổi nội dung) */}
        <div className="h-12 flex items-center justify-center min-w-[200px]">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight transition-opacity duration-300">
            {greetings[index]}
          </h1>
        </div>

        {/* Loading Bar (Màu Cam) */}
        <div className="flex flex-col items-center gap-3 w-[250px]">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Loader2 className="h-3 w-3 animate-spin text-orange-600" />
            <span>Loading system... {progress}%</span>
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 text-muted-foreground text-xs font-mono z-10">
        © 2025 Product by @HokaDev
      </div>
    </div>
  );
}