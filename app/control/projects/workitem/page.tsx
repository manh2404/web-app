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
import { Separator } from '@/components/ui/separator';

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

// --- 2. COMPONENT: TASK CARD ---
const TaskCard = ({ task, index, onClick, isSelected }: { task: Task; index: number, onClick: () => void, isSelected: boolean }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}

          className="mb-2"
        >
          <Card
            className={cn(
              "cursor-pointer bg-[#1e1e1e] border-border/50 hover:border-primary/50 transition-all group relative rounded-lg shadow-sm box-border",
              snapshot.isDragging && "border-primary shadow-xl rotate-2 z-50 ring-1 ring-primary",
              isSelected && "border-blue-500 ring-1 ring-blue-500 bg-blue-500/5"
            )}
          >
            {/* FIX: Giảm padding tổng thể từ p-3 xuống p-2 */}
            <CardContent className="p-2">
              {/* Dòng 1: ID & Menu */}
              <div className="flex justify-between items-start mb-0.5">
                <span className="text-[9px] font-bold text-muted-foreground/70 hover:text-primary transition-colors">
                  {task.taskId}
                </span>
                <Button variant="ghost" size="icon" className="h-3.5 w-3.5 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>

              {/* Dòng 2: Title - FIX: leading-none (ép dòng chặt), mb-1 (giảm khoảng cách dưới) */}
              <div className="text-sm font-medium text-foreground leading-none mb-1 line-clamp-2">
                {task.title}
              </div>

              {/* Dòng 3: Metadata - FIX: mt-1 (giảm khoảng cách trên), gap-1 (giảm khoảng cách giữa các icon) */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Icon Status */}
                  <div className="flex items-center justify-center h-5 w-5 rounded bg-muted/30 border border-muted-foreground/20">
                    {(() => {
                      const Icon = columnsConfig[task.status].icon;
                      const color = columnsConfig[task.status].color;
                      return <Icon className={cn("h-3 w-3", color)} />;
                    })()}
                  </div>
                  {/* Icon Priority */}
                  <div className="flex items-center justify-center h-5 w-5 rounded bg-muted/30 border border-muted-foreground/20">
                    <PriorityIcon priority={task.priority} />
                  </div>
                </div>

                {/* Avatars */}
                <div className="flex -space-x-1.5">
                  {task.assignees.length > 0 ? (
                    task.assignees.map((mem, i) => (
                      <Avatar key={i} className="h-5 w-5 border border-background ring-1 ring-background">
                        {mem.avatar && <AvatarImage src={mem.avatar} />}
                        <AvatarFallback className="text-[8px] bg-primary/20 text-primary font-bold">{mem.name[0]}</AvatarFallback>
                      </Avatar>
                    ))
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-muted/30 border border-muted-foreground/20 flex items-center justify-center">
                      <User className="h-3 w-3 text-muted-foreground/50" />
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

// --- 3. COMPONENT: KANBAN COLUMN ---
const KanbanColumn = ({ columnId, config, tasks, onTaskClick, selectedTaskId }: { columnId: string, config: any, tasks: Task[], onTaskClick: (task: Task) => void, selectedTaskId: string | null }) => {
  return (
    <div className="flex flex-col h-full w-[320px] min-w-[320px] max-w-[320px] rounded-xl bg-background/50 border border-border/40 shrink-0 box-border">
      <div className="flex items-center justify-between p-3 shrink-0 border-b border-border/40">
        <div className="flex items-center gap-2">
          {config.icon && <config.icon className={cn("h-4 w-4", config.color)} />}
          <span className="text-sm font-semibold text-foreground">{config.title}</span>
          <span className="text-xs text-muted-foreground font-mono ml-1">{tasks.length}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 overflow-y-auto transition-colors pr-1",
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-600",
              snapshot.isDraggingOver ? "bg-muted/10" : ""
            )}
          >
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
            <Button variant="ghost" className="w-full justify-start text-muted-foreground/70 hover:text-foreground text-xs h-9 mt-1 hover:bg-muted/50">
              <Plus className="mr-2 h-3 w-3" /> Mục công việc mới
            </Button>
          </div>
        )}
      </Droppable>
    </div>
  );
};

