import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import dbConnect from "@/lib/mongo";
import Attachment from "@/models/attachment.model";

export const dynamic = "force-dynamic";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await dbConnect();

        const { id } = await params;

        // 1) Lấy record file
        const fileRecord = await Attachment.findById(id);

        if (!fileRecord) {
            return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });
        }

        // Nếu bạn dùng soft delete
        if (fileRecord.isDeleted) {
            return NextResponse.json({ error: "File đã bị xóa" }, { status: 410 });
        }

        if (!fileRecord.path) {
            return NextResponse.json({ error: "Thiếu đường dẫn file" }, { status: 400 });
        }

        // 2) Resolve full path trên ổ đĩa
        // DB lưu "/attachments/xxx.ext" => full: <root>/public/attachments/xxx.ext
        const fullPath = path.join(process.cwd(), "public", fileRecord.path);

        // 3) Đọc file
        const fileBuffer = await fs.readFile(fullPath);

        // 4) Tên khi tải về
        const downloadName =
            (fileRecord.fileName as string) || path.basename(fullPath);

        const contentType =
            (fileRecord.type as string) || "application/octet-stream";

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${encodeURIComponent(
                    downloadName
                )}"`,
                "Content-Length": String(fileBuffer.length),
            },
        });
    } catch (err: any) {
        if (err?.code === "ENOENT") {
            return NextResponse.json(
                { error: "File vật lý không tồn tại" },
                { status: 404 }
            );
        }
        console.error("Download error:", err);
        return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
};
