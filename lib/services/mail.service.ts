import nodemailer from "nodemailer";

const enabled = (process.env.AUDIT_MAIL_ENABLED || "false") === "true";

export async function sendAuditMail(subject: string, text: string) {
    if (!enabled) return;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.AUDIT_MAIL_FROM || user;
    const to = process.env.AUDIT_MAIL_TO;

    if (!host || !user || !pass || !to) {
        // Thiếu config thì không gửi (tránh làm chết luồng)
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
}
