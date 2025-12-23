// app/api/users/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Staff from '@/models/user.model';

// GET: Lấy danh sách tất cả nhân viên
export async function GET() {
  await connectDB();
  try {
    const staffs = await Staff.find({}).select('-password'); // Không trả về password
    return NextResponse.json(staffs);
  } catch {
    return NextResponse.json({ error: 'Lỗi lấy dữ liệu' }, { status: 500 });
  }
}

// POST: Tạo nhân viên mới
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();

    // Kiểm tra xem phone đã tồn tại chưa
    const exist = await Staff.findOne({ phone: body.phone });
    if (exist) {
      return NextResponse.json({ error: 'Số điện thoại đã tồn tại' }, { status: 400 });
    }

    const newStaff = new Staff(body);
    await newStaff.save();

    return NextResponse.json({ message: 'Tạo thành công', staff: newStaff }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi tạo nhân viên' }, { status: 500 });
  }
}