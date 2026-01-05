'use client';

import React, { useState } from 'react';
import {
  Briefcase, Users, Plus, Trash2, KeyRound, UserPlus, Save, Loader2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (member: Member) => void;
}

export function ProjectCreateDialog({ open, onOpenChange }: ProjectCreateDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [description, setDescription] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'vana@batek.vn', avatar: 'https://github.com/shadcn.png' },
  ]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProjectName(val);
    const autoKey = val.split(' ').map(w => w[0]).join('').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (!projectKey || projectKey.length < autoKey.length) {
      setProjectKey(autoKey);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: Member = {
      id: Math.random().toString(),
      name: newMemberName,
      email: `${newMemberName.toLowerCase().replace(/\s/g, '')}@batek.vn`,
      avatar: '',
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
  };

  const handleSave = () => {
    if (!projectName) return toast.error("Vui lòng nhập tên dự án");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Đã tạo dự án mới");
      onOpenChange(false);
      setProjectName(''); setProjectKey(''); setDescription('');
    }, 1000);
  };

  // [CẬP NHẬT MỚI]: Đổi sang bg-[#050505] (Đen gần như tuyệt đối) để chìm vào nền
  const glassInput = "bg-[#050505] border-white/10 text-white focus-visible:ring-indigo-500/50 placeholder:text-zinc-600 hover:border-white/20 transition-colors";

  // Card giữ nguyên độ trong suốt rất thấp
  const glassCard = "bg-white/[0.03] border-white/10 shadow-none h-full";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-[95vw] h-auto max-h-[90vh] bg-black border-white/10 p-0 flex flex-col gap-0 outline-none [&>button]:hidden overflow-hidden rounded-xl">

        {/* HEADER */}
        <DialogHeader className="p-5 bg-black shrink-0 flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-white">Tạo Dự Án Mới</DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              Khởi tạo không gian làm việc mới cho đội nhóm.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 bg-black p-6 pt-2 overflow-y-auto">
          <div className="grid gap-6 lg:grid-cols-12 h-full">

            {/* CỘT TRÁI */}
            <div className="lg:col-span-8 h-full">
              <Card className={glassCard}>
                <CardHeader className="border-b border-white/5 py-3 px-5">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-400"><Briefcase className="h-4 w-4" /></div>
                    Thông tin chung
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-5 px-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 space-y-1.5">
                      <Label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Tên dự án <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Nhập tên dự án..."
                        className={cn(glassInput, "h-10 text-sm px-3")}
                        value={projectName}
                        onChange={handleNameChange}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <Label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <KeyRound className="h-3 w-3 text-orange-500" /> Mã Key
                      </Label>
                      <Input
                        placeholder="KEY"
                        className={cn(glassInput, "h-10 text-sm font-mono font-bold text-center text-indigo-400 uppercase tracking-widest")}
                        value={projectKey}
                        onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Mô tả chi tiết</Label>
                    <Textarea
                      placeholder="Mô tả mục tiêu, phạm vi dự án..."
                      className={cn(glassInput, "min-h-[140px] resize-none text-sm p-3 leading-relaxed")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CỘT PHẢI */}
            <div className="lg:col-span-4 h-full">
              <Card className={cn(glassCard, "flex flex-col")}>
                <CardHeader className="border-b border-white/5 py-3 px-5">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <div className="p-1.5 rounded-md bg-green-500/20 text-green-400"><Users className="h-4 w-4" /></div>
                    Thành viên <span className="text-zinc-500 text-xs ml-auto font-normal">({members.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3 pt-4 px-4 pb-4 overflow-hidden">

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <UserPlus className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="Thêm thành viên..."
                        className={cn(glassInput, "pl-9 h-10 text-sm")}
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                      />
                    </div>
                    <Button size="icon" onClick={handleAddMember} className="shrink-0 h-10 w-10 bg-green-600 hover:bg-green-500"><Plus className="h-4 w-4" /></Button>
                  </div>

                  <div className="flex-1 rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden relative min-h-[150px]">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                      <Table>
                        <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                          <TableRow className="border-white/5 hover:bg-transparent h-8">
                            <TableHead className="text-zinc-500 text-[10px] uppercase font-bold pl-3 h-8">Thành viên</TableHead>
                            <TableHead className="w-8 h-8"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((m) => (
                            <TableRow key={m.id} className="border-white/5 hover:bg-white/5 group h-10">
                              <TableCell className="py-1.5 pl-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6 border border-white/10">
                                    <AvatarImage src={m.avatar} />
                                    <AvatarFallback className="bg-indigo-900 text-indigo-300 text-[10px] font-bold">{m.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-zinc-200 truncate leading-none">{m.name}</p>
                                    <p className="text-[9px] text-zinc-500 truncate leading-tight mt-0.5">{m.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="pr-1 text-right">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-black flex justify-end gap-3 shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-10 px-6 text-zinc-400 hover:text-white hover:bg-white/10 text-sm">Hủy bỏ</Button>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="h-10 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 font-bold text-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Lưu Dự Án</>}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}