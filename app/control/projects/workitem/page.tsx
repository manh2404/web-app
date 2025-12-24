'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  CircleDashed,
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  User,
  X,
  Maximize2,
  Link as LinkIcon,
  Paperclip,
  Layout,
  GitBranch,
  History
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- 1. DỮ LIỆU & CONFIG ---

type Task = {
  id: string;
  taskId: string;
  title: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignees: { name: string; avatar: string }[];
};

const initialTasks: Task[] = [
  { id: 'task-1', taskId: 'BATEK-84', title: 'Frontend UI + Menu', status: 'backlog', dueDate: 'Dec 24', priority: 'high', assignees: [{ name: 'A', avatar: 'https://github.com/shadcn.png' }] },
  { id: 'task-2', taskId: 'BATEK-79', title: 'Xác định thời gian đầu ghi gửi ảnh về', status: 'todo', dueDate: 'Dec 25', priority: 'medium', assignees: [] },
  { id: 'task-3', taskId: 'BATEK-82', title: 'Refactor 3', status: 'todo', dueDate: 'Dec 23', priority: 'high', assignees: [{ name: 'Alice', avatar: 'https://github.com/shadcn.png' }, { name: 'Bob', avatar: '' }] },
  { id: 'task-4', taskId: 'BATEK-80', title: 'Design Database Schema', status: 'todo', dueDate: 'Dec 26', priority: 'high', assignees: [] },
  { id: 'task-5', taskId: 'BATEK-81', title: 'Refactor 2', status: 'in_progress', dueDate: 'Dec 23', priority: 'high', assignees: [{ name: 'Charlie', avatar: '' }] },
  { id: 'task-6', taskId: 'BATEK-72', title: 'API xóa ảnh', status: 'done', dueDate: 'Dec 20', priority: 'medium', assignees: [] },
  { id: 'task-7', taskId: 'BATEK-70', title: 'Xác minh API', status: 'done', dueDate: 'Dec 19', priority: 'low', assignees: [{ name: 'Eve', avatar: '' }] },
  { id: 'task-8', taskId: 'BATEK-39', title: 'Viết tài liệu báo cáo', status: 'in_progress', dueDate: 'Dec 15', priority: 'low', assignees: [] },
];

const columnsConfig = {
  backlog: { title: 'Backlog', icon: CircleDashed, color: 'text-slate-400' },
  todo: { title: 'Todo', icon: Circle, color: 'text-blue-400' },
  in_progress: { title: 'In Progress', icon: Clock, color: 'text-yellow-400' },
  done: { title: 'Done', icon: CheckCircle2, color: 'text-green-400' },
  canceled: { title: 'Canceled', icon: XCircle, color: 'text-red-400' },
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'low': return <ArrowDown className="h-4 w-4 text-blue-500" />;
    default: return null;
  }
};

const initializeBoard = (tasks: Task[]) => {
  const columns: { [key: string]: Task[] } = {
    backlog: [], todo: [], in_progress: [], done: [], canceled: []
  };
  tasks.forEach(task => {
    if (columns[task.status]) columns[task.status].push(task);
  });
  return columns;
};

