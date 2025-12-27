import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises"; // Thêm mkdir để tạo thư mục nếu chưa có
import dbConnect from "@/lib/mongo"; // Đảm bảo đường dẫn này đúng với dự án của bạn
import Attachment from "@/models/attachment.model"; // Import đúng file vừa tạo

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Không có file hoặc file lỗi" }, { status: 400 });
    }

    // 1. Tạo buffer từ file
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Tạo tên file duy nhất (timestamp + tên gốc bỏ dấu cách)
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

    // 3. Đường dẫn lưu trữ: public/attachments
    // process.cwd() lấy thư mục gốc dự án
    const relativeUploadDir = "/attachments";
    const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);

    // Tạo thư mục nếu chưa có (để tránh lỗi thư mục không tồn tại)
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Bỏ qua nếu thư mục đã tồn tại
    }

    // Ghi file vào ổ cứng
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 4. Lưu Metadata vào Database
    await dbConnect();

    const newAttachment = await Attachment.create({
      fileName: file.name,
      size: file.size,
      type: file.type,
      path: `${relativeUploadDir}/${filename}`, // Lưu đường dẫn tương đối để web hiển thị được
      // updateBy: ... (Chờ có xác thực user thì điền sau)
    });

    return NextResponse.json({
      message: "Upload thành công!",
      data: newAttachment
    }, { status: 201 });

  } catch (error) {
    console.error("Lỗi upload:", error); // Dùng console.error cho dễ nhìn lỗi
    return NextResponse.json({ error: "Lỗi Server rồi T^T" }, { status: 500 });
  }
};