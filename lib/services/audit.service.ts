import { headers } from "next/headers";
import dbConnect from "@/lib/mongo";
import Audit from "@/models/audit.model";
import { sendAuditMail, sendProjectMail } from "./mail.service";
import Project from "@/models/project.model";

type Actor = {
    id?: string;
    email?: string;
    role?: string;
};

type AuditInput = {
    actor?: Actor | null;
    action: string;
    resource?: string;
    resourceId?: string;

    before?: any;
    after?: any;

    projectId?: string;
    notifyProjectMembers?: boolean;
    workItemId?: string;

    success?: boolean;
    errorMessage?: string;

    method?: string;
    path?: string;
    requestId?: string;

    // email notify override
    notify?: boolean;
};

const SENSITIVE_KEYS = ["password", "passwordHash", "token", "accessToken", "refreshToken", "secret", "otp"];

function redact(obj: any): any {
    if (obj == null) return obj;
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(redact);
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
        const lower = k.toLowerCase();
        if (SENSITIVE_KEYS.some(s => lower.includes(s.toLowerCase()))) out[k] = "[REDACTED]";
        else out[k] = redact(v);
    }
    return out;
}

// throttle in-memory (dev) – đủ dùng nội bộ. Prod có thể chuyển Redis sau.
const lastSent: Record<string, number> = {};
function shouldThrottle(key: string) {
    const minutes = Number(process.env.AUDIT_MAIL_THROTTLE_MINUTES || 10);
    const now = Date.now();
    const prev = lastSent[key] || 0;
    if (now - prev < minutes * 60 * 1000) return true;
    lastSent[key] = now;
    return false;
}

// Quy tắc khi nào gửi mail (bạn có thể chỉnh)
function defaultShouldNotify(input: AuditInput) {
    if (input.notify === true) return true;
    if (input.notify === false) return false;

    const action = input.action;
    const success = input.success !== false;

    // Notify khi thất bại / denied / đổi role / delete
    if (!success) return true;
    if (action === "ACCESS_DENIED") return true;
    if (action === "CHANGE_ROLE") return true;
    if (action.includes("DELETE")) return true;

    return false;
}

export async function auditLog(input: AuditInput) {
    try {
        await dbConnect();

        const h = await headers();
        const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
        const userAgent = h.get("user-agent") || "";

        const doc = await Audit.create({
            projectId: input.projectId,
            userId: input.actor?.id,
            email: input.actor?.email,
            role: input.actor?.role,

            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId,

            before: redact(input.before),
            after: redact(input.after),

            method: input.method,
            path: input.path,
            ip,
            userAgent,

            success: input.success !== false,
            errorMessage: input.errorMessage,
            requestId: input.requestId,
        });

        // Email notify (không làm chết luồng)
        if (defaultShouldNotify(input)) {
            const key = `${input.action}:${input.actor?.email || "anon"}`;
            if (!shouldThrottle(key)) {
                const subject = `[AUDIT] ${input.action} ${input.success === false ? "FAILED" : ""}`.trim();
                const text =
                    `Action: ${input.action}\n` +
                    `Success: ${input.success !== false}\n` +
                    `User: ${input.actor?.email || "anonymous"} (${input.actor?.role || "-"})\n` +
                    `Path: ${input.path || "-"}\n` +
                    `Method: ${input.method || "-"}\n` +
                    `IP: ${ip}\n` +
                    `UA: ${userAgent}\n` +
                    (input.errorMessage ? `Error: ${input.errorMessage}\n` : "") +
                    `AuditId: ${doc._id}\n` +
                    `Time: ${new Date().toISOString()}\n`;
                await sendAuditMail(subject, text);
                if (input.notifyProjectMembers && input.projectId) {
                    try {
                        const project = await Project.findById(input.projectId).lean();

                        const emails: string[] =
                            project?.members?.map((m: any) => m.email).filter(Boolean) || [];

                        const to = emails.filter((e) => e !== input.actor?.email);
                        if (!to.length) return;

                        const key = `project:${input.projectId}:${input.action}`;
                        if (shouldThrottle(key)) return;

                        const subject = `[PROJECT] ${input.action}`;
                        const text =
                            `User: ${input.actor?.email || "anonymous"}\n` +
                            `Action: ${input.action}\n` +
                            `Resource: ${input.resource || "-"} ${input.resourceId || ""}\n` +
                            `Time: ${new Date().toISOString()}\n`;

                        await sendProjectMail(to, subject, text);
                    } catch {
                        // ignore
                    }
                }
            }
        }
    } catch {
        // tuyệt đối không throw để không làm chết nghiệp vụ
    }
}