// --- 4. COMPONENT: TASK DETAIL PANEL ---
const PropertyRow = ({ icon: Icon, label, value, isUser = false }: any) => (
  <div className="flex items-center h-9 group">
    <div className="w-[140px] flex items-center text-muted-foreground text-sm">
      <Icon className="h-4 w-4 mr-2 opacity-70" />
      {label}
    </div>
    <div className="flex-1 flex items-center text-sm">
      {isUser ? (
        <div className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded-md cursor-pointer transition-colors -ml-2">
          <Avatar className="h-5 w-5"><AvatarImage src={value.avatar} /><AvatarFallback>{value.name[0]}</AvatarFallback></Avatar>
          <span>{value.name}</span>
        </div>
      ) : (
        <div className="hover:bg-muted/50 px-2 py-1 rounded-md cursor-pointer transition-colors -ml-2 w-full truncate">
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
    <div className="h-full flex flex-col bg-[#121212] border-l border-border/40 overflow-hidden box-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-transparent border-muted-foreground/30 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div> {task.taskId}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><LinkIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Maximize2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">

        {/* ID & Title */}
        <div className="mb-6">
          <div className="text-xs font-mono text-muted-foreground mb-2">{task.taskId}</div>
          <h2 className="text-2xl font-bold leading-tight mb-4">{task.title}</h2>
          <div className="text-muted-foreground/50 text-sm italic hover:text-muted-foreground hover:bg-muted/20 p-2 -ml-2 rounded-md cursor-pointer transition-colors">
            Nhấp để thêm mô tả...
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-8">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-muted/10 border-muted-foreground/20"><Layout className="h-3.5 w-3.5 mr-2" /> Thêm mục con</Button>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-muted/10 border-muted-foreground/20"><GitBranch className="h-3.5 w-3.5 mr-2" /> Thêm quan hệ</Button>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-muted/10 border-muted-foreground/20"><Paperclip className="h-3.5 w-3.5 mr-2" /> Đính kèm</Button>
        </div>

        {/* Properties Section */}
        <div className="space-y-1 mb-8">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Thuộc tính</h3>

          <PropertyRow
            icon={StatusIcon}
            label="Trạng thái"
            value={<span className={cn("flex items-center gap-2", columnsConfig[task.status].color)}>{columnsConfig[task.status].title}</span>}
          />

          <PropertyRow
            icon={User}
            label="Người phụ trách"
            isUser
            value={task.assignees[0] || { name: 'Unassigned', avatar: '' }}
          />

          <PropertyRow
            icon={AlertCircle}
            label="Ưu tiên"
            value={<span className="capitalize">{task.priority}</span>}
          />

          <PropertyRow icon={User} label="Người tạo" isUser value={{name: 'manhb7536', avatar: ''}} />
          <PropertyRow icon={Calendar} label="Ngày bắt đầu" value="Thêm ngày bắt đầu" />
          <PropertyRow icon={Calendar} label="Ngày hết hạn" value={task.dueDate} />
          <PropertyRow icon={Clock} label="Ước tính" value="None" />
          <PropertyRow icon={Layout} label="Mô-đun" value="Không có mô-đun" />
          <PropertyRow icon={History} label="Chu kỳ" value="Không có chu kỳ" />
        </div>

        {/* Footer History Text */}
        <div className="text-xs text-muted-foreground mt-10 flex items-center gap-1">
          <History className="h-3 w-3" /> Chỉnh sửa lần cuối bởi manhb7536 about 11 hours ago
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
    // 👇 FIX QUAN TRỌNG: h-[calc(100vh-6rem)]
    // Trừ đi 6rem (khoảng 96px) để chắc chắn nó nằm gọn bên dưới Header của trang web.
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full bg-background/95 overflow-hidden rounded-lg border border-border/40 box-border">

      {/* Header Page */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 h-14 bg-card/50">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-primary">Batek</span> / Work Items
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 h-5 font-mono">71</Badge>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 shadow-sm transition-all">
            <Plus className="h-3 w-3 mr-1.5" /> Thêm công việc
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">

        {/* === PHẦN 1: KANBAN BOARD === */}
        <div className={cn(
          "flex flex-col h-full bg-muted/10 transition-all duration-300 ease-in-out border-r border-transparent box-border",
          selectedTask ? "w-1/2 border-border/40" : "w-full"
        )}>
          <div className="flex-1 min-h-0 relative">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className={cn(
                "absolute inset-0 overflow-x-auto overflow-y-hidden p-4",
                "[&::-webkit-scrollbar]:h-2",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-600"
              )}>
                <div className="flex h-full gap-4 min-w-max">
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

        {/* === PHẦN 2: PANEL CHI TIẾT === */}
        {selectedTask && (
          <div className="w-1/2 h-full flex flex-col overflow-hidden bg-background animate-in slide-in-from-right-10 duration-300 z-10 box-border border-l border-border/40">
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