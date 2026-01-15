// lib/services/workitem-activity.service.ts
import dbConnect from "@/lib/mongo";
import Activity, { ActivityType } from "@/models/activity.model";
import WorkItem from "@/models/work-item.model";
import Project from "@/models/project.model";
import User from "@/models/user.model";
import { sendProjectMail } from "@/lib/services/mail.service";

type Actor = { id: string; name: string; email?: string };

type LogActivityInput = {
    projectId: string;
    workItemId: string;
    type: ActivityType;
    actor: Actor;
    content: string; // có thể html nhưng mình sẽ strip để gửi text
    meta?: Record<string, any>;
};

function stripHtml(html: string) {
    return (html || "").replace(/<[^>]*>?/gm, "").trim();
}

type UserEmail = { email?: string };

async function resolveRecipients(projectId: string, workItemId: string) {
    const [project, workItem] = await Promise.all([
        Project.findById(projectId).lean<any>(),
        WorkItem.findById(workItemId).lean<any>(),
    ]);

    const emails = new Set<string>();

    // assignee
    if (workItem?.assignee) {
        const assignee = await User.findById(workItem.assignee).select("email").lean<UserEmail>();
        if (assignee?.email) emails.add(assignee.email);
    }

    // creator
    if (workItem?.creator) {
        const creator = await User.findById(workItem.creator).select("email").lean<UserEmail>();
        if (creator?.email) emails.add(creator.email);
    }

    // project members (tuỳ schema)
    const memberIds: any[] = project?.members || project?.users || project?.memberIds || [];

    if (Array.isArray(memberIds) && memberIds.length) {
        const members = await User.find({ _id: { $in: memberIds } })
            .select("email")
            .lean<UserEmail[]>();

        members.forEach((m) => {
            if (m.email) emails.add(m.email);
        });
    }

    return {
        project,
        workItem,
        to: Array.from(emails).filter(Boolean),
    };
}

function renderEmailSubject(type: ActivityType, wi: any) {
    const key = wi?.taskId ? `[${wi.taskId}]` : "[WorkItem]";
    switch (type) {
        case "comment":
            return `${key} Có bình luận mới`;
        case "state":
            return `${key} Đã đổi trạng thái`;
        case "assign":
            return `${key} Đã đổi người phụ trách`;
        case "create":
            return `${key} Công việc mới được tạo`;
        default:
            return `${key} Có hoạt động mới`;
    }
}

/**
 * ✅ TEXT mail body
 */
function renderEmailText(input: LogActivityInput, project: any, wi: any) {
    const projectName = project?.name || "Project";
    const title = wi?.title || "(no title)";
    const actorName = input.actor?.name || "Someone";
    const contentText = stripHtml(input.content);

    let extra = "";
    if (input.type === "state" && input.meta) {
        extra = `Trạng thái: ${input.meta.from ?? "—"} -> ${input.meta.to ?? "—"}`;
    } else if (input.type === "assign" && input.meta) {
        extra = `Assignee: ${input.meta.fromName ?? "—"} -> ${input.meta.toName ?? "—"}`;
    }

    const lines = [
        `${projectName} — ${title}`,
        `${actorName} vừa thực hiện: ${input.type}`,
        extra ? extra : "",
        "",
        "Nội dung:",
        contentText || "(trống)",
    ].filter(Boolean);

    return lines.join("\n");
}

export async function logActivity(input: LogActivityInput) {
    await dbConnect();

    // 1) lưu DB
    const created = await Activity.create({
        projectId: input.projectId,
        workItemId: input.workItemId,
        type: input.type,
        actor: {
            id: input.actor.id,
            name: input.actor.name,
            email: input.actor.email,
        },
        content: input.content,
        meta: input.meta || {},
    });

    // 2) gửi mail
    const { project, workItem, to } = await resolveRecipients(input.projectId, input.workItemId);

    // tránh gửi cho chính người thực hiện (tuỳ bạn)
    const filteredTo = to.filter((e) => e && e !== input.actor.email);

    if (filteredTo.length) {
        const subject = renderEmailSubject(input.type, workItem);
        const text = renderEmailText(input, project, workItem);

        // ✅ FIX TS2554: truyền đúng 3 tham số
        await sendProjectMail(filteredTo, subject, text);
    }

    return created.toObject();
}
