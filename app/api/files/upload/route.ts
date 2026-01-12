import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import dbConnect from "@/lib/mongo";
import Attachment from "@/models/attachment.model";
import mongoose from "mongoose";

export const runtime = "nodejs";        // ✅ DỨT ĐIỂM parse multipart
export const dynamic = "force-dynamic";

const MAX_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXT = new Set([
  "doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf",
  "png", "jpg", "jpeg", "webp", "txt",
]);

function getExt(name: string) {
  const p = name.split(".");
  return (p.length > 1 ? p[p.length - 1] : "").toLowerCase();
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    console.log("CT:", ct);
    console.log("CL:", req.headers.get("content-length"));

    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json(
          { error: "Request phải là multipart/form-data" },
          { status: 400 }
      );
    }

    // ✅ Sau khi ép runtime=nodejs, đoạn này sẽ parse ổn
    const formData = await req.formData();

    const file = formData.get("file");
    const projectId = String(formData.get("projectId") || "").trim();
    const workItemId = String(formData.get("workItemId") || "").trim();

    if (!projectId || !workItemId) {
      return NextResponse.json({ error: "Thiếu projectId hoặc workItemId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(workItemId)) {
      return NextResponse.json({ error: "projectId/workItemId không hợp lệ" }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Không có file hoặc file lỗi" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File quá lớn (tối đa ${MAX_SIZE / 1024 / 1024}MB)` }, { status: 413 });
    }

    const ext = getExt(file.name);
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: `Không hỗ trợ định dạng .${ext || "unknown"}` }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeOriginalName = file.name.replaceAll(" ", "_").replace(/[^\w.\-()]/g, "");
    const filename = `${Date.now()}_${safeOriginalName}`;

    const relativeUploadDir = "uploads_attachments";
    const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, filename), buffer);

    await dbConnect();

    const newAttachment = await Attachment.create({
      projectId: new mongoose.Types.ObjectId(projectId),
      workItemId: new mongoose.Types.ObjectId(workItemId),
      fileName: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      path: `${relativeUploadDir}/${filename}`,
    });

    return NextResponse.json(
        {
          message: "Upload thành công!",
          data: {
            ...newAttachment.toObject(),
            downloadUrl: `/api/files/${newAttachment._id}/download`,
          },
        },
        { status: 201 }
    );
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
        { error: "Lỗi Server", detail: String(err?.message || err) },
        { status: 500 }
    );
  }
}