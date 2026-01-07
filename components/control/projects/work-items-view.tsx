'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { format } from "date-fns";
import { toast } from 'sonner';
import Link from 'next/link';

// Icons
import {
  Plus, User, Calendar as CalendarIcon, Triangle, ArrowLeft, GitMerge, Loader2, X,
  CheckCircle2, AlertCircle, Clock, HelpCircle, MoreHorizontal, ArrowUpCircle, Circle
} from 'lucide-react';

// UI
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Import Shared Logic
import { Task, columns, estimates, mockMembers, MOCK_TASKS } from './project-data';
import { TaskDetailPanel } from './project-detail-layout';

// --- DATA OPTIONS ---
const STATUS_OPTIONS = [
  { value: 'backlog', label: 'Backlog', icon: HelpCircle, color: 'text-slate-500' },
  { value: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-500' },
  { value: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
  { value: 'done', label: 'Done', icon: CheckCircle2, color: 'text-green-600' },
  { value: 'cancle', label: 'Canceled', icon: X, color: 'text-red-500' },
];

const IMPORTANCE_OPTIONS = [
  { value: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-600' },
  { value: 'high', label: 'High', icon: ArrowUpCircle, color: 'text-orange-500' },
  { value: 'medium', label: 'Medium', icon: MoreHorizontal, color: 'text-blue-500' },
  { value: 'low', label: 'Low', icon: ArrowUpCircle, color: 'text-slate-500 rotate-180' },
  { value: 'none', label: 'None', icon: Circle, color: 'text-slate-400' },
];

export function WorkItemsView({ projectId: _projectId }: { projectId: string }) {
  const [winReady, setWinReady] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [parentTaskForSub, setParentTaskForSub] = useState<Task | null>(null);

  // Form State
  const [newTaskData, setNewTaskData] = useState<{
    title: string; description: string; status: string; importance: string;
    assignee: any | null; startDate: Date | null; endDate: Date | null; estimate: number | null;
  }>({
    title: "", description: "", status: "todo", importance: "none",
    assignee: null, startDate: null, endDate: null, estimate: null
  });

  useEffect(() => { setWinReady(true); }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === 'canceled') {
      setTasks(tasks.filter(t => t._id !== draggableId));
      if (selectedTask?._id === draggableId) setSelectedTask(null);
      toast.success("Đã hủy công việc");
      return;
    }
    if (destination.droppableId === result.source.droppableId && destination.index === result.source.index) return;
    setTasks(tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t));
  };

  const updateTask = (taskId: string, field: string, value: any) => {
    setTasks(tasks.map(t => t._id === taskId ? { ...t, [field]: value } : t));
    if (selectedTask?._id === taskId) { setSelectedTask(prev => prev ? { ...prev, [field]: value } : null); }
  };

  const handleCreateTask = () => {
    if (!newTaskData.title) return toast.error("Vui lòng nhập tiêu đề");
    const newTask: Task = {
      _id: Math.random().toString(),
      taskId: `WEB-${Math.floor(Math.random() * 900) + 100}`,
      title: newTaskData.title, description: newTaskData.description, status: newTaskData.status,
      assignee: newTaskData.assignee, creator: mockMembers[0], estimate: newTaskData.estimate,
      startDate: newTaskData.startDate, endDate: newTaskData.endDate,
      parentId: parentTaskForSub ? parentTaskForSub._id : null
    };
    setTasks([newTask, ...tasks]);
    setIsCreateOpen(false);
    toast.success(parentTaskForSub ? "Đã tạo công việc con" : "Đã tạo công việc mới");
  };

  const openCreateDialog = (status = "todo", parent: Task | null = null) => {
    setParentTaskForSub(parent);
    setNewTaskData({
      title: "", description: "", status, importance: "none",
      assignee: null, startDate: null, endDate: null, estimate: null
    });
    setIsCreateOpen(true);
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);
  const getParentInfo = (parentId: string) => { const parent = tasks.find(t => t._id === parentId); return parent ? `${parent.taskId} - ${parent.title}` : "Unknown Parent"; };

  const createStatus = STATUS_OPTIONS.find(s => s.value === newTaskData.status) || STATUS_OPTIONS[1];
  const createImportance = IMPORTANCE_OPTIONS.find(i => i.value === newTaskData.importance) || IMPORTANCE_OPTIONS[4];

  const stopProp = (e: React.MouseEvent | React.PointerEvent) => { e.stopPropagation(); };

  if (!winReady) return <div className="flex h-full items-center justify-center bg-zinc-50 dark:bg-[#020617]"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full w-full overflow-hidden relative bg-zinc-50 dark:bg-[#020617] font-sans selection:bg-orange-500/30 text-zinc-900 dark:text-white">

        {/* HEADER */}
        <div className="flex-none h-14 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 bg-white dark:bg-[#020617] z-20 sticky top-0 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 -ml-2"><Link href="/control/projects"><ArrowLeft className="h-5 w-5" /></Link></Button>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-white/10"></div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><span className="text-orange-500">❖</span> Board</h1>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-white/10"></div>
            <span className="text-xs text-zinc-500 font-mono">{tasks.length} issues</span>
          </div>
          <Button size="sm" onClick={() => openCreateDialog('todo')} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold h-8 px-3 rounded shadow-md border-0"> Thêm công việc mới</Button>
        </div>

        {/* BOARD CONTENT */}
        <div className="flex-1 relative min-h-0 z-10">
          <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex h-full p-6 gap-5 w-max">
                {Object.values(columns).map((col) => (
                  <div key={col.id} className="flex-none w-[320px] flex flex-col h-full relative">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2"><col.icon className={cn("h-3.5 w-3.5", col.color)} /><span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{col.title}</span><span className="text-[10px] text-zinc-400 dark:text-zinc-600 ml-1">{getTasksByStatus(col.id).length}</span></div>
                      <Button variant="ghost" size="icon" onClick={() => openCreateDialog(col.id)} className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-300"><Plus className="h-3.5 w-3.5" /></Button>
                    </div>
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={cn("flex-1 rounded-xl bg-zinc-100 dark:bg-[#0a0a0c] border border-zinc-200 dark:border-white/5 p-2 overflow-y-auto custom-scrollbar transition-colors", snapshot.isDraggingOver ? "bg-zinc-200 dark:bg-white/[0.02]" : "")}>
                          {getTasksByStatus(col.id).map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => setSelectedTask(task)}
                                  style={{ ...provided.draggableProps.style }}
                                  className={cn(
                                    "group relative flex flex-col gap-3 p-3 mb-2 rounded-lg border transition-all duration-200 cursor-pointer shadow-sm",
                                    "bg-white border-zinc-200 hover:border-orange-300 hover:shadow-md",
                                    "dark:bg-[#141416] dark:border-white/5 dark:hover:border-white/10 dark:hover:bg-[#1a1a1d]",
                                    snapshot.isDragging ? "shadow-2xl ring-1 ring-orange-500/50 z-50 rotate-2 opacity-90" : ""
                                  )}
                                >
                                  {/* Top */}
                                  <div className="flex flex-col gap-1">
                                    {task.parentId && (<div className="flex items-center gap-1 text-[9px] text-zinc-400"><GitMerge className="h-2.5 w-2.5 rotate-180" /><span className="truncate max-w-[200px]">{getParentInfo(task.parentId)}</span></div>)}
                                    <div className="flex justify-between items-start"><span className="text-[10px] text-zinc-400 font-mono group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">{task.taskId}</span></div>
                                  </div>
                                  <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-black dark:group-hover:text-white">{task.title}</div>

                                  {/* --- INTERACTIVE ATTRIBUTES ON CARD --- */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1" onPointerDown={stopProp} onClick={stopProp} onMouseDown={stopProp}>

                                    {/* Status Button */}
                                    {(() => {
                                      const sInfo = STATUS_OPTIONS.find(s => s.value === task.status) || STATUS_OPTIONS[1];
                                      return (
                                        <Popover modal={true}>
                                          <PopoverTrigger asChild>
                                            <button className="flex items-center gap-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5 transition-colors">
                                              <sInfo.icon className={cn("h-3 w-3", sInfo.color)} />
                                              <span>{sInfo.label}</span>
                                            </button>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0 w-[180px] bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 z-50 shadow-xl" align="start">
                                            <Command className="bg-transparent"><CommandList><CommandGroup>{STATUS_OPTIONS.map(opt => (
                                              <CommandItem key={opt.value} onSelect={() => updateTask(task._id, 'status', opt.value)} className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer text-xs"><opt.icon className={cn("mr-2 h-3.5 w-3.5", opt.color)} /> {opt.label}</CommandItem>
                                            ))}</CommandGroup></CommandList></Command>
                                          </PopoverContent>
                                        </Popover>
                                      )
                                    })()}

                                    {/* Assignee Button */}
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <button className={cn("flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border transition-colors", task.assignee ? "text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10" : "text-zinc-400 border-dashed border-zinc-300 dark:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400")}>
                                          <User className="h-3 w-3" />
                                          <span className="truncate max-w-[60px]">{task.assignee ? task.assignee.name : "Unassigned"}</span>
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 w-[200px] bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 z-50 shadow-xl" align="start">
                                        <Command className="bg-transparent"><CommandInput placeholder="Search..." className="h-8 border-none text-xs" /><CommandList><CommandGroup>{mockMembers.map(m => (
                                          <CommandItem key={m.id} onSelect={() => updateTask(task._id, 'assignee', m)} className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer text-xs"><Avatar className="h-4 w-4 mr-2"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>{m.name}</CommandItem>
                                        ))}</CommandGroup></CommandList></Command>
                                      </PopoverContent>
                                    </Popover>

                                    {/* Estimate Button */}
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <button className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors", task.estimate ? "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300" : "text-zinc-400 dark:text-zinc-600")}>
                                          <Triangle className="h-2.5 w-2.5" />
                                          <span>{task.estimate || '-'}</span>
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[140px] p-2 bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 z-50 shadow-xl" align="start">
                                        <div className="flex flex-wrap gap-1">{estimates.map(est => <div key={est} onClick={() => updateTask(task._id, 'estimate', est)} className="px-2 py-1 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-xs text-zinc-700 dark:text-zinc-300 rounded cursor-pointer border border-transparent">{est}</div>)}</div>
                                      </PopoverContent>
                                    </Popover>

                                    {/* [CẬP NHẬT] Start Date */}
                                    {task.startDate && (
                                      <div className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">S:</span>
                                        {format(new Date(task.startDate), "dd/MM/yyyy")}
                                      </div>
                                    )}

                                    {/* [CẬP NHẬT] End Date */}
                                    {task.endDate && (
                                      <div className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">E:</span>
                                        {format(new Date(task.endDate), "dd/MM/yyyy")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* ... (Dialog code bên dưới giữ nguyên vì đã ok) ... */}
        {/* DIALOG TẠO MỚI */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-white dark:bg-[#0f0f11] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white sm:max-w-[750px] shadow-2xl p-0 gap-0 overflow-visible sm:rounded-xl outline-none [&>button]:hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.01] rounded-t-xl">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-lg font-bold tracking-tight">{parentTaskForSub ? "Thêm công việc con" : "Thêm công việc mới"}</DialogTitle>
                <div className="flex items-center gap-2 text-xs text-zinc-500"><span className="font-medium">Tên dự án</span>{parentTaskForSub && <><span>/</span><span className="text-indigo-500 dark:text-indigo-400">Thuộc: {parentTaskForSub.title}</span></>}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(false)} className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"><X className="h-5 w-5" /></Button>
            </div>

            {/* Inputs */}
            <div className="px-6 py-6 min-h-[220px] space-y-6">
              <Input
                value={newTaskData.title}
                onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                className="bg-transparent border-none text-xl font-semibold px-0 placeholder:text-zinc-400 focus-visible:ring-0 shadow-none h-auto py-2"
                placeholder={parentTaskForSub ? "Nhập tên công việc con..." : "Tiêu đề công việc..."}
                autoFocus
              />
              <Textarea
                value={newTaskData.description}
                onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                className="bg-transparent border-none text-sm text-zinc-700 dark:text-zinc-300 px-0 placeholder:text-zinc-400 focus-visible:ring-0 shadow-none resize-none min-h-[120px] leading-relaxed"
                placeholder="Thêm mô tả chi tiết..."
              />
            </div>

            {/* Actions Bar */}
            <div className="px-4 py-4 bg-zinc-50 dark:bg-[#121214] border-t border-zinc-200 dark:border-white/5 flex items-center justify-between rounded-b-xl">
              <div className="flex flex-wrap items-center gap-2">

                {/* 1. Status */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <createStatus.icon className={cn("h-3.5 w-3.5", createStatus.color)} />
                      {createStatus.label}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[200px] bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 z-[100] shadow-xl" align="start">
                    <Command className="bg-transparent">
                      <CommandList>
                        <CommandGroup>
                          {STATUS_OPTIONS.map((opt) => (
                            <CommandItem key={opt.value} onSelect={() => setNewTaskData({ ...newTaskData, status: opt.value })} className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-white/10">
                              <opt.icon className={cn("mr-2 h-4 w-4", opt.color)} /> {opt.label}
                              {newTaskData.status === opt.value && <CheckCircle2 className="ml-auto h-4 w-4 opacity-50" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 2. Importance */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <createImportance.icon className={cn("h-3.5 w-3.5", createImportance.color)} />
                      {createImportance.label}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[200px] bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 z-[100] shadow-xl" align="start">
                    <Command className="bg-transparent">
                      <CommandList>
                        <CommandGroup>
                          {IMPORTANCE_OPTIONS.map((opt) => (
                            <CommandItem key={opt.value} onSelect={() => setNewTaskData({ ...newTaskData, importance: opt.value })} className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-white/10">
                              <opt.icon className={cn("mr-2 h-4 w-4", opt.color)} /> {opt.label}
                              {newTaskData.importance === opt.value && <CheckCircle2 className="ml-auto h-4 w-4 opacity-50" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 3. Assignee */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      {newTaskData.assignee ? newTaskData.assignee.name : "Assignee"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[220px] bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 z-[100] shadow-xl" align="start">
                    <Command className="bg-transparent">
                      <CommandInput placeholder="Search user..." className="h-9 border-none focus:ring-0" />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {mockMembers.map(m => (
                            <CommandItem key={m.id} onSelect={() => setNewTaskData({ ...newTaskData, assignee: m })} className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer aria-selected:bg-zinc-100 dark:aria-selected:bg-white/10">
                              <Avatar className="h-5 w-5 mr-2"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
                              {m.name}
                              {newTaskData.assignee?.id === m.id && <CheckCircle2 className="ml-auto h-4 w-4 opacity-50" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 4. Estimate */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <Triangle className="h-3.5 w-3.5 text-zinc-500" />
                      {newTaskData.estimate ? newTaskData.estimate : "Est"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-2 bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 z-[100] shadow-xl" align="start">
                    <Input
                      type="number"
                      placeholder="Points..."
                      className="h-8 bg-transparent border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white mb-2"
                      onChange={(e) => setNewTaskData({ ...newTaskData, estimate: Number(e.target.value) })}
                    />
                    <div className="flex flex-wrap gap-1">
                      {estimates.map(est => (
                        <div key={est} onClick={() => setNewTaskData({ ...newTaskData, estimate: est })} className="px-2 py-1 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-xs text-zinc-700 dark:text-zinc-300 rounded cursor-pointer border border-transparent">{est}</div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 5. Start Date */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                      {newTaskData.startDate ? format(newTaskData.startDate, "dd/MM/yyyy") : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 z-[100] shadow-xl" align="start">
                    <Calendar mode="single" selected={newTaskData.startDate || undefined} onSelect={(d) => setNewTaskData({ ...newTaskData, startDate: d })} className="text-zinc-900 dark:text-zinc-300" />
                  </PopoverContent>
                </Popover>

                {/* 6. End Date */}
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-xs font-medium gap-2 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
                      <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                      {newTaskData.endDate ? format(newTaskData.endDate, "dd/MM/yyyy") : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-[#1a1a1d] border border-zinc-200 dark:border-white/10 z-[100] shadow-xl" align="start">
                    <Calendar mode="single" selected={newTaskData.endDate || undefined} onSelect={(d) => setNewTaskData({ ...newTaskData, endDate: d })} className="text-zinc-900 dark:text-zinc-300" />
                  </PopoverContent>
                </Popover>

              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 h-8 text-xs font-medium">Hủy bỏ</Button>
                <Button onClick={handleCreateTask} className="h-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold px-4 rounded shadow-md border-0">Lưu</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* DETAIL PANEL */}
        {selectedTask && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <TaskDetailPanel
                task={selectedTask}
                tasks={tasks}
                onClose={() => setSelectedTask(null)}
                onUpdate={updateTask}
                onCreateSubtask={() => openCreateDialog('todo', selectedTask)}
              />
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
}