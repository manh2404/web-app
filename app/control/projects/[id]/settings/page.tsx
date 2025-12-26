'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Settings2, Users, Trash2, Globe, Fingerprint,
  Image as ImageIcon, Save, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;

  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [memberToDelete, setMemberToDelete] = useState<any>(null);

  // State quản lý dữ liệu dự án
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Lấy dữ liệu dự án từ API khi mount
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        toast.error("Không thể tải thông tin dự án");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // 2. Hàm xử lý Lưu thay đổi (PUT)
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/api/projects/${projectId}`, project);
      toast.success("Đã cập nhật dự án thành công!");
    } catch (err) {
      toast.error("Lỗi khi lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  // 3. Hàm xử lý Xóa thành viên
  const confirmDeleteMember = async () => {
    try {
      const updatedMembers = project.members.filter((m: any) => m.name !== memberToDelete.name);
      await axios.put(`/api/projects/${projectId}`, { ...project, members: updatedMembers });
      setProject({ ...project, members: updatedMembers });
      toast.success(`Đã xóa ${memberToDelete.name}`);
    } catch (err) {
      toast.error("Lỗi khi xóa thành viên");
    } finally {
      setMemberToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#050505] text-white overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="flex items-center h-16 px-6 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-xl z-10">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Trở lại
        </Button>
        <div className="h-4 w-[1px] bg-white/10 mx-4" />
        <h1 className="text-sm font-bold tracking-[0.2em] text-indigo-400">CÀI ĐẶT DỰ ÁN</h1>
      </div>

      <div className="flex flex-1 overflow-hidden z-10">
        {/* SIDEBAR */}
        <div className="w-72 border-r border-white/5 p-6 space-y-3 shrink-0 bg-black/20">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-4">Menu quản lý</p>
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'general' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg' : 'text-zinc-500 hover:bg-white/5'
            }`}
          >
            <Settings2 className="h-4 w-4" /> Chung
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'members' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg' : 'text-zinc-500 hover:bg-white/5'
            }`}
          >
            <Users className="h-4 w-4" /> Thành viên
          </button>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'general' && (
            <div className="max-w-4xl space-y-10">
              {/* Cover Image */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8" className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6 flex items-end gap-5 z-20">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-2xl border border-white/20">
                    🚀
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{project?.title || 'Dự án mới'}</h2>
                    <Badge className="bg-white/10 text-[10px] mt-1 uppercase">DỰ ÁN {project?.status || 'Active'}</Badge>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest">Tên dự án</label>
                  <Input
                    value={project?.title || ''}
                    onChange={(e) => setProject({...project, title: e.target.value})}
                    className="h-12 bg-white/[0.03] border-white/10 focus:border-indigo-500/50 rounded-xl"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest">Mô tả dự án</label>
                  <Textarea
                    className="min-h-[120px] bg-white/[0.03] border-white/10 focus:border-indigo-500/50 rounded-xl p-4"
                    value={project?.description || ''}
                    onChange={(e) => setProject({...project, description: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Fingerprint className="h-3 w-3" /> Database ID</label>
                  <Input value={project?._id || ''} disabled className="h-11 bg-white/[0.01] border-white/5 text-zinc-600 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Globe className="h-3 w-3" /> Trạng thái</label>
                  <Input value={project?.status || ''} onChange={(e) => setProject({...project, status: e.target.value})} className="h-11 bg-white/[0.03] border-white/10 rounded-xl" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-white/5">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-xl shadow-lg transition-all gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Lưu thay đổi
                </Button>
                <p className="text-[10px] text-zinc-500 italic font-medium">Cập nhật lần cuối: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Thành viên</h2>
                  <p className="text-sm text-zinc-500 mt-1 italic">Dự án hiện có {project?.members?.length || 0} nhân sự đang hoạt động.</p>
                </div>
                <Button className="bg-white text-black hover:bg-zinc-200 px-6 font-bold rounded-xl transition-all">
                  Mời nhân sự mới +
                </Button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                  <tr className="bg-white/[0.03] text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                    <th className="px-6 py-5 text-left font-black">Nhân sự</th>
                    <th className="px-6 py-5 text-left font-black">Vai trò</th>
                    <th className="px-6 py-5 text-right font-black px-10">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {project?.members?.map((member: any, i: number) => (
                    <tr key={i} className="group hover:bg-indigo-500/[0.03] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white/10 group-hover:border-indigo-500/30 transition-all">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-zinc-800 text-xs font-bold">
                              {member.name ? member.name.substring(0, 2).toUpperCase() : "??"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="bg-indigo-500/5 text-indigo-400 border-indigo-500/20 text-[10px]">MEMBER</Badge>
                      </td>
                      <td className="px-6 py-5 text-right px-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-full opacity-0 group-hover:opacity-100"
                          onClick={() => setMemberToDelete(member)}
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

      {/* ALERT DIALOG */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 uppercase font-black italic">Cảnh báo hệ thống!</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bạn chắc chắn muốn xóa <span className="text-white font-bold">{memberToDelete?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-white/5">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember} className="bg-red-600 hover:bg-red-500">Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}