'use client';

import React, { useState } from 'react';
import {
  ArrowLeft, Settings2, Users, Trash2, Globe, Clock,
  Fingerprint, Image as ImageIcon, Search, ChevronDown, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params?.id || '1';
  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#050505] text-white overflow-hidden relative">
      {/* Hiệu ứng màu nền phía sau (Ambient Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* HEADER: Kính mờ phủ màu Indigo nhẹ */}
      <div className="flex items-center h-16 px-6 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-xl z-10">
        <Link href={`/control`}>
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" /> Trở lại
          </Button>
        </Link>
        <div className="h-4 w-[1px] bg-white/10 mx-4" />
        <h1 className="text-sm font-bold tracking-[0.2em] text-indigo-400">CÀI ĐẶT DỰ ÁN</h1>
      </div>

      <div className="flex flex-1 overflow-hidden z-10">
        {/* SIDEBAR NỘI BỘ: Thiết kế lại dạng phím bấm nổi */}
        <div className="w-72 border-r border-white/5 p-6 space-y-3 shrink-0 bg-black/20">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-4">Menu quản lý</p>
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'general'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Settings2 className={`h-4 w-4 ${activeTab === 'general' ? 'animate-pulse' : ''}`} /> Chung
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'members'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="h-4 w-4" /> Thành viên
          </button>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'general' && (
            <div className="max-w-4xl space-y-10">
              {/* Cover Image: Sử dụng Gradient mượt hơn */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 flex items-end gap-5 z-20">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-white/20">
                    👇
                  </div>
                  <div className="mb-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">Batek</h2>
                    <Badge className="bg-white/10 hover:bg-white/20 border-white/10 text-[10px] mt-1 uppercase">Dự án công khai</Badge>
                  </div>
                </div>
                <Button className="absolute top-6 right-6 gap-2 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 text-xs">
                  <ImageIcon className="h-3.5 w-3.5" /> Đổi ảnh bìa
                </Button>
              </div>

              {/* Form Input: Sử dụng hiệu ứng Glass khi focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest">Tên dự án</label>
                  <Input defaultValue="Batek" className="h-12 bg-white/[0.03] border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all rounded-xl" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest">Mô tả dự án</label>
                  <Textarea className="min-h-[120px] bg-white/[0.03] border-white/10 focus:border-indigo-500/50 rounded-xl resize-none p-4" defaultValue="Welcome to the project..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Fingerprint className="h-3 w-3" /> Project ID</label>
                  <Input defaultValue="BATEK" disabled className="h-11 bg-white/[0.01] border-white/5 text-zinc-500 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Globe className="h-3 w-3" /> Network</label>
                  <Input defaultValue="Công khai" className="h-11 bg-white/[0.03] border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-white/5">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 h-12 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all gap-2">
                  <Save className="h-4 w-4" /> Lưu thay đổi
                </Button>
                <p className="text-[10px] text-zinc-500 italic font-medium">Khởi tạo bởi hệ thống • Dec 08, 2025</p>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Thành viên</h2>
                  <p className="text-sm text-zinc-500 mt-1 italic">Dự án hiện có 8 nhân sự đang hoạt động.</p>
                </div>
                <Button className="bg-white text-black hover:bg-zinc-200 px-6 font-bold rounded-xl transition-all">
                  Mời nhân sự mới +
                </Button>
              </div>

              {/* Table với hiệu ứng Row Hover đẹp hơn */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
                <table className="w-full text-sm">
                  <thead>
                  <tr className="bg-white/[0.03] text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                    <th className="px-6 py-5 text-left font-black">Nhân sự</th>
                    <th className="px-6 py-5 text-left font-black">Email liên hệ</th>
                    <th className="px-6 py-5 text-left font-black">Vai trò</th>
                    <th className="px-6 py-5 text-right font-black px-10">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {['Manh Bui', 'Nguyễn Minh Quân', 'Chiến Lý'].map((name, i) => (
                    <tr key={i} className="group hover:bg-indigo-500/[0.03] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white/10 group-hover:border-indigo-500/30 transition-all">
                            <AvatarFallback className="bg-zinc-800 text-xs font-bold">{name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-zinc-500 font-mono text-xs italic">{name.toLowerCase().replace(' ', '')}@gmail.com</td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="bg-indigo-500/5 text-indigo-400 border-indigo-500/20 text-[10px] px-3">MEMBER</Badge>
                      </td>
                      <td className="px-6 py-5 text-right px-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => setMemberToDelete(name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL XÓA: Cải thiện màu sắc cảnh báo */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-red-500 tracking-tight italic uppercase">Cảnh báo hệ thống!</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 text-base mt-2 leading-relaxed">
              Bạn đang yêu cầu xóa <span className="text-white font-bold">{memberToDelete}</span> khỏi dự án. Mọi dữ liệu công việc liên quan sẽ được ẩn đi. Bạn chắc chắn chứ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="bg-zinc-900 border-white/5 hover:bg-zinc-800 rounded-xl px-6 h-12 transition-all">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setMemberToDelete(null)}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-red-600/20"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}