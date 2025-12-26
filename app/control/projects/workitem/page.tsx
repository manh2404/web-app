'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// 1. Chỉ import những Icon thực sự hiển thị trong code
import {
  CircleDashed, Circle, Clock, CheckCircle2, XCircle, Plus,
  MoreHorizontal, Calendar as CalendarIcon, AlertTriangle,
  User, X, Maximize2, Link as LinkIcon, History,
  Check, Tag, Timer, ShieldAlert, MousePointer2, SignalHigh, SignalMedium, SignalLow, Triangle,
} from 'lucide-react';

// 2. Import các UI Components - Chú ý dấu { } cho Card
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

// --- 1. CONFIG DỮ LIỆU ---
const statuses = [
  { value: 'backlog', label: 'Backlog', icon: CircleDashed, color: 'text-slate-400' },
  { value: 'todo', label: 'Todo', icon: Circle, color: 'text-blue-400' },
  { value: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-yellow-400' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: 'text-green-400' },
  { value: 'canceled', label: 'Canceled', icon: XCircle, color: 'text-red-400' },
];

const priorities = [
  { value: 'urgent', label: 'Urgent', icon: ShieldAlert, color: 'text-red-500' },
  { value: 'high', label: 'High', icon: SignalHigh, color: 'text-orange-500' },
  { value: 'medium', label: 'Medium', icon: SignalMedium, color: 'text-yellow-500' },
  { value: 'low', label: 'Low', icon: SignalLow, color: 'text-blue-500' },
  { value: 'none', label: 'None', icon: X, color: 'text-zinc-500' },
];

const estimates = ['1h', '2h', '3h', '4h', '5h 30m', '8h', 'Không có ước tính'];

// --- 2. COMPONENT PROPERTY ROW ---
const PropertyRow = ({ icon: Icon, label, children }: any) => (
  <div className="flex items-center py-2 group hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
    <div className="w-[140px] flex items-center text-muted-foreground text-sm font-medium">
      <Icon className="h-4 w-4 mr-2.5 opacity-60 text-indigo-400" />
      {label}
    </div>
    <div className="flex-1 flex items-center text-sm">{children}</div>
  </div>
);

// --- 3. COMPONENT CHI TIẾT TASK ---
const TaskDetailPanel = ({ task, onClose }: { task: any, onClose: () => void }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  if (!task) return null;

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5 shrink-0">
        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono tracking-tighter">
          {task.taskId}
        </Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"><LinkIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {/* Task Title (Ảnh 7) */}
        <h2 className="text-2xl font-bold mb-8 text-white leading-tight tracking-tight">{task.title}</h2>

        <div className="space-y-1 bg-white/[0.02] p-4 rounded-2xl border border-white/5 mb-8">

          {/* TRẠNG THÁI (Ảnh 2) */}
          <PropertyRow icon={MousePointer2} label="Trạng thái">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-white/10 text-white/80 gap-2 font-medium">
                  {(() => {
                    const s = statuses.find(st => st.value === task.status) || statuses[0];
                    return <><s.icon className={cn("h-4 w-4", s.color)} /> {s.label}</>;
                  })()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0 bg-[#0c0c0c] border-white/10 shadow-2xl backdrop-blur-xl" align="start">
                <Command className="bg-transparent text-white">
                  <CommandList>
                    <CommandGroup>
                      {statuses.map((s) => (
                        <CommandItem key={s.value} className="py-2.5 px-3 hover:bg-white/5 cursor-pointer flex justify-between rounded-lg mx-1 my-0.5 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <s.icon className={cn("h-4 w-4", s.color)} />
                            <span className="font-medium">{s.label}</span>
                          </div>
                          {task.status === s.value && <Check className="h-4 w-4 text-indigo-400" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </PropertyRow>

          {/* ƯU TIÊN (Ảnh 3) */}
          <PropertyRow icon={ShieldAlert} label="Ưu tiên">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-white/10 text-white/80 gap-2 font-medium">
                  <SignalHigh className="h-4 w-4 text-orange-500" /> High
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0 bg-[#0c0c0c] border-white/10 text-white shadow-2xl" align="start">
                <Command className="bg-transparent">
                  <CommandList>
                    {priorities.map((p) => (
                      <CommandItem key={p.value} className="gap-2.5 py-2.5 px-3 cursor-pointer hover:bg-white/5 rounded-lg mx-1 my-0.5">
                        <div className={cn("p-1 rounded bg-white/5", p.color)}>
                          <p.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{p.label}</span>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </PropertyRow>

          {/* NHÂN VIÊN (Ảnh 4) */}
          <PropertyRow icon={User} label="Phụ trách">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border border-white/5">
                  <Avatar className="h-5 w-5 border border-white/10"><AvatarImage src="https://github.com/shadcn.png" /></Avatar>
                  <span className="text-white/80 text-xs font-medium tracking-tight">Manh Bui</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-[#0c0c0c] border-white/10 text-white shadow-2xl" align="start">
                <Command className="bg-transparent">
                  <CommandInput placeholder="Tìm kiếm thành viên..." className="h-10 border-none focus:ring-0" />
                  <CommandList>
                    <CommandEmpty className="py-6 text-center text-xs text-zinc-500 italic">Không tìm thấy nhân viên.</CommandEmpty>
                    <CommandGroup heading={<span className="text-[10px] px-2 font-bold text-zinc-600 uppercase">Thành viên dự án</span>}>
                      {['Manh Bui', 'Chiến Lý', 'Quân Nguyễn'].map((u) => (
                        <CommandItem key={u} className="gap-3 py-2.5 px-3 cursor-pointer rounded-lg mx-1">
                          <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-indigo-600 font-bold">{u[0]}</AvatarFallback></Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{u}</span>
                            <span className="text-[10px] text-zinc-500 font-mono lowercase">{u.replace(/\s/g, '').toLowerCase()}@batek.io</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </PropertyRow>

          {/* ƯỚC TÍNH (Ảnh 5) */}
          <PropertyRow icon={Timer} label="Ước tính">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 text-xs text-white/80 hover:bg-white/10 gap-2 font-medium">
                  <Triangle className="h-3 w-3 opacity-40 rotate-180 fill-current" /> 4h
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 bg-[#0c0c0c] border-white/10 text-white" align="start">
                <Command className="bg-transparent">
                  <CommandInput placeholder="Nhập nội dung tìm kiếm" className="h-10" />
                  <CommandList>
                    <CommandGroup>
                      {estimates.map((e) => (
                        <CommandItem key={e} className="gap-3 py-2.5 px-3 cursor-pointer hover:bg-white/5 rounded-lg mx-1 my-0.5">
                          <Triangle className="h-3 w-3 opacity-30 rotate-180" />
                          <span className="text-sm font-medium">{e}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </PropertyRow>

          {/* NHÃN (Ảnh 6) */}
          <PropertyRow icon={Tag} label="Nhãn">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 text-xs text-white/40 hover:text-indigo-400 hover:bg-indigo-500/5 border border-dashed border-white/5 hover:border-indigo-500/30">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Thêm nhãn
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2 bg-[#0c0c0c] border-white/10 text-white" align="start">
                <div className="flex flex-wrap gap-2">
                  {['UI/UX', 'Frontend', 'Core', 'Bug'].map(tag => (
                    <Badge key={tag} className="bg-white/5 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/30 cursor-pointer transition-colors text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </PropertyRow>
        </div>
      </div>
    </div>
  );
};