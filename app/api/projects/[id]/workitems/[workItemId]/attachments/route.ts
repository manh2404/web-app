import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Attachment from "@/models/attachment.model";

export const dynamic = "force-dynamic";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; workItemId: string }> }
) {

    await dbConnect();
    const { id: projectId, workItemId } = await params;

    const files = await Attachment.find({ projectId, workItemId, isDeleted: false })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json({
        data: files.map((f: any) => ({
            ...f,
            downloadUrl: `/api/files/${f._id}/download`,
        })),
    });
}
