'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from "date-fns";

// Icons
import {
  CircleDashed, Circle, Clock, CheckCircle2, XCircle, Plus,
  User, X, Tag,
  Calendar as CalendarIcon, SignalHigh, SignalMedium, SignalLow, Ban,
  Box, Repeat, Triangle, ChevronRight, AlertCircle,
  LayoutGrid, ListOrdered,
  Bold, Italic, Underline, Paperclip, Code, Loader2
} from 'lucide-react';

// UI Components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

// --- CONFIG ---
const columns = {
  backlog: { id: 'backlog', title: 'Backlog', icon: CircleDashed, color: 'text-zinc-400' },
  todo: { id: 'todo', title: 'To Do', icon: Circle, color: 'text-blue-400' },
  in_progress: { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-orange-400' },
  done: { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
  canceled: { id: 'canceled', title: 'Canceled', icon: XCircle, color: 'text-rose-400' },
};

const prioritiesConfig = {
  Urgent: { label: 'Urgent', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  High: { label: 'High', icon: SignalHigh, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  Medium: { label: 'Medium', icon: SignalMedium, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  Low: { label: 'Low', icon: SignalLow, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  None: { label: 'None', icon: Ban, color: 'text-zinc-500', bg: 'bg-zinc-500/10' }
};

const mockActivities = [
  { id: 1, user: 'Hoàng Khiêm', action: 'created the work item', time: '1 day ago', type: 'create' },
  { id: 2, user: 'Hồng Nhung', action: 'changed status to In Progress', time: '5 hours ago', type: 'update' },
  { id: 3, user: 'Thị Tâm', action: 'added a comment', time: '2 hours ago', type: 'comment', content: 'Task này cần thêm thông tin về API nhé.' },
];

// --- COMPONENT CHI TIẾT TASK (BẢN FINAL FIX DATE + TITLE) ---
const TaskDetailPanel = ({ task, onClose, onUpdate }: { task: any, onClose: () => void, onUpdate: (newTask: any) => void }) => {

  const [comment, setComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!task) return null;

  const StatusIcon = columns[task.status as keyof typeof columns]?.icon || Circle;
  const PriorityConfig = prioritiesConfig[task.priority as keyof typeof prioritiesConfig] || prioritiesConfig.None;

  const updateField = (field: string, value: any) => {
    onUpdate({ ...task, [field]: value });
  };

  const handleFormat = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = comment;
    const selectedText = text.substring(start, end);
    let prefix = "", suffix = "";
    switch (type) {
      case 'bold': prefix = "**"; suffix = "**"; break;
      case 'italic': prefix = "*"; suffix = "*"; break;
      case 'underline': prefix = "<u>"; suffix = "</u>"; break;
      case 'code': prefix = "`"; suffix = "`"; break;
      default: return;
    }
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setComment(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText.length > 0 ? end + prefix.length : start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // --- STYLE UTILS ---
  const valueContainerClass = "group flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer h-9";
  const valueTextClass = "text-sm text-zinc-200 font-medium flex items-center gap-2";
  const selectResetClass = "!bg-transparent !border-none !shadow-none !outline-none !ring-0 focus:!ring-0 !p-0 !h-auto w-full [&>svg]:hidden";
  const chevronClass = "h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity";

  const AttributeRow = ({ icon: Icon, label, children }: any) => (
    <div className="flex items-center py-1">
      <div className="w-[150px] flex items-center text-zinc-500 text-sm gap-2 shrink-0">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[650px] z-[50] bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
          <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-zinc-300">{task.taskId || "ID-123"}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-500">Work Item</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"><X className="h-4 w-4" /></Button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-8">

          {/* 1. TITLE */}
          <div>
            <Input
              className="text-5xl font-bold bg-transparent border-none focus-visible:ring-0 p-4 text-white placeholder:text-zinc-600 h-auto w-full leading-tight"
              value={task.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          {/* 2. DESCRIPTION */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-zinc-400">Mô tả</div>
            <Textarea
              className="bg-transparent hover:bg-zinc-900 border border-transparent hover:border-white/10 min-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 text-zinc-300 text-sm leading-relaxed rounded-lg p-3 -ml-3 transition-all placeholder:text-zinc-600"
              placeholder="Thêm mô tả..."
              value={task.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <Separator className="bg-white/5" />

          {/* 3. PROPERTIES */}
          <div className="space-y-1">
            <div className="text-sm font-semibold text-zinc-400 mb-3">Thuộc tính</div>

            {/* Status */}
            <AttributeRow icon={LayoutGrid} label="Trạng thái">
              <div className={valueContainerClass}>
                <Select value={task.status} onValueChange={(val) => updateField('status', val)}>
                  <SelectTrigger className={selectResetClass}>
                    <div className={valueTextClass}>
                      <StatusIcon className={cn("h-4 w-4", columns[task.status as keyof typeof columns]?.color)} />
                      <span className="capitalize">{task.status?.replace('_', ' ')}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                    {Object.values(columns).map((col) => (
                      <SelectItem key={col.id} value={col.id}><div className="flex items-center gap-2"><col.icon className={cn("h-3.5 w-3.5", col.color)} /> {col.title}</div></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ChevronRight className={chevronClass} />
              </div>
            </AttributeRow>

            {/* Assignee */}
            <AttributeRow icon={User} label="Người phụ trách">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                    {task.assignee ? (
                      <div className={valueTextClass}>
                        <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] bg-indigo-600 text-white">{task.assignee.lastname?.[0]}</AvatarFallback></Avatar>
                        <span>{task.assignee.lastname} {task.assignee.firstname}</span>
                      </div>
                    ) : <span className="text-zinc-500 italic text-sm">Chưa gán người</span>}
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px] bg-[#18181b] border-white/10">
                  <Command className="bg-transparent"><CommandInput placeholder="Tìm thành viên..." className="h-9 border-none focus:ring-0 text-white" /><CommandList><CommandEmpty>...</CommandEmpty></CommandList></Command>
                </PopoverContent>
              </Popover>
            </AttributeRow>

            {/* Priority */}
            <AttributeRow icon={SignalMedium} label="Ưu tiên">
              <div className={valueContainerClass}>
                <Select value={task.priority} onValueChange={(val) => updateField('priority', val)}>
                  <SelectTrigger className={selectResetClass}>
                    <div className={valueTextClass}><PriorityConfig.icon className={cn("h-4 w-4", PriorityConfig.color)} /> {PriorityConfig.label}</div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                    {Object.entries(prioritiesConfig).map(([key, cfg]) => (<SelectItem key={key} value={key}><div className="flex items-center gap-2"><cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} /> {cfg.label}</div></SelectItem>))}
                  </SelectContent>
                </Select>
                <ChevronRight className={chevronClass} />
              </div>
            </AttributeRow>

            {/* Dates (ĐÃ SỬA: Chọn được ngày) */}
            <AttributeRow icon={CalendarIcon} label="Ngày bắt đầu">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                    {task.startDate ? <span className={valueTextClass}>{format(new Date(task.startDate), 'dd/MM/yyyy')}</span> : <span className="text-zinc-500 italic text-sm">Chọn ngày...</span>}
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10">
                  <Calendar
                    mode="single"
                    selected={task.startDate ? new Date(task.startDate) : undefined}
                    onSelect={(date) => updateField('startDate', date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </AttributeRow>
            <AttributeRow icon={CalendarIcon} label="Ngày kết thúc">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                    {task.endDate ? <span className={valueTextClass}>{format(new Date(task.endDate), 'dd/MM/yyyy')}</span> : <span className="text-zinc-500 italic text-sm">Chọn ngày...</span>}
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10">
                  <Calendar
                    mode="single"
                    selected={task.endDate ? new Date(task.endDate) : undefined}
                    onSelect={(date) => updateField('endDate', date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </AttributeRow>

            {/* Estimate */}
            <AttributeRow icon={Triangle} label="Ước tính">
              <div className={valueContainerClass}>
                <Select value={task.estimate || "None"} onValueChange={(val) => updateField('estimate', val)}>
                  <SelectTrigger className={selectResetClass}>
                    <span className={valueTextClass}>{task.estimate || "None"}</span>
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                    <SelectItem value="1h">1h</SelectItem><SelectItem value="4h">4h</SelectItem><SelectItem value="5h">5h</SelectItem>
                  </SelectContent>
                </Select>
                <ChevronRight className={chevronClass} />
              </div>
            </AttributeRow>

            {/* Module */}
            <AttributeRow icon={Box} label="Mô-đun">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                             <span className={task.module ? valueTextClass : "text-zinc-500 italic text-sm"}>
                                {task.module || "Chưa chọn mô-đun"}
                             </span>
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px] bg-[#18181b] border-white/10">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Tìm mô-đun..." className="h-9 border-none focus:ring-0 text-white"/>
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => updateField('module', 'Module Login')} className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Module Login</CommandItem>
                        <CommandItem onSelect={() => updateField('module', 'Module Payment')} className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Module Payment</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </AttributeRow>

            {/* Cycle */}
            <AttributeRow icon={Repeat} label="Chu kỳ">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                             <span className={task.cycle ? valueTextClass : "text-zinc-500 italic text-sm"}>
                                {task.cycle || "Chưa chọn chu kỳ"}
                             </span>
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px] bg-[#18181b] border-white/10">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Tìm chu kỳ..." className="h-9 border-none focus:ring-0 text-white"/>
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => updateField('cycle', 'Sprint 12')} className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Sprint 12</CommandItem>
                        <CommandItem onSelect={() => updateField('cycle', 'Sprint 13')} className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Sprint 13</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </AttributeRow>

            {/* Tags */}
            <AttributeRow icon={Tag} label="Nhãn">
              <Popover>
                <PopoverTrigger asChild>
                  <div className={valueContainerClass}>
                    {task.tags && task.tags.length > 0 ? (
                      <div className="flex gap-2">
                        {task.tags.map((tag: any, i: number) => <Badge key={i} variant="secondary" className="bg-white/10 text-zinc-300 border-0">{tag}</Badge>)}
                      </div>
                    ) : <span className="text-zinc-500 italic text-sm">+ Chọn nhãn</span>}
                    <ChevronRight className={chevronClass} />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px] bg-[#18181b] border-white/10"><Command className="bg-transparent"><CommandInput placeholder="Tìm nhãn..." className="h-9 border-none focus:ring-0 text-white"/><CommandList><CommandEmpty>...</CommandEmpty></CommandList></Command></PopoverContent>
              </Popover>
            </AttributeRow>
          </div>

          <Separator className="bg-white/5" />

          {/* Activity */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-400">Hoạt động</div>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500 hover:text-white"><ListOrdered className="h-3 w-3 mr-1"/> Mới nhất</Button>
            </div>

            <div className="space-y-6 pl-2 relative border-l border-white/10 ml-2">
              {mockActivities.map((act) => (
                <div key={act.id} className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-zinc-300">
                      <span className="font-bold text-white cursor-pointer hover:underline">{act.user}</span> <span className="text-zinc-500">{act.action}</span>
                    </div>
                    <div className="text-[10px] text-zinc-600">{act.time}</div>
                    {act.type === 'comment' && (
                      <div className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html: act.content || '' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div className="pt-4 pb-10">
              <div className="rounded-xl border border-white/10 bg-[#0c0c0e] overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <Textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Thêm bình luận..."
                  className="min-h-[80px] border-none bg-transparent resize-none focus-visible:ring-0 text-zinc-200 placeholder:text-zinc-600 p-4 font-sans"
                />

                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Tooltip><TooltipTrigger asChild><Button onClick={() => handleFormat('bold')} variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10"><Bold className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>In đậm</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button onClick={() => handleFormat('italic')} variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10"><Italic className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>In nghiêng</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button onClick={() => handleFormat('underline')} variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10"><Underline className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>Gạch chân</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button onClick={() => handleFormat('code')} variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10"><Code className="h-3.5 w-3.5"/></Button></TooltipTrigger><TooltipContent>Code</TooltipContent></Tooltip>
                    <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <Tooltip><TooltipTrigger asChild><Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10"><Paperclip className="h-3.5 w-3.5"/><input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if(file) toast.success(`Đã chọn: ${file.name}`); }}/></Button></TooltipTrigger><TooltipContent>Đính kèm tệp</TooltipContent></Tooltip>
                  </div>
                  <Button disabled={!comment.trim()} size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3" onClick={() => { toast.success("Đã gửi bình luận!"); setComment(""); }}>Bình luận</Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorkItemsPage() {
  const params = useParams();
  const projectId = params?.id;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/workitems`);
      setTasks(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };
  useEffect(() => { if (projectId) fetchTasks(); }, [projectId]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
    if (taskIndex > -1) {
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: destination.droppableId };
      setTasks(updatedTasks);
    }
    try { await axios.put(`/api/workitems/${draggableId}`, { status: destination.droppableId }); } catch (error) { toast.error("Cập nhật thất bại"); fetchTasks(); }
  };

  const handleUpdateTask = (newTask: any) => {
    const updatedTasks = tasks.map(t => t._id === newTask._id ? newTask : t);
    setTasks(updatedTasks);
    setSelectedTask(newTask);
    axios.put(`/api/workitems/${newTask._id}`, newTask).catch(() => {
      toast.error("Lỗi cập nhật");
      fetchTasks();
    });
  };

  const openCreateDialog = (status = "todo") => { setNewTaskStatus(status); setNewTaskTitle(""); setNewTaskDescription(""); setIsCreateOpen(true); };
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await axios.post(`/api/projects/${projectId}/workitems`, { title: newTaskTitle, priority: 'Medium', status: newTaskStatus, description: newTaskDescription });
      setTasks([res.data, ...tasks]);
      setIsCreateOpen(false);
      toast.success("Tạo công việc thành công");
    } catch (error) { toast.error("Lỗi khi tạo công việc"); }
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);
  const iconBadgeClass = "h-7 w-7 flex items-center justify-center rounded-md border border-white/5 bg-zinc-800/50 text-zinc-500 hover:bg-white/10 hover:text-zinc-300 transition-all cursor-pointer";

  const TooltipWrapper = ({ label, value, children }: any) => (
    <Tooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent className="bg-zinc-900 border-white/10 text-white text-xs py-1.5 px-3 z-50 shadow-xl"><p className="font-bold text-zinc-400 mb-0.5">{label}</p><p className="font-medium">{value}</p></TooltipContent></Tooltip>
  );

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-500 text-sm font-mono">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col h-full w-full overflow-hidden relative bg-[#020617] font-sans selection:bg-indigo-500/30">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80" />

        <div className="flex-none h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#020617]/50 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2"><span className="text-indigo-400">❖</span> Board View</h1>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/5 font-mono text-xs px-2.5">{tasks.length} Tasks</Badge>
          </div>
          <Button size="sm" onClick={() => openCreateDialog('todo')} className="bg-white text-black hover:bg-zinc-200 text-xs font-bold h-9 px-4 rounded-lg"><Plus className="h-3.5 w-3.5 mr-2" /> New Task</Button>
        </div>

        <div className="flex-1 relative min-h-0 z-10">
          <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex h-full p-6 gap-6 w-max">
                {Object.values(columns).map((col) => (
                  <div key={col.id} className="flex-none w-[320px] flex flex-col h-full relative group/column">
                    <div className="absolute inset-0 bg-[#000000]/20 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl z-0" />
                    <div className="relative z-10 flex flex-col h-full rounded-2xl overflow-hidden">
                      <div className={cn("p-4 flex items-center justify-between border-b border-white/5 shrink-0 bg-gradient-to-b from-white/[0.05] to-transparent")}>
                        <div className="flex items-center gap-3">
                          <div className={cn("p-1.5 rounded-md bg-white/5 border border-white/5 shadow-sm", col.color)}><col.icon className="h-3.5 w-3.5" /></div>
                          <span className="font-bold text-sm text-zinc-200">{col.title}</span>
                          <Badge variant="secondary" className="bg-black/40 text-zinc-500 border-0 text-[10px] px-1.5">{getTasksByStatus(col.id).length}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => openCreateDialog(col.id)} className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg"><Plus className="h-3.5 w-3.5" /></Button>
                      </div>
                      <Droppable droppableId={col.id}>
                        {(provided, snapshot) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className={cn("flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors", snapshot.isDraggingOver ? "bg-indigo-500/[0.05]" : "bg-transparent")}>
                            {getTasksByStatus(col.id).map((task, index) => {
                              const PriorityConfig = prioritiesConfig[task.priority as keyof typeof prioritiesConfig] || prioritiesConfig.None;
                              const StatusIcon = columns[task.status as keyof typeof columns]?.icon || Circle;
                              return (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setSelectedTask(task)}
                                      style={{ ...provided.draggableProps.style }}
                                      className={cn(
                                        "group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                                        "bg-[#18181b]/80 backdrop-blur-md border-white/[0.05]",
                                        "hover:border-indigo-500/30 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] hover:bg-[#18181b]",
                                        snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500/50 rotate-2 z-50 bg-[#18181b] scale-105 opacity-100" : ""
                                      )}
                                    >
                                      <div className="text-[10px] font-mono text-zinc-500 font-medium">{task.taskId || "LHK-123"}</div>
                                      <div className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{task.title}</div>
                                      <div className="flex flex-wrap gap-2 items-center mt-2" onClick={(e) => e.stopPropagation()}>
                                        <Select defaultValue={task.status}>
                                          <TooltipWrapper label="Trạng thái" value={task.status}>
                                            <SelectTrigger className="h-7 w-auto px-2 gap-1.5 border border-white/5 bg-zinc-800/50 text-xs font-medium text-zinc-300 hover:bg-white/10 focus:ring-0 rounded-md [&>svg]:hidden">
                                              <div className="flex items-center gap-1.5"><StatusIcon className={cn("h-3.5 w-3.5", columns[task.status as keyof typeof columns]?.color)} /><span className="capitalize">{task.status?.replace('_', ' ')}</span></div>
                                            </SelectTrigger>
                                          </TooltipWrapper>
                                          <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]">{Object.values(columns).map((col) => (<SelectItem key={col.id} value={col.id}><div className="flex items-center gap-2"><col.icon className={cn("h-3.5 w-3.5", col.color)} /> {col.title}</div></SelectItem>))}</SelectContent>
                                        </Select>
                                        <Select defaultValue={task.priority}>
                                          <TooltipWrapper label="Ưu tiên" value={PriorityConfig.label}>
                                            <SelectTrigger className={cn(iconBadgeClass, "w-7 h-7 px-0 border-none focus:ring-0 [&>svg]:hidden", PriorityConfig.color !== 'text-zinc-500' && "bg-transparent")}>
                                              <div className={cn("flex items-center justify-center h-full w-full rounded-md border border-white/5", PriorityConfig.bg)}><PriorityConfig.icon className={cn("h-3.5 w-3.5", PriorityConfig.color)} /></div>
                                            </SelectTrigger>
                                          </TooltipWrapper>
                                          <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]">{Object.entries(prioritiesConfig).map(([key, cfg]) => (<SelectItem key={key} value={key}><div className="flex items-center gap-2"><cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} /> {cfg.label}</div></SelectItem>))}</SelectContent>
                                        </Select>
                                        <Popover><TooltipWrapper label="Ngày bắt đầu" value={task.startDate ? format(new Date(task.startDate), 'dd/MM/yyyy') : "Chưa đặt"}><PopoverTrigger asChild><div className={iconBadgeClass}><CalendarIcon className="h-3.5 w-3.5" /></div></PopoverTrigger></TooltipWrapper><PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10"><Calendar mode="single" /></PopoverContent></Popover>
                                        <Popover><TooltipWrapper label="Ngày kết thúc" value={task.endDate ? format(new Date(task.endDate), 'dd/MM/yyyy') : "Chưa đặt"}><PopoverTrigger asChild><div className={iconBadgeClass}><CalendarIcon className="h-3.5 w-3.5 stroke-[1.5]" /></div></PopoverTrigger></TooltipWrapper><PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10"><Calendar mode="single" /></PopoverContent></Popover>
                                        <Popover><TooltipWrapper label="Người thực hiện" value={task.assignee?.lastname || "Chưa gán"}><PopoverTrigger asChild>{task.assignee ? (<Avatar className="h-7 w-7 border border-white/10 rounded-md cursor-pointer hover:opacity-80"><AvatarFallback className="text-[9px] bg-indigo-600 text-white font-bold">{task.assignee.lastname?.[0]}</AvatarFallback></Avatar>) : (<div className={iconBadgeClass}><User className="h-3.5 w-3.5" /></div>)}</PopoverTrigger></TooltipWrapper><PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10"><Command className="bg-transparent"><CommandInput placeholder="Tìm thành viên..." className="h-9 border-none focus:ring-0 text-white" /><CommandList><CommandEmpty>...</CommandEmpty></CommandList></Command></PopoverContent></Popover>
                                        <Popover><TooltipWrapper label="Module" value={task.module || "None"}><PopoverTrigger asChild><div className={iconBadgeClass}><Box className="h-3.5 w-3.5" /></div></PopoverTrigger></TooltipWrapper><PopoverContent className="p-0 w-[200px] bg-[#18181b] border-white/10"><Command><CommandInput placeholder="Tìm module..."/></Command></PopoverContent></Popover>
                                        <Popover><TooltipWrapper label="Chu kỳ" value={task.cycle || "None"}><PopoverTrigger asChild><div className={iconBadgeClass}><Repeat className="h-3.5 w-3.5" /></div></PopoverTrigger></TooltipWrapper><PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10"><Command><CommandInput placeholder="Tìm chu kỳ..."/></Command></PopoverContent></Popover>
                                        <Select defaultValue={task.estimate || "4h"}><TooltipWrapper label="Ước tính" value={task.estimate || "4h"}><SelectTrigger className={cn(iconBadgeClass, "p-0 focus:ring-0 [&>svg]:hidden text-amber-500/90 hover:text-amber-400")}><div className="flex items-center justify-center w-full h-full"><Triangle className="h-3.5 w-3.5" /></div></SelectTrigger></TooltipWrapper><SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]"><SelectItem value="1h">1h</SelectItem><SelectItem value="4h">4h</SelectItem><SelectItem value="5h">5h</SelectItem></SelectContent></Select>
                                        <Popover><TooltipWrapper label="Nhãn" value={task.tags?.length > 0 ? `${task.tags.length} nhãn` : "None"}><PopoverTrigger asChild><div className={iconBadgeClass}><Tag className="h-3.5 w-3.5" /></div></PopoverTrigger></TooltipWrapper><PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10"><Command className="bg-transparent"><CommandInput placeholder="Tìm nhãn..." className="h-9 border-none focus:ring-0 text-white" /><CommandList><CommandEmpty className="py-2 text-center text-xs text-zinc-500">Không tìm thấy.</CommandEmpty><CommandGroup><CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"/> Bug</CommandItem><CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500"/> Feature</CommandItem></CommandGroup></CommandList></Command></PopoverContent></Popover>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-[#0c0c0c]/80 backdrop-blur-xl border-2 border-white/10 text-white sm:max-w-[500px] shadow-2xl p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]"><DialogTitle className="text-lg font-bold flex items-center gap-2">Thêm công việc</DialogTitle></DialogHeader>
            <div className="p-6 space-y-5"><Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="bg-zinc-900/50 border-2 border-zinc-800 text-base py-5" placeholder="Tên công việc..." /></div>
            <DialogFooter className="p-4 bg-zinc-900/30 border-t border-white/5"><Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Hủy</Button><Button onClick={handleCreateTask} className="bg-indigo-600">Xác nhận</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pass hàm onUpdate cho TaskDetailPanel */}
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
          />
        )}
      </div>
    </TooltipProvider>
  );
}