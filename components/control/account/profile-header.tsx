'use client';

import React, { useRef, useState } from 'react';
import { Camera, MapPin, Briefcase, ShieldCheck, Pen, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ProfileHeader() {
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");
  const [coverUrl, setCoverUrl] = useState<string | null>("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3");

  const [previewType, setPreviewType] = useState<'avatar' | 'cover' | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarUrl(url);
        toast.success("Đã cập nhật ảnh đại diện");
      } else {
        setCoverUrl(url);
        toast.success("Đã cập nhật ảnh bìa");
      }
    }
  };

  const previewUrl = previewType === 'avatar' ? avatarUrl : (coverUrl || '');

  return (
    <div className="relative mb-6">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />

      {/* --- ẢNH BÌA --- */}
      <div
        className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden group/cover shadow-md dark:shadow-2xl border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900 cursor-pointer"
        onClick={() => coverUrl && setPreviewType('cover')}
      >
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full relative bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-500 dark:from-indigo-900 dark:via-slate-900 dark:to-zinc-900">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 z-10">
          <Button
            size="sm"
            className="bg-white/80 hover:bg-white text-black dark:bg-black/40 dark:hover:bg-black/60 dark:text-white backdrop-blur-md border border-white/20 shadow-sm"
            onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
          >
            <Pen className="h-3.5 w-3.5 mr-2" /> Đổi ảnh bìa
          </Button>
        </div>
      </div>

      {/* --- AVATAR & INFO --- */}
      <div className="px-6 md:px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-5">
        <div className="relative group/avatar">
          <Avatar
            className={cn(
              "h-32 w-32 shadow-2xl rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-105",
              "border-[4px] border-zinc-50 dark:border-[#0a0a0a]"
            )}
            onClick={() => setPreviewType('avatar')}
          >
            <AvatarImage src={avatarUrl} className="object-cover" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>

          <div
            className={cn(
              "absolute bottom-1 right-1 p-2 rounded-full shadow-lg cursor-pointer transition-colors z-20",
              "bg-indigo-600 text-white hover:bg-indigo-700",
              "border-[3px] border-zinc-50 dark:border-[#0a0a0a]"
            )}
            onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
          >
            <Camera className="h-4 w-4" />
          </div>
        </div>

        <div className="flex-1 pb-2 text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">Nguyễn Văn User</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Software Engineer</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Thái Nguyên</span>
          </div>
        </div>

        <div className="pb-4 hidden md:block">
          <Badge className={cn(
            "px-3 py-1 text-xs backdrop-blur-md shadow-sm",
            "bg-indigo-50 text-indigo-700 border-indigo-200",
            "dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30"
          )}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified Account
          </Badge>
        </div>
      </div>

      {/* --- DIALOG PREVIEW ẢNH --- */}
      <Dialog open={!!previewType} onOpenChange={(open) => !open && setPreviewType(null)}>
        {/* [FIX]:
          1. [&>button]:hidden -> Ẩn nút X mặc định (vì nó là button con trực tiếp của DialogContent).
          2. Giữ nguyên các class fixed, !top-0 để đảm bảo layout full màn hình.
        */}
        <DialogContent className="fixed !top-0 !left-0 z-[9999] flex !h-screen !w-screen !max-h-none !max-w-none flex-col items-center justify-center border-none bg-black/95 p-0 shadow-none outline-none !translate-x-0 !translate-y-0 m-0 [&>button]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">

          <DialogTitle className="hidden">Image Preview</DialogTitle>

          {/* Wrapper: Bọc nội dung vào đây để nút X màu cam trở thành "cháu", không bị ẩn bởi [&>button]:hidden */}
          <div className="relative w-full h-full flex items-center justify-center">

            {/* Nút X màu cam tùy chỉnh */}
            <button
              onClick={() => setPreviewType(null)}
              className="absolute right-5 top-5 z-50 p-2 text-orange-500 hover:text-orange-400 transition-transform hover:scale-110 active:scale-95 outline-none focus:outline-none"
              type="button"
            >
              <X className="h-8 w-8" strokeWidth={3} />
            </button>

            {/* Ảnh */}
            <div
              className="relative flex h-full w-full items-center justify-center p-0"
              onClick={() => setPreviewType(null)}
            >
              <img
                src={previewUrl}
                alt="Preview Full"
                className="max-h-[95vh] max-w-[95vw] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}