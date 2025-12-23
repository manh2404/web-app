// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Staff from '@/models/user.model';

// PUT: Cập nhật thông tin (bao gồm cả phân quyền Roles)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();

  try {
    // Nếu có update password thì cần xử lý mã hóa lại (logic này nếu cần kỹ hơn thì tách riêng)
    // Ở đây tớ dùng findByIdAndUpdate cho nhanh, nhưng nếu update pass thì nên dùng find -> save

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { $set: body }, // Update các trường gửi lên (ví dụ: roles: ['prj-crm'])
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedStaff) {
      return NextResponse.json({ error: 'Không tìm thấy nhân viên' }, { status: 404 });
    }

    return NextResponse.json(updatedStaff);
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

// DELETE: Xóa nhân viên
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    await Staff.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Đã xóa nhân viên' });
  } catch {
    return NextResponse.json({ error: 'Lỗi xóa' }, { status: 500 });
  }
}