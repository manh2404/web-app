import { NextResponse } from "next/server";
import { sendAuditMail } from "@/lib/services/mail.service";

export async function GET() {
    await sendAuditMail(
        "TEST AUDIT EMAIL",
        "Nếu bạn nhận được mail này, cấu hình SMTP OK"
    );

    return NextResponse.json({ ok: true, message: "Mail sent" });
}
