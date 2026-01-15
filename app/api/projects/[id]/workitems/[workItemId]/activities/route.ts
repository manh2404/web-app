import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Activity from "@/models/activity.model";

import { getAuthUser, requireAuth } from "@/lib/auth"; // ✅ dùng auth của bạn

type Params = { id: string; workItemId: string };
type Ctx = { params: Promise<Params> };

export async function POST(req: Request, ctx: Ctx) {
    try {
        await dbConnect();

        // ✅ Next.js mới: params phải await
        const { id: projectId, workItemId } = await ctx.params;

        const body = await req.json().catch(() => ({}));

        if (!projectId || !workItemId) {
            return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
        }

        if (!body?.content) {
            return NextResponse.json({ ok: false, error: "Missing content" }, { status: 400 });
        }

        // ✅ LẤY USER THẬT TỪ COOKIE JWT
        const user = await getAuthUser();
        try {
            requireAuth(user); // nếu null -> throw "UNAUTHORIZED"
        } catch {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        // ✅ actor bắt buộc id + name
        const actor = {
            id: user.id,
            name: user.email || "User", // bạn chỉ có email trong AuthUser, nên dùng email làm tên
            email: user.email || "",
        };

        const doc = await Activity.create({
            projectId,
            workItemId,
            type: body?.type || "comment",
            actor,
            content: body.content,
            meta: body.meta || {},
        });

        return NextResponse.json({
            ok: true,
            data: {
                id: String(doc._id),
                type: doc.type,
                actor: doc.actor,
                content: doc.content,
                createdAt: doc.createdAt,
            },
        });
    } catch (err: any) {
        // Nếu requireAuth throw ra UNAUTHORIZED mà bạn không catch ở trên
        if (err?.message === "UNAUTHORIZED") {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        console.error("POST /activities error:", err?.message, err);
        return NextResponse.json(
            { ok: false, error: err?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
export async function GET(req: Request, ctx: Ctx) {
    try {
        await dbConnect();

        const { id: projectId, workItemId } = await ctx.params;

        // (tuỳ bạn) bắt login mới xem activity
        const user = await getAuthUser();
        try {
            requireAuth(user);
        } catch {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const items = await Activity.find({ projectId, workItemId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ ok: true, data: items });
    } catch (err: any) {
        console.error("GET /activities error:", err?.message, err);
        return NextResponse.json(
            { ok: false, error: err?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
