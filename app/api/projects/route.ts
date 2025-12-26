import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo'; // Đảm bảo đường dẫn này đúng với file bạn vừa sửa
import mongoose from 'mongoose';

export async function GET(equest: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // 1. Tạo hoặc lấy Model (Sửa tên collection của bạn ở đây)
    const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({
      title: String,
      description: String,
      status: String,
      dueDate: String,
      members: Array
    }));

    // 2. Lấy dữ liệu từ MongoDB
    const projects = await Project.find({});

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}