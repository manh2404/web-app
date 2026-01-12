import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';
import WorkItem from '@/models/work-item.model';
import Project from '@/models/project.model';


const normalizeStatus = (status: string) => {
  const map: Record<string, string> = {
    'todo': 'Todo',
    'backlog': 'Backlog',
    'in_progress': 'In Progress',
    'done': 'Done',
    'canceled': 'Cancel',
    'cancel': 'Cancel',
  };

  return map[status.toLowerCase()] || 'Todo';
};

const toFrontendStatus = (status: string) => {
  const map: Record<string, string> = {
    'Todo': 'todo',
    'Backlog': 'backlog',
    'In Progress': 'in_progress',
    'Done': 'done',
    'Cancel': 'canceled',
  };

  return map[status] || 'todo';
};

// 1. GET: Lấy danh sách Task
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Fix Next.js 15: params là Promise
) {
  try {
    await connectToDatabase();
    const { id } = await params; // Await params

    const tasks = await WorkItem.find({ project: id })
      .populate('assignee', 'firstname lastname email')
      .sort({ createdAt: -1 });

    // Trả về dữ liệu đã được map ngược lại status code cho frontend (nếu cần)
    // Nhưng frontend của cậu đang dùng string match nên cứ trả về nguyên gốc
    const formattedTasks = tasks.map(t => ({
      ...t.toObject(),
      // Frontend đang dùng ID dạng 'todo', 'in_progress' để chia cột
      // Nên ta convert ngược lại từ DB 'Todo' -> 'todo' để frontend hiển thị đúng cột
      status: t.status === 'In Progress' ? 'in_progress' :
        t.status === 'Cancel' ? 'canceled' :
          t.status.toLowerCase()
    }));

    return NextResponse.json(formattedTasks);
  } catch (error: any) {
    console.error("❌ Lỗi GET Tasks:", error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// 2. POST: Tạo Task mới
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Fix Next.js 15
) {
  try {
    await connectToDatabase();
    const { id: projectId } = await params;
    const body = await req.json();

    if (body.startDate && body.dueDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.dueDate);

      if (start > end) {
        return NextResponse.json(
          { error: 'Ngày kết thúc không được trước ngày bắt đầu' },
          { status: 400 }
        );
      }
    }


    // 1. Tìm Project để lấy Key & TaskCount
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Tăng bộ đếm TaskCount
    // Nếu project cũ chưa có taskCount, mặc định là 0
    const currentCount = project.taskCount || 0;
    const newCount = currentCount + 1;

    // 3. Tạo ID task (Ví dụ: WEB-1, WEB-2)
    // Nếu project chưa có Key, tự sinh tạm từ title
    const projectKey = project.key || project.title.substring(0, 3).toUpperCase();
    const newTaskId = `${projectKey}-${newCount}`;

    // 4. Chuẩn hóa dữ liệu trước khi lưu
    // Frontend gửi 'todo', DB cần 'Todo'
    const dbStatus = normalizeStatus(body.status || 'todo');

    // Frontend gửi 'Medium', DB cần 'Medium' (Khớp rồi, nhưng cứ capitalize cho chắc)
    const dbPriority = body.priority ?
      (body.priority.charAt(0).toUpperCase() + body.priority.slice(1).toLowerCase()) : 'Medium';

    // 5. Tạo Task
    const newTask = await WorkItem.create({
      title: body.title,
      description: body.description || '',
      priority: dbPriority,
      status: dbStatus,
      project: projectId,
      taskId: newTaskId,
      startDate: body.startDate,
      dueDate: body.dueDate,
      assignee: body.assignee || null
    });

    // 6. Cập nhật lại số đếm cho Project
    await Project.findByIdAndUpdate(projectId, { taskCount: newCount });

    // 7. Trả về task với format status mà Frontend hiểu ('todo' thay vì 'Todo')
    const responseTask = {
      ...newTask.toObject(),
      status: body.status, // Trả lại đúng status mà frontend vừa gửi lên để nó tự update UI
      endDate: newTask.dueDate,
      importance: body.priority
    };

    return NextResponse.json(responseTask);

  } catch (error: any) {
    console.error("❌ Lỗi TẠO TASK:", error); // Quan trọng: Xem lỗi chi tiết ở Terminal
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}

// 3. PATCH: Edit task (update full fields)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: projectId } = await params;
    const body = await req.json();

    const { workItemId, ...fields } = body;

    if (!workItemId) {
      return NextResponse.json(
        { error: 'Missing workItemId' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    // xử lý động từng field
    for (const key in fields) {
      const value = fields[key];

      if (key === 'status') {
        updateData.status = normalizeStatus(value);
      } else if (key === 'priority' && value) {
        updateData.priority =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      } else if (key === 'assignee') {
        updateData.assignee = value || null;
      } else {
        updateData[key] = value;
      }
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    if (updateData.startDate && updateData.dueDate) {
      const start = new Date(updateData.startDate);
      const end = new Date(updateData.dueDate);

      if (start > end) {
        return NextResponse.json(
          { error: 'Ngày kết thúc không được trước ngày bắt đầu' },
          { status: 400 }
        );
      }
    }


    const updatedTask = await WorkItem.findOneAndUpdate(
      { _id: workItemId, project: projectId },
      { $set: updateData },
      { new: true }
    ).populate('assignee', 'firstname lastname email');

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const obj = updatedTask.toObject();

    return NextResponse.json({
      ...obj,
      status: toFrontendStatus(obj.status),
      endDate: obj.dueDate
    });

  } catch (error: any) {
    console.error("❌ Lỗi PATCH TASK:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}