// --- 2. COMPONENT: TASK CARD (Đã chỉnh Glassmorphism) ---
const TaskCard = ({ task, index, onClick, isSelected }: { task: Task; index: number, onClick: () => void, isSelected: boolean }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className="mb-1.5" // Giảm khoảng cách giữa các thẻ
        >
          <Card
            className={cn(
              // Base Style: Tối ưu bo góc và độ trong suốt
              "cursor-pointer transition-all duration-200 group relative rounded-lg box-border",
              "bg-zinc-900/40 backdrop-blur-sm border-white/10 hover:bg-zinc-800/60 hover:border-white/20",
              "shadow-sm",

              // Styles khi đang kéo thả: Bỏ hiệu ứng bay xa/xoay mạnh
              snapshot.isDragging && "bg-indigo-950/90 border-indigo-500/50 shadow-xl z-50 ring-1 ring-indigo-500/30 scale-[1.02]",

              // Styles khi được chọn
              isSelected && "bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20"
            )}
          >
            {/* GIẢM CHIỀU CAO: Thay p-3 bằng py-1.5 px-2.5 */}
            <CardContent className="py-0.5 px-3">
              {/* Header: ID & Menu - Tối ưu cực nhỏ */}
              <div className="flex justify-between items-center mb-0.5">
                <span className={cn(
                  "text-[9px] font-bold tracking-tight opacity-70",
                  isSelected ? "text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {task.taskId}
                </span>
                <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>

              {/* Title: Tối ưu chiều cao dòng (leading-tight) và cỡ chữ */}
              <div className="text-[12.5px] font-medium text-white/90 leading-tight mb-1.5 line-clamp-1 group-hover:text-white">
                {task.title}
              </div>

              {/* Footer: Căn chỉnh lại icon và avatar nhỏ hơn */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Status Tag nhỏ hơn */}
                  <div className="flex items-center justify-center h-4 w-4 rounded bg-white/5 border border-white/5">
                    {(() => {
                      const Icon = columnsConfig[task.status].icon;
                      const color = columnsConfig[task.status].color;
                      return <Icon className={cn("h-2.5 w-2.5", color)} />;
                    })()}
                  </div>

                  {/* Priority Tag nhỏ hơn */}
                  <div className="flex items-center justify-center h-4 w-4 rounded bg-white/5 border border-white/5">
                    <PriorityIcon priority={task.priority} />
                  </div>
                </div>

                {/* Avatars: Giảm size từ h-5 xuống h-4.5 */}
                <div className="flex -space-x-1">
                  {task.assignees.length > 0 ? (
                    task.assignees.map((mem, i) => (
                      <Avatar key={i} className="h-4.5 w-4.5 border border-zinc-950 ring-0">
                        {mem.avatar && <AvatarImage src={mem.avatar} />}
                        <AvatarFallback className="text-[7px] bg-indigo-600 text-white font-bold">{mem.name[0]}</AvatarFallback>
                      </Avatar>
                    ))
                  ) : (
                    <div className="h-4.5 w-4.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="h-2.5 w-2.5 text-white/30" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

// --- 3. COMPONENT: KANBAN COLUMN (Đã chỉnh Glassmorphism) ---
const KanbanColumn = ({ columnId, config, tasks, onTaskClick, selectedTaskId }: { columnId: string, config: any, tasks: Task[], onTaskClick: (task: Task) => void, selectedTaskId: string | null }) => {
  return (
    <div className="flex flex-col h-full w-[300px] min-w-[300px] max-w-[300px] rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 shrink-0 box-border hover:bg-black/30 transition-colors duration-300">

      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-md bg-white/5", config.color)}>
            <config.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white/90">{config.title}</span>
          <Badge variant="secondary" className="bg-white/10 text-white/70 hover:bg-white/20 border-0 h-5 px-1.5 text-[10px] min-w-[20px] justify-center">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10 rounded-lg">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 overflow-y-auto custom-scrollbar transition-colors",
              snapshot.isDraggingOver ? "bg-white/5" : ""
            )}
          >
            <div className="flex flex-col h-full">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={() => onTaskClick(task)}
                  isSelected={selectedTaskId === task.id}
                />
              ))}
              {provided.placeholder}

              {/* Nút thêm mới ở cuối cột */}
              {!snapshot.isDraggingOver && (
                <Button variant="ghost" className="w-full justify-start text-white/40 hover:text-white/80 text-xs h-9 mt-1 hover:bg-white/5 border border-transparent hover:border-white/10 border-dashed rounded-xl">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Thêm công việc mới
                </Button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

// --- 4. COMPONENT: TASK DETAIL PANEL (Đã chỉnh Glassmorphism) ---
const PropertyRow = ({ icon: Icon, label, value, isUser = false }: any) => (
  <div className="flex items-center py-2 group hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
    <div className="w-[140px] flex items-center text-muted-foreground text-sm">
      <Icon className="h-4 w-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity text-indigo-400" />
      {label}
    </div>
    <div className="flex-1 flex items-center text-sm text-white/80">
      {isUser ? (
        <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md cursor-pointer transition-colors border border-white/5">
          <Avatar className="h-5 w-5"><AvatarImage src={value.avatar} /><AvatarFallback className="text-[9px] bg-indigo-500 text-white">{value.name[0]}</AvatarFallback></Avatar>
          <span>{value.name}</span>
        </div>
      ) : (
        <div className="w-full truncate">
          {value}
        </div>
      )}
    </div>
  </div>
);

const TaskDetailPanel = ({ task, onClose }: { task: Task, onClose: () => void }) => {
  if (!task) return null;
  const StatusIcon = columnsConfig[task.status].icon;

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-2xl border-l border-white/10 overflow-hidden box-border shadow-2xl">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-md border-blue-500/30 bg-blue-500/10 text-blue-400 gap-1.5 py-1 px-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></div>
            {task.taskId}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"><LinkIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"><Maximize2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-tight mb-3 text-white drop-shadow-sm">{task.title}</h2>
          <div className="text-muted-foreground/60 text-sm hover:text-white/80 hover:bg-white/5 p-3 rounded-lg border border-dashed border-white/10 cursor-text transition-all">
            Thêm mô tả chi tiết cho công việc này...
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 text-muted-foreground"><Layout className="h-3.5 w-3.5 mr-2" /> Mục con</Button>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 text-muted-foreground"><GitBranch className="h-3.5 w-3.5 mr-2" /> Quan hệ</Button>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 text-muted-foreground"><Paperclip className="h-3.5 w-3.5 mr-2" /> Đính kèm</Button>
        </div>

        {/* Properties */}
        <div className="space-y-1 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Chi tiết</h3>

          <PropertyRow
            icon={StatusIcon}
            label="Trạng thái"
            value={<span className={cn("flex items-center gap-2 font-medium", columnsConfig[task.status].color)}>{columnsConfig[task.status].title}</span>}
          />

          <PropertyRow
            icon={User}
            label="Phụ trách"
            isUser
            value={task.assignees[0] || { name: 'Chưa gán', avatar: '' }}
          />

          <PropertyRow
            icon={AlertCircle}
            label="Độ ưu tiên"
            value={<Badge variant="outline" className={cn("capitalize border-0 bg-white/10 text-white/80")}>{task.priority}</Badge>}
          />

          <PropertyRow icon={Calendar} label="Hạn chót" value={task.dueDate} />
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground/50 mt-10 flex items-center gap-1.5 border-t border-white/5 pt-4">
          <History className="h-3 w-3" /> Cập nhật lần cuối bởi <b>manhb7536</b> khoảng 1 giờ trước
        </div>
      </div>
    </div>
  );
};

// --- 5. TRANG CHÍNH: WORK ITEM PAGE ---
export default function WorkItemPage() {
  const [columns, setColumns] = useState(initializeBoard(initialTasks));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const startColId = source.droppableId as keyof typeof columns;
    const finishColId = destination.droppableId as keyof typeof columns;
    const newColumns = { ...columns };
    const [removedTask] = newColumns[startColId].splice(source.index, 1);

    if (startColId !== finishColId) removedTask.status = finishColId as any;
    newColumns[finishColId].splice(destination.index, 0, removedTask);
    setColumns(newColumns);
  };

  return (
    // 👇 CONTAINER CHÍNH: Glassmorphism Base
    // bg-black/10: Nền tối mờ nhẹ
    // backdrop-blur-xl: Làm mờ hậu cảnh mạnh
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full bg-black/10 backdrop-blur-xl overflow-hidden rounded-xl border border-white/10 shadow-2xl box-border">

      {/* Header Page */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0 h-16 bg-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">Batek</span> <span className="text-white/30">/</span> Work Items
            <Badge variant="secondary" className="ml-2 bg-white/10 text-white/70 hover:bg-white/20 border-0 h-5 px-1.5 text-[10px]">Sprint 24</Badge>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar giả lập cho đẹp */}
          <div className="hidden md:flex h-9 w-48 items-center rounded-lg bg-black/20 border border-white/5 px-3 text-sm text-white/50">
            <span className="text-xs">Filter tasks...</span>
          </div>

          <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 shadow-lg shadow-indigo-500/20 border border-indigo-500/50">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Tạo việc mới
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">

        {/* === PHẦN 1: KANBAN BOARD === */}
        <div className={cn(
          "flex flex-col h-full transition-all duration-300 ease-in-out box-border",
          selectedTask ? "w-1/2 border-r border-white/10" : "w-full"
        )}>
          <div className="flex-1 min-h-0 relative">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className={cn(
                "absolute inset-0 overflow-x-auto overflow-y-hidden p-5 scroll-smooth",
                // Scrollbar styling cho vùng ngang
                "[&::-webkit-scrollbar]:h-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-white/10",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:hover:bg-white/20"
              )}>
                <div className="flex h-full gap-5 min-w-max pb-2">
                  {Object.entries(columnsConfig).map(([colId, config]) => (
                    <KanbanColumn
                      key={colId}
                      columnId={colId}
                      config={config}
                      tasks={columns[colId as keyof typeof columns]}
                      onTaskClick={setSelectedTask}
                      selectedTaskId={selectedTask?.id || null}
                    />
                  ))}
                </div>
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* === PHẦN 2: PANEL CHI TIẾT (Slide Animation) === */}
        {selectedTask && (
          <div className="w-1/2 h-full flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300 z-10 box-border">
            <TaskDetailPanel
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}

      </div>
    </div>
  );
}