import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';
import mongoose from 'mongoose';
import Project from '@/models/project.model';
import User from '@/models/user.model'; // [QUAN TRỌNG] Phải import User để populate hoạt động

// Bắt buộc API này chạy động để luôn lấy dữ liệu mới nhất
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Kết nối DB
    await connectToDatabase();

    // 2. Gọi nhẹ model User để đảm bảo nó đã được init (tránh lỗi "Schema hasn't been registered")
    // Không cần làm gì cả, chỉ cần import ở trên là đủ, nhưng cẩn thận thì log ra 1 cái
    if (!mongoose.models.User) {
      console.log("⚠️ Model User chưa được load, đang init...");
      // Dòng này chỉ để trigger việc load file model nếu cần
      new User({});
    }

    // 3. Query
    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .populate('manager', 'firstname lastname email'); // Populate cần model User đã tồn tại

    return NextResponse.json(projects);

  } catch (error: any) {
    // [QUAN TRỌNG] In lỗi ra Terminal để biết chính xác bị gì
    console.error("❌ Lỗi SERVER API Projects:", error);

    return NextResponse.json(
      { error: error.message || "Lỗi Server Internal" },
      { status: 500 }
    );
  }
}