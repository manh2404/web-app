import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import WorkItem from "@/models/work-item.model";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { pushWorkItemActivity } from "@/lib/services/workitem-activity.service";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/:id/workitems/:workItemId
 * Lấy chi tiết workitem
 */
export async function GET(
    req: Request,
    { params }: { params: { id: string; workItemId: string } }
) {
    const me = await getAuthUser();
    requireAuth(me);

    await dbConnect();

    const wi = await WorkItem.findById(params.workItemId).lean();
    if (!wi) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    // Optional: đảm bảo workitem thuộc projectId trên url
    if (String((wi as any).projectId) !== String(params.id)) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: wi });
}

/**
 * PATCH /api/projects/:id/workitems/:workItemId
 * Update workitem + tự ghi activities khi có thay đổi
 *
 * Body có thể gửi:
 * { title?, description?, status?, assigneeId? }
 */
export async function PATCH(
    req: Request,
    { params }: { params: { id: string; workItemId: string } }
) {
    const me = await getAuthUser();
    requireAuth(me);

    await dbConnect();

    const body: any = await req.json();

    const wi = await WorkItem.findById(params.workItemId);
    if (!wi) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    // Optional: đảm bảo workitem thuộc projectId trên url
    if (String((wi as any).projectId) !== String(params.id)) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const meAny = me as any;
    const actor = {
        id: String(meAny._id ?? meAny.id ?? ""),
        name: meAny.name ?? meAny.email ?? "User",
        email: meAny.email ?? "",
    };

    // Lưu before để ghi activity
    const before = {
        title: (wi as any).title,
        description: (wi as any).description,
        status: (wi as any).status,
        assigneeId: (wi as any).assigneeId,
    };

    let changed = false;

    // Update fields (nếu có)
    if (typeof body.title === "string" && body.title !== (wi as any).title) {
        (wi as any).title = body.title;
        changed = true;
    }

    if (
        typeof body.description === "string" &&
        body.description !== (wi as any).description
    ) {
        (wi as any).description = body.description;
        changed = true;
    }

    const statusChanged =
        typeof body.status === "string" && body.status !== (wi as any).status;
    if (statusChanged) {
        (wi as any).status = body.status;
        changed = true;
    }

    const assigneeChanged =
        typeof body.assigneeId === "string" &&
        String(body.assigneeId) !== String((wi as any).assigneeId ?? "");
    if (assigneeChanged) {
        (wi as any).assigneeId = body.assigneeId;
        changed = true;
    }

    if (!changed) {
        // không đổi gì -> trả về luôn, không ghi activity
        return NextResponse.json({ ok: true, data: wi });
    }

    await wi.save();

    const after = {
        title: (wi as any).title,
        description: (wi as any).description,
        status: (wi as any).status,
        assigneeId: (wi as any).assigneeId,
    };

    // Ghi activity theo loại thay đổi (ưu tiên status/assign)
    if (statusChanged) {
        await pushWorkItemActivity({
            workItemId: String((wi as any)._id),
            type: "status_changed",
            actor,
            content: `đã chuyển trạng thái sang ${(wi as any).status}`,
            meta: { before: { status: before.status }, after: { status: after.status } },
        });
    }

    if (assigneeChanged) {
        await pushWorkItemActivity({
            workItemId: String((wi as any)._id),
            type: "assigned",
            actor,
            content: `đã gán công việc`,
            meta: {
                before: { assigneeId: before.assigneeId },
                after: { assigneeId: after.assigneeId },
            },
        });
    }

    // Nếu còn thay đổi khác (title/description) thì ghi updated
    const otherChanged =
        before.title !== after.title || before.description !== after.description;

    if (otherChanged) {
        await pushWorkItemActivity({
            workItemId: String((wi as any)._id),
            type: "updated",
            actor,
            content: `đã cập nhật công việc`,
            meta: { before, after },
        });
    }

    return NextResponse.json({ ok: true, data: wi });
}

/**
 * DELETE /api/projects/:id/workitems/:workItemId
 */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string; workItemId: string } }
) {
    const me = await getAuthUser();
    requireAuth(me);

    await dbConnect();

    const wi = await WorkItem.findById(params.workItemId);
    if (!wi) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    if (String((wi as any).projectId) !== String(params.id)) {
        return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    // (Tuỳ bạn) ghi activity trước khi xoá
    const meAny = me as any;
    await pushWorkItemActivity({
        workItemId: String((wi as any)._id),
        type: "updated",
        actor: {
            id: String(meAny._id ?? meAny.id ?? ""),
            name: meAny.name ?? meAny.email ?? "User",
            email: meAny.email ?? "",
        },
        content: `đã xoá công việc`,
        meta: { title: (wi as any).title },
    });

    await WorkItem.findByIdAndDelete(params.workItemId);

    return NextResponse.json({ ok: true });
}

