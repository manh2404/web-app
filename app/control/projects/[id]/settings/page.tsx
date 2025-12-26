'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Settings2, Users, Trash2, Globe, Fingerprint,
  Save, Loader2, Camera, KeyRound, Search, UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";


// --- MOCK DATA: DANH SÁCH USER CỦA HỆ THỐNG ---
// Trong thực tế cậu sẽ gọi API lấy list user để search
const MOCK_SYSTEM_USERS = [
  { _id: 'u1', firstname: 'Nguyễn', lastname: 'Văn A', email: 'vana@batek.vn', avatar: '' },
  { _id: 'u2', firstname: 'Trần', lastname: 'Thị B', email: 'thib@batek.vn', avatar: '' },
  { _id: 'u3', firstname: 'Lê', lastname: 'Hoàng C', email: 'hoangc@batek.vn', avatar: '' },
  { _id: 'u4', firstname: 'Phạm', lastname: 'Minh D', email: 'minhd@batek.vn', avatar: '' },
  { _id: 'u5', firstname: 'Hoàng', lastname: 'Thùy E', email: 'thuye@batek.vn', avatar: '' },
];

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;

  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [memberToDelete, setMemberToDelete] = useState<any>(null);

  // State Invite
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State Project
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        toast.error("Không thể tải thông tin dự án");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // 2. Handle File Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'cover') {
        setProject({ ...project, coverImage: previewUrl });
      } else {
        setProject({ ...project, avatar: previewUrl });
      }
      toast.success(`Đã chọn ảnh ${type === 'cover' ? 'bìa' : 'đại diện'} mới`);
    }
  };

  // 3. Save
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

  // 4. Delete Member
  const confirmDeleteMember = async () => {
    try {
      const updatedMembers = project.members.filter((m: any) => m._id !== memberToDelete._id);
      // Cập nhật API luôn hoặc đợi bấm Save (ở đây tớ làm cập nhật luôn cho an toàn)
      // Nhưng để nhất quán với nút Invite bên dưới, tớ sẽ chỉ update Client State,
      // người dùng bấm "Lưu thay đổi" cuối cùng mới lưu DB.
      // Tuy nhiên với xóa thành viên thì nên làm ngay.
      await axios.put(`/api/projects/${projectId}`, { ...project, members: updatedMembers });

      setProject({ ...project, members: updatedMembers });
      toast.success(`Đã xóa ${memberToDelete.lastname} khỏi dự án`);
    } catch (err) {
      toast.error("Lỗi khi xóa thành viên");
    } finally {
      setMemberToDelete(null);
    }
  };

  // 5. Handle Add Member (Invite)
  const handleAddMember = (user: any) => {
    // Kiểm tra xem đã có trong dự án chưa
    const exists = project.members.find((m: any) => m._id === user._id);
    if (exists) {
      toast.warning("Thành viên này đã có trong dự án");
      return;
    }

    // Format dữ liệu member để khớp với cấu trúc trong Project
    // Lưu ý: Tùy vào backend cậu lưu object hay chỉ lưu ID.
    // Ở đây tớ giả sử backend populate ra object, nên frontend push object vào.
    const newMember = {
      _id: user._id,
      name: `${user.lastname} ${user.firstname}`, // Ghép tên
      avatar: user.avatar,
      email: user.email
    };

    setProject({ ...project, members: [...project.members, newMember] });
    toast.success(`Đã thêm ${user.lastname} vào danh sách. Nhớ bấm Lưu nhé!`);
  };

  // Lọc danh sách user để mời (Loại bỏ những người đã có trong dự án)
  const availableUsers = MOCK_SYSTEM_USERS.filter(u => {
    const fullName = `${u.lastname} ${u.firstname}`.toLowerCase();
    const email = u.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    const isMember = project?.members?.some((m: any) => m._id === u._id); // Check ID

    return !isMember && (fullName.includes(search) || email.includes(search));
  });


  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Class Scrollbar
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
    // FIX LAYOUT: Dùng absolute inset-4 để nó nằm gọn trong container cha, bất chấp cha cao bao nhiêu
    <div className="absolute inset-4 flex flex-col bg-[#050505] text-white overflow-hidden rounded-xl border border-white/5 shadow-2xl">

      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hidden Inputs */}
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />

      {/* 1. HEADER */}
      <div className="flex-none flex items-center h-14 px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-zinc-400 hover:text-white h-8 hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" /> <span className="text-xs font-medium">Quay lại</span>
          </Button>
          <div className="h-4 w-[1px] bg-white/10 mx-4" />
          <h1 className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">Cài đặt dự án</h1>
        </div>

        {/* Nút Save Global (Luôn hiển thị để tiện bấm) */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 px-4 rounded-lg shadow-lg transition-all gap-2 text-[10px] font-bold uppercase tracking-wide"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          Lưu thay đổi
        </Button>
      </div>

      {/* 2. BODY CONTAINER */}
      <div className="flex flex-1 overflow-hidden z-10">

        {/* SIDEBAR */}
        <div className="flex-none w-64 border-r border-white/5 p-4 space-y-2 bg-black/20 backdrop-blur-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-3 mt-2">Menu</p>
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'general' ? 'bg-white/5 text-indigo-400 border border-white/5 shadow-inner' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
            }`}
          >
            <Settings2 className="h-4 w-4" /> Chung
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'members' ? 'bg-white/5 text-purple-400 border border-white/5 shadow-inner' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
            }`}
          >
            <Users className="h-4 w-4" /> Thành viên
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">

          <div className={`flex-1 ${scrollbarStyles} p-8 md:p-12`}>

            {/* --- TAB: GENERAL --- */}
            {activeTab === 'general' && (
              <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500 slide-in-from-bottom-4">
                <Card className="bg-[#09090b]/80 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden h-fit">

                  {/* Cover Image Area */}
                  <div className="relative h-48 w-full group border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                      src={project?.coverImage || "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Cover"
                    />
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-4 w-4" />
                    </button>

                    <div className="absolute -bottom-10 left-8 flex items-end gap-5 z-20">
                      <div
                        className="relative h-20 w-20 rounded-2xl bg-[#121214] flex items-center justify-center shadow-2xl border border-white/20 group/avatar cursor-pointer overflow-hidden ring-4 ring-[#09090b]"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        {project?.avatar ? (
                          <img src={project.avatar} className="w-full h-full object-cover" alt="Avatar"/>
                        ) : (
                          <span className="text-3xl">🚀</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="mb-12">
                        <h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight">{project?.title || 'Dự án mới'}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  <CardContent className="pt-14 pb-8 px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Tên dự án</label>
                        <Input
                          value={project?.title || ''}
                          onChange={(e) => setProject({...project, title: e.target.value})}
                          className="bg-white/[0.03] border-white/10 focus:border-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <KeyRound className="h-3 w-3" /> Mã (Key)
                        </label>
                        <Input
                          value={project?.key || ''}
                          disabled
                          className="bg-white/[0.02] border-white/5 text-zinc-400 font-mono tracking-wider cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Mô tả</label>
                      <Textarea
                        className="min-h-[100px] bg-white/[0.03] border-white/10 focus:border-indigo-500/50 resize-none"
                        value={project?.description || ''}
                        onChange={(e) => setProject({...project, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                          <Fingerprint className="h-3 w-3" /> Database ID
                        </label>
                        <div className="text-xs font-mono text-zinc-500 bg-white/[0.02] p-2.5 rounded-md border border-white/5 truncate">
                          {project?._id || 'Loading...'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                          <Globe className="h-3 w-3" /> Trạng thái
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-6">Active</Badge>
                          <span className="text-[10px] text-zinc-600 italic">Dự án đang hoạt động</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

                  {/* --- DIALOG MỜI THÀNH VIÊN --- */}
                  <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-black hover:bg-zinc-200 px-6 font-bold rounded-xl transition-all h-10 text-xs uppercase tracking-wide gap-2">
                        <UserPlus className="h-4 w-4" /> Mời nhân sự mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0c0c0c] border border-white/10 text-white sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Mời thành viên</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                          Tìm kiếm và thêm nhân sự vào dự án <strong>{project?.title}</strong>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        {/* Ô tìm kiếm */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                          <Input
                            placeholder="Tìm theo tên hoặc email..."
                            className="pl-9 bg-white/5 border-white/10 focus:border-indigo-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        {/* Danh sách kết quả */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {availableUsers.length > 0 ? (
                            availableUsers.map((user) => (
                              <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarFallback className="bg-indigo-600 text-[10px] font-bold">
                                      {user.lastname[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-zinc-200">{user.lastname} {user.firstname}</span>
                                    <span className="text-[10px] text-zinc-500">{user.email}</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="h-7 bg-white/10 hover:bg-indigo-600 hover:text-white text-zinc-300 border border-white/5 transition-all"
                                  onClick={() => handleAddMember(user)}
                                >
                                  Thêm +
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-zinc-500 text-sm">
                              {searchTerm ? "Không tìm thấy kết quả nào." : "Nhập tên để tìm kiếm..."}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-md">
                  <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-white/[0.03] text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-4 text-left font-black">Nhân sự</th>
                      <th className="px-6 py-4 text-left font-black">Vai trò</th>
                      <th className="px-6 py-4 text-right font-black px-10">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {project?.members?.map((member: any, i: number) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-white/10 group-hover:border-indigo-500/30 transition-all">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-400">
                                {member.name ? member.name.substring(0, 2).toUpperCase() : "??"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-zinc-300 group-hover:text-indigo-300 transition-colors">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-white/5 text-zinc-400 hover:bg-white/10 text-[10px] font-mono">MEMBER</Badge>
                        </td>
                        <td className="px-6 py-4 text-right px-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
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
      </div>

      {/* ALERT DIALOG DELETE */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 uppercase font-black italic">Cảnh báo hệ thống!</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bạn chắc chắn muốn xóa <span className="text-white font-bold">{memberToDelete?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-white/5 hover:bg-zinc-800">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember} className="bg-red-600 hover:bg-red-500">Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}