  import { NextResponse } from "next/server";
  import path from "path";
  import { unlink } from "fs/promises";
  import dbConnect from "@/lib/mongo";
  import Attachment from "@/models/attachment.model";

  export const DELETE = async (
      req: Request,
      { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      await dbConnect();
      const { id } = await params;

      const fileRecord = await Attachment.findById(id);
      if (!fileRecord) return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });

      if (fileRecord.path) {
        const relPath = String(fileRecord.path).replace(/^\/+/, "");
        const fullPath = path.join(process.cwd(), "public", relPath);

        try {
          await unlink(fullPath);
        } catch (err) {
          console.warn("File vật lý không tìm thấy hoặc đã bị xóa:", err);
        }
      }

      fileRecord.isDeleted = true;
      await fileRecord.save();

      return NextResponse.json({ message: "Đã xóa file thành công (Soft Delete)", fileId: id }, { status: 200 });
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
      return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
  };
