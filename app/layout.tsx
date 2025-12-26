import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AppContextProvider } from '@/context/app-context';
import { IConfig } from "@/models/config.model";
import { ReactNode } from 'react';
import { GetConfig } from '@/lib/services/config.service';
import { ThemeProvider } from '@/components/theme-provider';
import LangLayout from '@/app/lang';

// [MỚI] Import component hiệu ứng nền
import { BackgroundEffect } from '@/components/background-effect';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const config: IConfig = await GetConfig();
  return {
    title: config.title || 'BaoAn - Lifestyle',
    description: config.description || 'Powered by NextJS - Author Kot',
  };
}

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: ReactNode;
}>) {
  const config: IConfig = await GetConfig();
  return (
    <html lang="vi" suppressHydrationWarning>
    {/* [SỬA] Thêm class 'bg-[#020617] text-white min-h-screen relative' để chuẩn bị cho nền tối */}
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-white min-h-screen relative`}>

    {/* [MỚI] Đặt hiệu ứng nền ở đây (nó sẽ tự nằm chìm xuống dưới nhờ z-index -50) */}
    <BackgroundEffect />

    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

      {/* [MỚI] Bọc nội dung chính trong div relative z-10 để đảm bảo nội dung nổi lên trên nền */}
      <div className="relative z-10 h-full">
        <Toaster />
        <AppContextProvider config={config}>
          <LangLayout>{children}</LangLayout>
        </AppContextProvider>
      </div>

    </ThemeProvider>
    </body>
    </html>
  );
}