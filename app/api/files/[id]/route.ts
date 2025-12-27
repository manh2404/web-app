import { NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises"; // Hàm unlink dùng để xóa file
import dbConnect from "@/lib/mongo";
import Attachment from "@/models/attachment.model";

// Hàm xử lý DELETE /api/files/:id
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Lấy ID từ URL
) => {
  try {
    await dbConnect();

    const { id } = await params;
    const fileId = id;

    // 1. Tìm file trong Database
    const fileRecord = await Attachment.findById(fileId);

    if (!fileRecord) {
      return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });
    }

    // 2. Xóa file vật lý trong ổ cứng (Nếu file đó chưa bị xóa trước đó)
    if (fileRecord.path) {
      // Đường dẫn đầy đủ: Thư mục gốc dự án + đường dẫn public + path trong DB
      // Lưu ý: Trong DB mình lưu là "/attachments/..." nên cần ghép cẩn thận
      const fullPath = path.join(process.cwd(), "public", fileRecord.path);

      try {
        await unlink(fullPath); // Lệnh xóa file thần thánh
        console.log(`Đã xóa file vật lý: ${fullPath}`);
      } catch (err) {
        console.warn("File vật lý không tìm thấy hoặc đã bị xóa:", err);
        // Vẫn cho qua để cập nhật DB, vì mục đích là xóa mà
      }
    }

    // 3. Cập nhật Database: Soft Delete (Đánh dấu đã xóa)
    // Thay vì dùng .deleteOne(), ta dùng .findByIdAndUpdate()
    fileRecord.isDeleted = true;
    // fileRecord.path = ""; // Xóa đường dẫn đi để web không load được nữa
    await fileRecord.save();

    return NextResponse.json({
      message: "Đã xóa file thành công (Soft Delete)",
      fileId: fileId
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi xóa file:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
};