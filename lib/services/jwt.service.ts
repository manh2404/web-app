// lib/jwt.ts
export type JwtPayload = {
    roles?: string[];
    exp?: number;
    [key: string]: any;
};

function base64UrlToString(input: string) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad) input += "=".repeat(4 - pad);
    return Buffer.from(input, "base64").toString("utf-8");
}

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const payloadJson = base64UrlToString(parts[1]);
        return JSON.parse(payloadJson);
    } catch {
        return null;
    }
}

export function isExpired(payload: JwtPayload | null) {
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
}
