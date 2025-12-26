'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

// Icons
import {
  CircleDashed, Circle, Clock, CheckCircle2, XCircle, Plus,
  MoreHorizontal, User, X, Tag, ShieldAlert, MousePointer2, Loader2, GripVertical
} from 'lucide-react';

// UI Components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

// --- CONFIG MÀU SẮC ---
const columns = {
  backlog: { id: 'backlog', title: 'Backlog', icon: CircleDashed, color: 'text-zinc-400' },
  todo: { id: 'todo', title: 'To Do', icon: Circle, color: 'text-blue-400' },
  in_progress: { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-orange-400' },
  done: { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
  canceled: { id: 'canceled', title: 'Canceled', icon: XCircle, color: 'text-rose-400' },
};

const priorities = [
  {
    value: 'High',
    label: 'High',
    style: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
    barColor: 'bg-rose-500'
  },
  {
    value: 'Medium',
    label: 'Medium',
    style: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    barColor: 'bg-amber-500'
  },
  {
    value: 'Low',
    label: 'Low',
    style: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    barColor: 'bg-sky-500'
  },
];

// --- COMPONENT CHI TIẾT TASK ---
const TaskDetailPanel = ({ task, onClose }: { task: any, onClose: () => void }) => {
  if (!task) return null;
  const PriorityInfo = priorities.find(p => p.value === task.priority) || priorities[1];

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[450px] z-[50] bg-[#09090b]/80 backdrop-blur-2xl border-l-2 border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-8 py-6 border-b-2 border-white/5">
        <Badge variant="outline" className="font-mono text-zinc-400 border-2 border-white/10 px-3 py-1 text-xs bg-white/5">{task.taskId}</Badge>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-4 w-4 text-zinc-400" />
        </Button>
      </div>

      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-bold text-white leading-tight">{task.title}</h2>
        <div className="grid grid-cols-1 gap-4 p-5 rounded-2xl bg-white/[0.03] border-2 border-white/5 shadow-inner">
          <div className="flex justify-between items-center text-sm group">
            <span className="text-zinc-500 flex gap-2 items-center group-hover:text-zinc-300 transition-colors"><MousePointer2 className="h-4 w-4"/> Trạng thái</span>
            <span className="text-zinc-200 capitalize font-medium px-2 py-1 rounded-md bg-white/5">{task.status?.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-sm group">
            <span className="text-zinc-500 flex gap-2 items-center group-hover:text-zinc-300 transition-colors"><ShieldAlert className="h-4 w-4"/> Ưu tiên</span>
            <Badge variant="outline" className={cn("border-2 bg-opacity-10 px-2.5 py-0.5 shadow-sm", PriorityInfo.style)}>{task.priority}</Badge>
          </div>
          <div className="flex justify-between items-center text-sm group">
            <span className="text-zinc-500 flex gap-2 items-center group-hover:text-zinc-300 transition-colors"><User className="h-4 w-4"/> Phụ trách</span>
            <div className="flex items-center gap-2">
              {task.assignee ? (
                <>
                  <Avatar className="h-5 w-5 border border-white/10"><AvatarFallback className="text-[9px] bg-indigo-500/20 text-indigo-300">{task.assignee.lastname?.[0]}</AvatarFallback></Avatar>
                  <span className="text-zinc-200">{task.assignee.lastname} {task.assignee.firstname}</span>
                </>
              ) : <span className="text-zinc-600 italic text-xs">Chưa gán</span>}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Mô tả chi tiết</h3>
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line p-4 rounded-xl border-2 border-white/5 bg-black/20 min-h-[100px]">
            {task.description || <span className="text-zinc-600 italic">Không có mô tả nào cho công việc này.</span>}
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
  const [project, setProject] = useState<any>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/workitems`);
      setTasks(res.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}`);
      setProject(res.data);
    } catch (error) {
      toast.error("Không thể tải thông tin dự án");
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

  const openCreateDialog = (status = "todo") => {
    setNewTaskStatus(status);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsCreateOpen(true);
  };

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
      setNewTaskTitle("");
      setNewTaskDescription("");
      toast.success("Tạo công việc thành công");
    } catch (error) {
      toast.error("Lỗi khi tạo công việc");
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  if (loading) return <div className="h-full w-full flex items-center justify-center bg-[#020617] text-white"><Loader2 className="animate-spin mr-2 text-indigo-500"/> <span className="text-zinc-400 text-sm">Đang tải dữ liệu...</span></div>;

  return (
    // THAY ĐỔI MÀU NỀN CHÍNH TẠI ĐÂY
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden relative font-sans selection:bg-indigo-500/30">

      {/* 0. NEW BACKGROUND EFFECTS (Giống ảnh mẫu) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Lớp nền chính: Radial Gradient từ Tím than ra Đen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80"></div>

        {/* Lưới Grid mờ cực nhẹ để tạo texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

        {/* Một chút glow xanh dương nhẹ ở góc trái để tạo chiều sâu giống ảnh */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* 1. HEADER */}
      <div className="flex-none h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-indigo-400">❖</span> Board View
          </h1>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <Badge variant="secondary" className="bg-white/5 text-zinc-400 hover:text-white transition-colors border-white/5 font-mono text-xs px-2.5">
            {tasks.length} Tasks
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={() => openCreateDialog('todo')}
          className="bg-white text-black hover:bg-zinc-200 text-xs font-bold h-9 px-4 rounded-lg shadow-lg shadow-white/5 transition-all"
        >
          <Plus className="h-3.5 w-3.5 mr-2" /> New Task
        </Button>
      </div>

      {/* 2. BOARD AREA */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden z-10">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full p-8 gap-6">
            {Object.values(columns).map((col) => (

              <div key={col.id} className="flex-none w-[320px] flex flex-col h-full relative group/column">

                {/* Cập nhật nền cột cho hợp với background mới (Tối hơn, trong suốt hơn) */}
                <div className="absolute inset-0 bg-[#000000]/20 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl z-0" />

                <div className="relative z-10 flex flex-col h-full rounded-2xl overflow-hidden">
                  {/* Column Header */}
                  <div className={cn("p-4 flex items-center justify-between border-b border-white/5 shrink-0 group/header bg-gradient-to-b from-white/[0.05] to-transparent")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-md bg-white/5 border border-white/5 shadow-sm", col.color)}>
                        <col.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-sm text-zinc-200 tracking-tight">{col.title}</span>
                      <Badge variant="secondary" className="bg-black/40 text-zinc-500 border-0 text-[10px] px-1.5 min-w-[20px] justify-center ml-1">{getTasksByStatus(col.id).length}</Badge>
                    </div>
                    <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-all duration-300 translate-x-2 group-hover/header:translate-x-0">
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => openCreateDialog(col.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-white hover:bg-white/10 rounded-lg">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Droppable Zone */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                          "flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors duration-300",
                          snapshot.isDraggingOver ? "bg-indigo-500/[0.05]" : "bg-transparent"
                        )}
                      >
                        {getTasksByStatus(col.id).map((task, index) => {
                          const PriorityInfo = priorities.find(p => p.value === task.priority) || priorities[1];
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
                                    "group relative flex flex-col gap-3 p-4 rounded-xl border-2 bg-[#18181b]/60 backdrop-blur-md transition-all duration-200 cursor-pointer",
                                    "border-white/[0.05] hover:border-indigo-500/30 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] hover:bg-[#18181b]/80",
                                    snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500/50 rotate-2 z-50 bg-[#18181b] scale-105 opacity-100" : ""
                                  )}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                                                    {task.taskId}
                                                </span>
                                      {task.priority === 'High' && (
                                        <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                    </span>
                                      )}
                                    </div>
                                    <GripVertical className="h-3 w-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>

                                  <span className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                                            {task.title}
                                        </span>

                                  <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                      {task.assignee ? (
                                        <div className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors">
                                          <Avatar className="h-4.5 w-4.5"><AvatarFallback className="text-[8px] bg-indigo-500 text-white">{task.assignee.lastname?.[0]}</AvatarFallback></Avatar>
                                          <span className="text-[10px] text-zinc-400">{task.assignee.lastname}</span>
                                        </div>
                                      ) : (
                                        <div className="h-6 w-6 rounded-full border border-dashed border-zinc-700 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                                          <User className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400"/>
                                        </div>
                                      )}
                                    </div>
                                    <div className={cn("h-1.5 w-6 rounded-full opacity-60", PriorityInfo.barColor)}></div>
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

      {/* 3. DIALOG CREATE TASK */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#0c0c0c]/80 backdrop-blur-xl border-2 border-white/10 text-white sm:max-w-[500px] shadow-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400"><Plus className="h-4 w-4"/></div>
              Thêm công việc mới
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs">
              Tạo task mới cho dự án <span className="text-zinc-300 font-medium">{project?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Tiêu đề</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-zinc-900/50 border-2 border-zinc-800 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-0 text-base py-5 transition-all"
                placeholder="VD: Thiết kế trang chủ..."
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-desc" className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Mô tả</Label>
              <Textarea
                id="task-desc"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="bg-zinc-900/50 border-2 border-zinc-800 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-0 min-h-[120px] resize-none transition-all"
                placeholder="Mô tả chi tiết về công việc cần làm..."
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-zinc-900/30 border-t border-white/5 flex justify-between items-center">
            <div className="text-[10px] text-zinc-600 font-mono pl-2">Status: {newTaskStatus}</div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="hover:bg-white/5 text-zinc-400 hover:text-white">
                Hủy bỏ
              </Button>
              <Button onClick={handleCreateTask} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                Xác nhận
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}