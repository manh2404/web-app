// lib/services/jwt.service.ts

export type JwtPayload = {
    // standard-ish
    sub?: string;
    exp?: number;
    iat?: number;

    // common app fields
    _id?: string;
    id?: string;
    userId?: string;

    // roles variants
    roles?: string[];
    role?: string;

    // allow extra fields
    [key: string]: any;
};

function base64UrlToUtf8(input: string): string {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad) input += "=".repeat(4 - pad);

    // Buffer works in Node runtime. If you ever run on Edge runtime, use atob fallback.
    if (typeof Buffer !== "undefined") {
        return Buffer.from(input, "base64").toString("utf-8");
    }

    // Edge/browser fallback (rare in server code, but safe)
    // eslint-disable-next-line no-undef
    return decodeURIComponent(
        // eslint-disable-next-line no-undef
        Array.prototype.map
            .call(atob(input), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
}

export function decodeJwt(token: string): JwtPayload | null {
    try {
        if (!token) return null;
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const payloadJson = base64UrlToUtf8(parts[1]);
        const payload = JSON.parse(payloadJson);

        if (!payload || typeof payload !== "object") return null;
        return payload as JwtPayload;
    } catch {
        return null;
    }
}

export function isExpired(payload: JwtPayload | null): boolean {
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
}


export function getUserIdFromPayload(payload: JwtPayload | null): string | null {
    if (!payload) return null;

    const id =
        payload.sub ||
        payload.userId ||
        payload.id ||
        payload._id;

    if (!id) return null;
    return String(id);
}


export function getRolesFromPayload(payload: JwtPayload | null): string[] {
    if (!payload) return [];

    // roles: string[]
    if (Array.isArray(payload.roles)) {
        return Array.from(
            new Set(
                payload.roles
                    .map((r) => String(r).trim().toLowerCase())
                    .filter(Boolean)
            )
        );
    }

    // role: string
    if (payload.role) {
        const r = String(payload.role).trim().toLowerCase();
        return r ? [r] : [];
    }

    return [];
}
