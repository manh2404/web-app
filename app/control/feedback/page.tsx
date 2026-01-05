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

  // Class kính mờ cho Form
  const glassCardClass = "bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-sm border";

  return (
    <div className={cn(
      "flex flex-col h-full w-full space-y-6 p-6 overflow-y-auto relative",
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
      <div className="relative text-center py-10 px-6 rounded-2xl bg-gradient-to-br from-red-600 to-indigo-600 shadow-lg text-white shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Gửi phản hồi
        </h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Ý kiến của bạn giúp chúng tôi cải thiện Batek System tốt hơn mỗi ngày.
        </p>
      </div>

      {/* --- MAIN CONTENT (Form) --- */}
      <div className="max-w-2xl mx-auto w-full pb-10">

        {isSubmitted ? (
          // --- MÀN HÌNH THÀNH CÔNG ---
          <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-900/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Cảm ơn phản hồi của bạn!</h2>
              <p className="text-muted-foreground max-w-md">
                Chúng tôi đã nhận được thông tin và sẽ xem xét trong thời gian sớm nhất.
              </p>
              <Button onClick={handleReset} variant="outline" className="mt-4 bg-white/40 hover:bg-white/60">
                Gửi phản hồi khác
              </Button>
            </CardContent>
          </Card>
        ) : (
          // --- FORM NHẬP LIỆU (GLASS STYLE) ---
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle>Nội dung chi tiết</CardTitle>
              <CardDescription className="text-muted-foreground/80">Vui lòng điền đầy đủ thông tin bên dưới.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* 1. Chọn cảm xúc */}
              <div className="space-y-3">
                <Label>Bạn cảm thấy thế nào về trải nghiệm hôm nay?</Label>
                <div className="flex justify-center gap-4 py-2">
                  {[
                    { value: 'bad', icon: Frown, color: 'hover:text-red-500 hover:bg-red-50/80 text-muted-foreground', active: 'text-red-500 bg-red-100 dark:bg-red-900/30 ring-1 ring-red-500' },
                    { value: 'neutral', icon: Meh, color: 'hover:text-yellow-500 hover:bg-yellow-50/80 text-muted-foreground', active: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 ring-1 ring-yellow-500' },
                    { value: 'good', icon: Smile, color: 'hover:text-green-500 hover:bg-green-50/80 text-muted-foreground', active: 'text-green-500 bg-green-100 dark:bg-green-900/30 ring-1 ring-green-500' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setRating(item.value)}
                      className={cn(
                        "p-3 rounded-2xl transition-all duration-200 scale-100 active:scale-105",
                        rating === item.value ? item.active : `bg-muted/50 ${item.color}`
                      )}
                    >
                      <item.icon className="h-8 w-8" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn loại phản hồi */}
              <div className="space-y-3">
                <Label>Loại phản hồi</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'bug', label: 'Báo lỗi', icon: Bug },
                    { id: 'feature', label: 'Tính năng', icon: Lightbulb },
                    { id: 'general', label: 'Chung', icon: MessageSquare },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                        category === item.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                          : "border-border/50 bg-white/40 dark:bg-black/20 text-muted-foreground hover:bg-white/60"
                      )}
                    >
                      <item.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Nội dung text */}
              <div className="space-y-3">
                <Label htmlFor="message">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  placeholder="Hãy kể cho chúng tôi nghe..."
                  className="min-h-[120px] resize-none bg-white/40 dark:bg-black/20 border-white/20 focus-visible:ring-blue-500/50"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* 4. Đính kèm file */}
              <div className="space-y-3">
                <Label>Đính kèm hình ảnh (Tùy chọn)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-white/20 dark:hover:bg-white/5 transition-colors cursor-pointer group bg-white/10">
                  <div className="h-10 w-10 bg-muted/50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kéo thả hoặc <span className="text-blue-500 font-medium">bấm để tải lên</span>
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG (Max 5MB)</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 h-11 text-base border-0"
                onClick={handleSubmit}
                disabled={!content.trim() || isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Gửi phản hồi</>
                )}
              </Button>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}