'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Settings2, Users, Trash2,
  Save, Loader2, Camera, Search, UserPlus, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// --- MOCK DATA ---
const MOCK_SYSTEM_USERS = [
  { _id: 'u1', firstname: 'Nguyễn', lastname: 'Văn A', email: 'vana@batek.vn', avatar: '' },
  { _id: 'u2', firstname: 'Trần', lastname: 'Thị B', email: 'thib@batek.vn', avatar: '' },
  { _id: 'u3', firstname: 'Lê', lastname: 'Hoàng C', email: 'hoangc@batek.vn', avatar: '' },
  { _id: 'u4', firstname: 'Phạm', lastname: 'Minh D', email: 'minhd@batek.vn', avatar: '' },
  { _id: 'u5', firstname: 'Hoàng', lastname: 'Thùy E', email: 'thuye@batek.vn', avatar: '' },
];

export function ProjectSettingsView({ projectId }: { projectId: string }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

  // State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [project, setProject] = useState<any>(null);

  // [FIX] Khởi tạo loading là true, nhưng giao diện sẽ dùng Skeleton hoặc check null an toàn hơn
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 1. Mock Data Loading
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setTimeout(() => {
        setProject({
          _id: projectId,
          title: "Website Bán Hàng 2026",
          description: "Dự án phát triển nền tảng thương mại điện tử thế hệ mới.",
          key: "WEB-2026",
          coverImage: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8",
          avatar: "",
          status: "active",
          members: [
            { _id: 'u1', name: 'Nguyễn Văn A', email: 'vana@batek.vn', avatar: '' },
            { _id: 'u2', name: 'Trần Thị B', email: 'thib@batek.vn', avatar: '' },
          ]
        });
        setLoading(false);
      }, 500); // Giảm thời gian load để test nhanh
    };
    fetchProject();
  }, [projectId]);

  // Các hàm xử lý giữ nguyên...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'cover') setProject({ ...project, coverImage: previewUrl });
      else setProject({ ...project, avatar: previewUrl });
      toast.success(`Đã chọn ảnh ${type === 'cover' ? 'bìa' : 'đại diện'} mới`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Đã cập nhật thành công!");
    }, 1000);
  };

  const confirmDeleteMember = () => {
    const updatedMembers = project.members.filter((m: any) => m._id !== memberToDelete._id);
    setProject({ ...project, members: updatedMembers });
    toast.success(`Đã xóa ${memberToDelete.name}`);
    setMemberToDelete(null);
  };

  const handleDeleteProject = () => {
    toast.success("Đã xóa dự án");
    setDeleteProjectOpen(false);
    router.push('/control/projects');
  };

  const handleAddMember = (user: any) => {
    if (project.members.find((m: any) => m._id === user._id)) return toast.warning("Đã có trong dự án");
    const newMember = { _id: user._id, name: `${user.lastname} ${user.firstname}`, avatar: user.avatar, email: user.email };
    setProject({ ...project, members: [...project.members, newMember] });
    toast.success("Đã thêm thành viên");
  };

  const availableUsers = MOCK_SYSTEM_USERS.filter(u => !project?.members?.some((m: any) => m._id === u._id));

  // [FIX] Scrollbar Style
  const scrollbarStyles = `
    overflow-y-auto 
    pr-2
    [&::-webkit-scrollbar]:w-[6px] 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-zinc-800 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700
  `;

  return (
    // [FIX] Container chính: Đảm bảo full chiều cao và flex column
    <div className="absolute inset-4 flex flex-col bg-background text-foreground overflow-hidden rounded-xl border border-border shadow-sm">

      {/* Background Gradients (Cam) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />

      {/* HEADER */}
      <div className="flex-none flex items-center h-14 px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-zinc-400 hover:text-white h-8 hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" /> <span className="text-xs font-medium">Quay lại</span>
          </Button>
          <div className="h-4 w-[1px] bg-white/10 mx-4" />
          <h1 className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase">Cài đặt dự án</h1>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-4 rounded-lg shadow-lg gap-2 text-[10px] font-bold uppercase tracking-wide">
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} LƯU THAY ĐỔI
        </Button>
      </div>

      {/* BODY CONTAINER */}
      <div className="flex flex-1 overflow-hidden z-10">

        {/* SIDEBAR */}
        <div className="flex-none w-64 border-r border-white/5 p-4 flex flex-col bg-black/20 backdrop-blur-sm h-full">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-3 mt-2">Menu</p>
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-white/5 text-orange-400 border border-white/5 shadow-inner' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
              <Settings2 className="h-4 w-4" /> Chung
            </button>
            <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'members' ? 'bg-white/5 text-orange-400 border border-white/5 shadow-inner' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
              <Users className="h-4 w-4" /> Thành viên
            </button>
          </div>
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Trạng thái dự án</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">
          {/* [FIX] Kiểm tra loading: Nếu đang load thì hiện spinner, ngược lại hiện content */}
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <div className={`flex-1 ${scrollbarStyles} p-8 md:p-12`}>

              {/* --- TAB: GENERAL --- */}
              {activeTab === 'general' && (
                <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500 slide-in-from-bottom-4">
                  <Card className="bg-[#09090b]/80 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden h-fit">
                    {/* Cover Image */}
                    <div className="relative h-48 w-full group border-b border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 pointer-events-none" />
                      {/* Ảnh bìa */}
                      <img
                        src={project?.coverImage || "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8"}
                        className="w-full h-full object-cover transition-transform duration-700"
                        alt="Cover"
                      />
                      {/* Overlay màu cam nhẹ */}
                      <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay pointer-events-none" />

                      <button onClick={() => coverInputRef.current?.click()} className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-4 w-4" />
                      </button>

                      <div className="absolute -bottom-10 left-8 flex items-end gap-5 z-20">
                        <div className="relative h-20 w-20 rounded-2xl bg-[#121214] flex items-center justify-center shadow-2xl border border-white/20 group/avatar cursor-pointer overflow-hidden ring-4 ring-[#09090b]" onClick={() => avatarInputRef.current?.click()}>
                          {project?.avatar ? <img src={project.avatar} className="w-full h-full object-cover" alt="Avatar"/> : <span className="text-3xl">🚀</span>}
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"><Camera className="h-5 w-5 text-white" /></div>
                        </div>
                        <div className="mb-12"><h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight">{project?.title || 'Dự án mới'}</h2></div>
                      </div>
                    </div>

                    {/* Form */}
                    <CardContent className="pt-14 pb-8 px-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Tên dự án</label>
                        <Input value={project?.title || ''} onChange={(e) => setProject({...project, title: e.target.value})} className="bg-white/[0.03] border-white/10 focus:border-orange-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Mô tả</label>
                        <Textarea className="min-h-[100px] bg-white/[0.03] border-white/10 focus:border-orange-500/50 resize-none" value={project?.description || ''} onChange={(e) => setProject({...project, description: e.target.value})} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-red-500 font-bold flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Khu vực nguy hiểm</h3>
                        <p className="text-sm text-zinc-400 mt-1">Xóa dự án này sẽ xóa vĩnh viễn mọi dữ liệu liên quan. Hành động này không thể hoàn tác.</p>
                      </div>
                      <Button variant="destructive" onClick={() => setDeleteProjectOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold whitespace-nowrap shadow-lg shadow-red-900/20 transition-all hover:scale-105 hover:shadow-red-900/40">Xóa dự án này</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: MEMBERS --- */}
              {activeTab === 'members' && (
                <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 slide-in-from-bottom-4">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Thành viên</h2>
                      <p className="text-sm text-zinc-500 mt-1 italic">Dự án hiện có {project?.members?.length || 0} nhân sự đang hoạt động.</p>
                    </div>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                      <DialogTrigger asChild><Button className="bg-white text-black hover:bg-zinc-200 px-6 font-bold rounded-xl transition-all h-10 text-xs uppercase tracking-wide gap-2"><UserPlus className="h-4 w-4" /> Mời nhân sự mới</Button></DialogTrigger>
                      <DialogContent className="bg-[#0c0c0c] border border-white/10 text-white sm:max-w-md">
                        <DialogHeader><DialogTitle>Mời thành viên</DialogTitle><DialogDescription className="text-zinc-400">Tìm kiếm và thêm nhân sự vào dự án <strong>{project?.title}</strong>.</DialogDescription></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" /><Input placeholder="Tìm theo tên hoặc email..." className="pl-9 bg-white/5 border-white/10 focus:border-orange-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableUsers.length > 0 ? availableUsers.map((user) => (
                              <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border border-white/10"><AvatarFallback className="bg-orange-600 text-[10px] font-bold">{user.lastname[0]}</AvatarFallback></Avatar>
                                  <div className="flex flex-col"><span className="text-sm font-bold text-zinc-200">{user.lastname} {user.firstname}</span><span className="text-[10px] text-zinc-500">{user.email}</span></div>
                                </div>
                                <Button size="sm" className="h-7 bg-white/10 hover:bg-orange-600 hover:text-white text-zinc-300 border border-white/5 transition-all" onClick={() => handleAddMember(user)}>Thêm +</Button>
                              </div>
                            )) : <div className="text-center py-8 text-zinc-500 text-sm">Không tìm thấy kết quả nào.</div>}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-md">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-white/[0.03] text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5"><th className="px-6 py-4 text-left font-black">Nhân sự</th><th className="px-6 py-4 text-left font-black">Vai trò</th><th className="px-6 py-4 text-right font-black px-10">Thao tác</th></tr></thead>
                      <tbody className="divide-y divide-white/5">
                      {project?.members?.map((member: any, i: number) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar className="h-9 w-9 border border-white/10 group-hover:border-orange-500/30 transition-all"><AvatarImage src={member.avatar} /><AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-400">{member.name ? member.name.substring(0, 2).toUpperCase() : "??"}</AvatarFallback></Avatar><span className="font-bold text-zinc-300 group-hover:text-orange-300 transition-colors">{member.name}</span></div></td>
                          <td className="px-6 py-4"><Badge variant="secondary" className="bg-white/5 text-zinc-400 hover:bg-white/10 text-[10px] font-mono">MEMBER</Badge></td>
                          <td className="px-6 py-4 text-right px-10"><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all" onClick={() => setMemberToDelete(member)}><Trash2 className="h-4 w-4" /></Button></td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DIALOGS */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-3xl">
          <AlertDialogHeader><AlertDialogTitle className="text-red-500 uppercase font-black italic">Cảnh báo hệ thống!</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">Bạn chắc chắn muốn xóa <span className="text-white font-bold">{memberToDelete?.name}</span>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="bg-zinc-900 border-white/5 hover:bg-zinc-800">Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteMember} className="bg-red-600 hover:bg-red-500">Xác nhận</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteProjectOpen} onOpenChange={setDeleteProjectOpen}>
        <AlertDialogContent className="bg-[#0c0c0c] border border-red-500/20 text-white rounded-2xl shadow-2xl shadow-red-900/10">
          <AlertDialogHeader><AlertDialogTitle className="text-red-500 uppercase font-black flex items-center gap-2 text-lg"><AlertTriangle className="h-5 w-5" /> Xác nhận xóa dự án</AlertDialogTitle><AlertDialogDescription className="text-zinc-400">Bạn có chắc chắn muốn xóa vĩnh viễn dự án <span className="text-white font-bold">{project?.title}</span> không? <br/><br/>Mọi dữ liệu task, thành viên và tài liệu liên quan sẽ bị xóa sạch và <span className="text-red-400">không thể khôi phục</span>.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="mt-4"><AlertDialogCancel className="bg-zinc-900 border-white/5 hover:bg-zinc-800 text-zinc-300">Suy nghĩ lại</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">Xóa vĩnh viễn</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}