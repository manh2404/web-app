'use client';

import React, { useState } from 'react';
import {
  Send,
  Smile,
  Frown,
  Meh,
  Bug,
  Lightbulb,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import GlobalLoading from '@/components/ui/global-loading';

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State quản lý form
  const [rating, setRating] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('general');
  const [content, setContent] = useState('');

  // Xử lý gửi phản hồi
  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setRating(null);
    setCategory('general');
    setContent('');
  };

  return (
    <div className={cn(
      "flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto relative",
      // Light Mode Background: Mặc định
      "bg-zinc-50/50",
      // Dark Mode Background: Đen sâu
      "dark:bg-[#0a0a0a]",
      // Custom Scrollbar
      "[&::-webkit-scrollbar]:w-2",
      "[&::-webkit-scrollbar-track]:bg-transparent",
      "dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800",
      "[&::-webkit-scrollbar-thumb]:bg-zinc-300",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      "dark:[&::-webkit-scrollbar-thumb]:hover:bg-zinc-700"
    )}>

      {/* Loading đỏ */}
      {isLoading && <GlobalLoading />}

      {/* --- HERO BANNER --- */}
      <div className="relative text-center py-12 px-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700 shadow-xl text-white shrink-0 overflow-hidden">
        {/* Họa tiết trang trí mờ */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 drop-shadow-md">
            Gửi phản hồi
          </h1>
          <p className="text-orange-50 dark:text-orange-100/80 max-w-xl mx-auto text-sm md:text-base font-medium">
            Ý kiến của bạn giúp Batek System tốt hơn mỗi ngày.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT (Form) --- */}
      <div className="max-w-2xl mx-auto w-full pb-10">

        {isSubmitted ? (
          // --- MÀN HÌNH THÀNH CÔNG ---
          <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/50 backdrop-blur-md shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-5">
              <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Cảm ơn bạn!</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto">
                  Chúng tôi đã nhận được thông tin và sẽ xem xét sớm nhất.
                </p>
              </div>
              <Button onClick={handleReset} variant="outline" className="mt-4 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                Gửi phản hồi khác
              </Button>
            </CardContent>
          </Card>
        ) : (
          // --- FORM NHẬP LIỆU ---
          <Card className={cn(
            "border shadow-sm transition-all",
            // Light: Trắng, sạch sẽ
            "bg-white border-zinc-200",
            // Dark: Xám tối, viền rõ ràng
            "dark:bg-[#121214] dark:border-zinc-800"
          )}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">Nội dung chi tiết</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">Vui lòng điền đầy đủ thông tin bên dưới.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* 1. Chọn cảm xúc */}
              <div className="space-y-4">
                <Label className="text-zinc-700 dark:text-zinc-300">Bạn cảm thấy thế nào?</Label>
                <div className="flex justify-center gap-6">
                  {[
                    { value: 'bad', icon: Frown, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900' },
                    { value: 'neutral', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900' },
                    { value: 'good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-900' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setRating(item.value)}
                      className={cn(
                        "p-4 rounded-2xl transition-all duration-300 transform border-2",
                        rating === item.value
                          ? `${item.bg} ${item.border} scale-110 shadow-md`
                          : "bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 scale-100 opacity-60 hover:opacity-100"
                      )}
                    >
                      <item.icon className={cn("h-10 w-10 transition-colors", rating === item.value ? item.color : "text-zinc-400 dark:text-zinc-500")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn loại phản hồi */}
              <div className="space-y-4">
                <Label className="text-zinc-700 dark:text-zinc-300">Loại phản hồi</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'bug', label: 'Báo lỗi', icon: Bug, activeColor: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
                    { id: 'feature', label: 'Tính năng', icon: Lightbulb, activeColor: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
                    { id: 'general', label: 'Chung', icon: MessageSquare, activeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 h-24 gap-2",
                        category === item.id
                          ? `${item.activeColor} shadow-sm font-semibold`
                          : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800"
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Nội dung text */}
              <div className="space-y-3">
                <Label htmlFor="message" className="text-zinc-700 dark:text-zinc-300">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  placeholder="Hãy kể cho chúng tôi nghe..."
                  className={cn(
                    "min-h-[140px] resize-none text-base p-4",
                    // Light
                    "bg-zinc-50 border-zinc-200 text-zinc-900 focus-visible:ring-orange-500",
                    // Dark
                    "dark:bg-[#1a1a1d] dark:border-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus-visible:ring-orange-500"
                  )}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* 4. Đính kèm file */}
              <div className="space-y-3">
                <Label className="text-zinc-700 dark:text-zinc-300">Đính kèm (Tùy chọn)</Label>
                <div className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group",
                  // Light
                  "border-zinc-200 hover:border-orange-400 hover:bg-orange-50/50",
                  // Dark
                  "dark:border-zinc-800 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/5"
                )}>
                  <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Paperclip className="h-6 w-6 text-zinc-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    Kéo thả hoặc <span className="text-orange-600 dark:text-orange-500">bấm để tải lên</span>
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG (Max 5MB)</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 h-12 text-base font-bold rounded-xl border-0"
                onClick={handleSubmit}
                disabled={!content.trim() || isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang gửi...</>
                ) : (
                  <><Send className="mr-2 h-5 w-5" /> Gửi phản hồi</>
                )}
              </Button>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}