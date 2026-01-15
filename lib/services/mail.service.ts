// lib/services/mail.service.ts
import nodemailer from "nodemailer";

const ENABLED = (process.env.AUDIT_MAIL_ENABLED || "false") === "true";

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.AUDIT_MAIL_FROM || USER;
const AUDIT_TO = process.env.AUDIT_MAIL_TO;

/**
 * Tạo transporter dùng chung
 */
function createTransporter() {
    if (!HOST || !USER || !PASS) return null;

    return nodemailer.createTransport({
        host: HOST,
        port: PORT,
        secure: PORT === 465,
        auth: { user: USER, pass: PASS },
    });
}

/**
 * 1) Mail AUDIT (admin / security)
 */
export async function sendAuditMail(subject: string, text: string): Promise<void> {
    try {
        if (!ENABLED) return;
        if (!AUDIT_TO) return;

        const transporter = createTransporter();
        if (!transporter) return;

        await transporter.sendMail({
            from: FROM,
            to: AUDIT_TO,
            subject,
            text,
        });
    } catch {
        // tuyệt đối không throw
    }
}

/**
 * 2) Mail cho MEMBERS của PROJECT (TEXT)
 */
export async function sendProjectMail(
    to: string[],
    subject: string,
    text: string
): Promise<void> {
    try {
        if (!ENABLED) return;
        if (!to || to.length === 0) return;

        const transporter = createTransporter();
        if (!transporter) return;

        await transporter.sendMail({
            from: FROM,
            to: to.join(","),
            subject,
            text,
        });
    } catch {
        // không throw
    }
}
