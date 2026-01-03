'use client';

import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function SecurityForm() {
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [passData, setPassData] = useState({ current: '', new: '' });

  const handleChangePass = () => {
    if(!passData.current || !passData.new) return toast.error("Vui lòng nhập đầy đủ");
    toast.success("Đã cập nhật mật khẩu mới!");
    setPassData({ current: '', new: '' });
  };

  const inputClass = "bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-11 pr-10";
  const labelClass = "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl backdrop-blur-sm">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-orange-400" /> Bảo mật
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">

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
              className="absolute right-3 top-3 text-zinc-500 hover:text-white"
            >
              {showPass.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

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
              className="absolute right-3 top-3 text-zinc-500 hover:text-white"
            >
              {showPass.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleChangePass}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20"
        >
          <Check className="h-4 w-4 mr-2" /> Cập nhật mật khẩu
        </Button>

      </CardContent>
    </Card>
  );
}