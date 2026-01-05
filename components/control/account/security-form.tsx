'use client';

import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SecurityForm() {
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [passData, setPassData] = useState({ current: '', new: '' });
  const [loading, setLoading] = useState(false);

  const handleChangePass = () => {
    if(!passData.current || !passData.new) return toast.error("Vui lòng nhập đầy đủ");

    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật mật khẩu mới!");
      setPassData({ current: '', new: '' });
    }, 1000);
  };

  // --- STYLE CLASSES ---
  const inputClass = cn(
    "h-11 pr-10 transition-all",
    "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-0",
    "dark:bg-[#1a1a1d] dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-600"
  );

  const labelClass = "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block";

  return (
    <Card className="h-full flex flex-col border shadow-sm bg-white border-zinc-200 dark:bg-[#121214] dark:border-zinc-800 transition-colors">

      {/* HEADER */}
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-orange-600 dark:text-orange-500" /> Bảo mật
        </CardTitle>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-6 flex-1 flex flex-col gap-6">

        {/* Mật khẩu hiện tại */}
        <div>
          <Label className={labelClass}>Mật khẩu hiện tại</Label>
          <div className="relative">
            <Input
              type={showPass.current ? "text" : "password"}
              value={passData.current}
              onChange={e => setPassData({...passData, current: e.target.value})}
              className={inputClass}
              placeholder="••••••••"
            />
            <button
              onClick={() => setShowPass({...showPass, current: !showPass.current})}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              type="button"
            >
              {showPass.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <Label className={labelClass}>Mật khẩu mới</Label>
          <div className="relative">
            <Input
              type={showPass.new ? "text" : "password"}
              value={passData.new}
              onChange={e => setPassData({...passData, new: e.target.value})}
              className={inputClass}
              placeholder="••••••••"
            />
            <button
              onClick={() => setShowPass({...showPass, new: !showPass.new})}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              type="button"
            >
              {showPass.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Nút Cập nhật */}
        <div className="mt-auto pt-4">
          <Button
            onClick={handleChangePass}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20 dark:hover:bg-orange-500 h-11 font-medium"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <><Check className="h-4 w-4 mr-2" /> Cập nhật mật khẩu</>
            )}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}