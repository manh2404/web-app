import { NextResponse } from "next/server";
import { auditLog } from "@/lib/services/audit.service";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
    const me = await getAuthUser();
    const actor = me ? { id: me.id, email: me.email, role: me.role } : null;
    const path = new URL(req.url).pathname;

    // cố tình tạo một audit thất bại để trigger mail
    await auditLog({
        actor,
        action: "AUDIT_NOTIFY_TEST",
        resource: "system",
        success: false,
        errorMessage: "This is a test event to verify email notification",
        method: "GET",
        path,
        notify: true, // ép gửi
    });

    return NextResponse.json({ ok: true, message: "Audit notify test triggered" });
}
