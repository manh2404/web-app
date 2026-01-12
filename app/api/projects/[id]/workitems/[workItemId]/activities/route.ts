import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import WorkItem from "@/models/work-item.model"; // nếu bạn lưu activities trong WorkItem
// hoặc Activity model riêng nếu bạn có

export const dynamic = "force-dynamic";

/**
 * OPTION 1 (nhanh nhất): lưu activities trong WorkItem.activities (array)
 * Nếu WorkItem chưa có field này thì bạn cần thêm schema (tôi sẽ đưa nếu bạn paste work-item.model.ts)
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; workItemId: string }> }
) {
    await dbConnect();
    const { workItemId } = await params;

    const wi = await WorkItem.findById(workItemId).lean();
    const activities = (wi as any)?.activities || [];

    return NextResponse.json({ data: activities });
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; workItemId: string }> }
) {
    await dbConnect();
    const { workItemId } = await params;

    const body = await req.json(); // { type, content, user? }

    const activity = {
        id: String(Date.now()),
        type: body.type || "comment",
        user: body.user || { name: "System" },
        content: body.content || "",
        timestamp: new Date(),
    };

    await WorkItem.findByIdAndUpdate(
        workItemId,
        { $push: { activities: activity } },
        { new: true }
    );

    return NextResponse.json({ data: activity }, { status: 201 });
}
