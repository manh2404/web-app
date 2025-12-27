'use client';

import React, { useState, useEffect } from 'react';
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
  Box, Repeat, Triangle, ChevronRight, AlertCircle
} from 'lucide-react';

// UI Components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// 1. IMPORT TOOLTIP
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

// --- CONFIG MÀU SẮC ---
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

// --- COMPONENT CHI TIẾT TASK ---
const TaskDetailPanel = ({ task, onClose }: { task: any, onClose: () => void }) => {
  const [priority, setPriority] = useState(task?.priority || "None");
  const [status, setStatus] = useState(task?.status || "todo");

  if (!task) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[500px] z-[50] bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
          <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{task.taskId}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-500">Work Item</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10 rounded-full"><X className="h-4 w-4 text-zinc-400" /></Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <div>
          <Input className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-white placeholder:text-zinc-600" defaultValue={task.title} />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mô tả</div>
          <Textarea className="bg-white/[0.02] border-white/5 min-h-[100px] resize-none focus-visible:ring-indigo-500/50 text-zinc-300" placeholder="Thêm mô tả chi tiết..." defaultValue={task.description} />
        </div>
        <div className="pt-4 border-t border-white/5 text-zinc-500 text-sm italic text-center">
          (Các thuộc tính chi tiết hiển thị ở ngoài Card để thao tác nhanh)
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
  const [project, setProject] = useState<any>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");

  // --- API CALLS (Giữ nguyên logic của cậu) ---
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/workitems`);
      setTasks(res.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách công việc");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}`);
      setProject(res.data);
    } catch (error) {
      // toast.error("Không thể tải thông tin dự án");
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchProject();
    }
  }, [projectId]);

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

    try {
      await axios.put(`/api/workitems/${draggableId}`, { status: destination.droppableId });
    } catch (error) {
      toast.error("Cập nhật thất bại");
      fetchTasks();
    }
  };

  const openCreateDialog = (status = "todo") => { setNewTaskStatus(status); setNewTaskTitle(""); setNewTaskDescription(""); setIsCreateOpen(true); };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await axios.post(`/api/projects/${projectId}/workitems`, {
        title: newTaskTitle,
        priority: 'Medium',
        status: newTaskStatus,
        description: newTaskDescription
      });
      setTasks([res.data, ...tasks]);
      setIsCreateOpen(false);
      toast.success("Tạo công việc thành công");
    } catch (error) {
      toast.error("Lỗi khi tạo công việc");
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  // Style chung cho các nút Badge icon vuông
  const iconBadgeClass = "h-7 w-7 flex items-center justify-center rounded-md border border-white/5 bg-zinc-800/50 text-zinc-500 hover:bg-white/10 hover:text-zinc-300 transition-all cursor-pointer";

  // 2. HELPER TOOLTIP: Để code gọn gàng hơn
  const TooltipWrapper = ({ label, value, children }: any) => (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="bg-zinc-900 border-white/10 text-white text-xs py-1.5 px-3 z-50 shadow-xl">
        <p className="font-bold text-zinc-400 mb-0.5">{label}</p>
        <p className="font-medium">{value}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col h-full w-full max-w-full bg-[#020617] overflow-hidden relative font-sans selection:bg-indigo-500/30">

        {/* Background & Header (Giữ nguyên) */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80" />
        <div className="flex-none h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2"><span className="text-indigo-400">❖</span> Board View</h1>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/5 font-mono text-xs px-2.5">{tasks.length} Tasks</Badge>
          </div>
          <Button size="sm" onClick={() => openCreateDialog('todo')} className="bg-white text-black hover:bg-zinc-200 text-xs font-bold h-9 px-4 rounded-lg"><Plus className="h-3.5 w-3.5 mr-2" /> New Task</Button>
        </div>

        {/* BOARD AREA */}
        <div className="flex-1 w-full h-full min-w-0 min-h-0 overflow-x-auto overflow-y-hidden z-10">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full p-8 gap-6">
              {Object.values(columns).map((col) => (
                <div key={col.id} className="flex-none w-[320px] flex flex-col h-full relative group/column">
                  <div className="absolute inset-0 bg-[#000000]/20 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl z-0" />
                  <div className="relative z-10 flex flex-col h-full rounded-2xl overflow-hidden">

                    {/* Column Header */}
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
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn("flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors", snapshot.isDraggingOver ? "bg-indigo-500/[0.05]" : "bg-transparent")}
                        >
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
                                    <div className="text-[10px] font-mono text-zinc-500 font-medium">
                                      {task.taskId || "No-ID"}
                                    </div>
                                    <div className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{task.title}</div>

                                    {/* --- VÙNG THUỘC TÍNH --- */}
                                    <div className="flex flex-wrap gap-2 items-center mt-2" onClick={(e) => e.stopPropagation()}>
                                      <Select defaultValue={task.status}>
                                        <TooltipWrapper label="Trạng thái" value={task.status}>
                                          <SelectTrigger className="h-7 w-auto px-2 gap-1.5 border border-white/5 bg-zinc-800/50 text-xs font-medium text-zinc-300 hover:bg-white/10 focus:ring-0 rounded-md [&>svg]:hidden">
                                            <div className="flex items-center gap-1.5"><StatusIcon className={cn("h-3.5 w-3.5", columns[task.status as keyof typeof columns]?.color)} /><span className="capitalize">{task.status?.replace('_', ' ')}</span></div>
                                          </SelectTrigger>
                                        </TooltipWrapper>
                                        <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]">
                                          {Object.values(columns).map((col) => (<SelectItem key={col.id} value={col.id}><div className="flex items-center gap-2"><col.icon className={cn("h-3.5 w-3.5", col.color)} /> {col.title}</div></SelectItem>))}
                                        </SelectContent>
                                      </Select>

                                      <Select defaultValue={task.priority}>
                                        <TooltipWrapper label="Ưu tiên" value={PriorityConfig.label}>
                                          <SelectTrigger className={cn(iconBadgeClass, "w-7 h-7 px-0 border-none focus:ring-0 [&>svg]:hidden", PriorityConfig.color !== 'text-zinc-500' && "bg-transparent")}>
                                            <div className={cn("flex items-center justify-center h-full w-full rounded-md border border-white/5", PriorityConfig.bg)}><PriorityConfig.icon className={cn("h-3.5 w-3.5", PriorityConfig.color)} /></div>
                                          </SelectTrigger>
                                        </TooltipWrapper>
                                        <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]">
                                          {Object.entries(prioritiesConfig).map(([key, cfg]) => (<SelectItem key={key} value={key}><div className="flex items-center gap-2"><cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} /> {cfg.label}</div></SelectItem>))}
                                        </SelectContent>
                                      </Select>

                                      <Popover>
                                        <TooltipWrapper label="Ngày bắt đầu" value={task.startDate ? format(new Date(task.startDate), 'dd/MM/yyyy') : "Chưa đặt"}>
                                          <PopoverTrigger asChild><div className={iconBadgeClass}><CalendarIcon className="h-3.5 w-3.5" /></div></PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10"><Calendar mode="single" /></PopoverContent>
                                      </Popover>

                                      <Popover>
                                        <TooltipWrapper label="Ngày kết thúc" value={task.endDate ? format(new Date(task.endDate), 'dd/MM/yyyy') : "Chưa đặt"}>
                                          <PopoverTrigger asChild><div className={iconBadgeClass}><CalendarIcon className="h-3.5 w-3.5 stroke-[1.5]" /></div></PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10"><Calendar mode="single" /></PopoverContent>
                                      </Popover>

                                      <Popover>
                                        <TooltipWrapper label="Người phụ trách" value={task.assignee ? `${task.assignee.lastname}` : ""}>
                                          <PopoverTrigger asChild>
                                            {task.assignee ? (<Avatar className="h-7 w-7 border border-white/10 rounded-md cursor-pointer hover:opacity-80"><AvatarFallback className="text-[9px] bg-indigo-600 text-white font-bold">{task.assignee.lastname?.[0]}</AvatarFallback></Avatar>) : (<div className={iconBadgeClass}><User className="h-3.5 w-3.5" /></div>)}
                                          </PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10"><Command className="bg-transparent"><CommandInput placeholder="Tìm thành viên..." className="h-9 border-none focus:ring-0" /><CommandList><CommandEmpty>...</CommandEmpty></CommandList></Command></PopoverContent>
                                      </Popover>


                                      {/* 6. MODULE */}
                                      <Popover>
                                        <TooltipWrapper label="Module" value={task.module || "None"}>
                                          <PopoverTrigger asChild><div className={iconBadgeClass}><Box className="h-3.5 w-3.5" /></div></PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10">
                                          <Command className="bg-transparent">
                                            <CommandInput placeholder="Tìm module..." className="h-9 border-none focus:ring-0 text-white" />
                                            <CommandList>
                                              <CommandEmpty className="py-2 text-center text-xs text-zinc-500">Không tìm thấy.</CommandEmpty>
                                              <CommandGroup>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Module Login</CommandItem>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Module Payment</CommandItem>
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>

                                      {/* 7. CYCLE */}
                                      <Popover>
                                        <TooltipWrapper label="Chu kỳ" value={task.cycle || "None"}>
                                          <PopoverTrigger asChild><div className={iconBadgeClass}><Repeat className="h-3.5 w-3.5" /></div></PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10">
                                          <Command className="bg-transparent">
                                            <CommandInput placeholder="Tìm chu kỳ..." className="h-9 border-none focus:ring-0 text-white" />
                                            <CommandList>
                                              <CommandEmpty className="py-2 text-center text-xs text-zinc-500">Không tìm thấy.</CommandEmpty>
                                              <CommandGroup>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Sprint 12</CommandItem>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1">Sprint 13</CommandItem>
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>

                                      {/* 8. ESTIMATE */}
                                      <Select defaultValue={task.estimate || "None"}>
                                        <TooltipWrapper label="Ước tính" value={task.estimate || "None"}>
                                          <SelectTrigger className={cn(iconBadgeClass, "p-0 focus:ring-0 [&>svg]:hidden text-amber-500/90 hover:text-amber-400")}>
                                            <div className="flex items-center justify-center w-full h-full"><Triangle className="h-3.5 w-3.5" /></div>
                                          </SelectTrigger>
                                        </TooltipWrapper>
                                        <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300 min-w-[140px]">
                                          <SelectItem value="1h">1h</SelectItem><SelectItem value="4h">4h</SelectItem><SelectItem value="5h">5h</SelectItem>
                                        </SelectContent>
                                      </Select>

                                      {/* 9. TAGS */}
                                      <Popover>
                                        <TooltipWrapper label="Nhãn" value={task.tags?.length > 0 ? `${task.tags.length} nhãn` : "None"}>
                                          <PopoverTrigger asChild><div className={iconBadgeClass}><Tag className="h-3.5 w-3.5" /></div></PopoverTrigger>
                                        </TooltipWrapper>
                                        <PopoverContent className="p-0 w-[220px] bg-[#18181b] border-white/10">
                                          <Command className="bg-transparent">
                                            <CommandInput placeholder="Tìm nhãn..." className="h-9 border-none focus:ring-0 text-white" />
                                            <CommandList>
                                              <CommandEmpty className="py-2 text-center text-xs text-zinc-500">Không tìm thấy.</CommandEmpty>
                                              <CommandGroup>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1 flex items-center gap-2">
                                                  <div className="h-2 w-2 rounded-full bg-red-500"/> Bug
                                                </CommandItem>
                                                <CommandItem className="text-zinc-300 hover:bg-white/5 cursor-pointer rounded-sm m-1 flex items-center gap-2">
                                                  <div className="h-2 w-2 rounded-full bg-green-500"/> Feature
                                                </CommandItem>
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>

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

        {/* Dialog & Panel */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-[#0c0c0c]/80 backdrop-blur-xl border-2 border-white/10 text-white sm:max-w-[500px] shadow-2xl p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
              <DialogTitle className="text-lg font-bold flex items-center gap-2"><div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400"><Plus className="h-4 w-4"/></div> Thêm công việc mới</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="bg-zinc-900/50 border-2 border-zinc-800 text-base py-5" placeholder="Tên công việc..." />
              <Textarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} className="bg-zinc-900/50 border-2 border-zinc-800 min-h-[120px]" placeholder="Mô tả..." />
            </div>
            <DialogFooter className="p-4 bg-zinc-900/30 border-t border-white/5">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
              <Button onClick={handleCreateTask} className="bg-indigo-600">Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {selectedTask && (<TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />)}
      </div>
    </TooltipProvider>
  );
}