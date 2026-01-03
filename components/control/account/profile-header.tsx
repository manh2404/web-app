'use client';

import React, { useRef, useState } from 'react';
import { Camera, MapPin, Briefcase, ShieldCheck, Pen, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; // [MỚI] Import Dialog
import { toast } from 'sonner';

export function ProfileHeader() {
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // [MỚI] State xem ảnh

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

  return (
    <div className="relative mb-6">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />

      {/* Ảnh Bìa */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden group/cover shadow-2xl border border-white/5">
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-zinc-900 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10" onClick={() => coverInputRef.current?.click()}>
            <Pen className="h-3.5 w-3.5 mr-2" /> Đổi ảnh bìa
          </Button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="px-6 md:px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-5">

        {/* Avatar có Click xem trước */}
        <div className="relative group/avatar">
          <Avatar
            className="h-32 w-32 border-[4px] border-[#0a0a0a] shadow-2xl rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-105"
            onClick={() => setIsPreviewOpen(true)} // [MỚI] Mở Preview
          >
            <AvatarImage src={avatarUrl} className="object-cover" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>

          {/* Nút upload ảnh nhỏ bên cạnh */}
          <div
            className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full text-white shadow-lg border-[3px] border-[#0a0a0a] cursor-pointer hover:bg-indigo-700 transition-colors z-20"
            onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
          >
            <Camera className="h-4 w-4" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 pb-2 text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">Nguyễn Văn User</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-400 text-sm">
            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Software Engineer</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Thái Nguyên</span>
          </div>
        </div>

        <div className="pb-4 hidden md:block">
          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 px-3 py-1 text-xs backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified Account
          </Badge>
        </div>
      </div>

      {/* [MỚI] Dialog Xem Ảnh */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-black/95 flex items-center justify-center z-[9999]">
          <DialogTitle className="hidden">Avatar Preview</DialogTitle>

          <div className="relative w-full h-full p-4 flex items-center justify-center" onClick={() => setIsPreviewOpen(false)}>
            <img src={avatarUrl} alt="Avatar Full" className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}