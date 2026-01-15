// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, isExpired } from "@/lib/services/jwt.service";

const COOKIE_NAME = "accessToken";

// Bạn chỉnh theo route thực tế của bạn:
const PROTECTED_PREFIXES = ["/control", "/admin"]; // ví dụ: trang quản trị nằm trong /control và /admin
const ADMIN_PREFIXES = ["/admin"]; // chỉ /admin yêu cầu role admin

function isProtected(pathname: string) {
    return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAdminPath(pathname: string) {
    return ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function redirectTo(req: NextRequest, pathname: string) {
    const url = req.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Bỏ qua assets và api
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/assets")
    ) {
        return NextResponse.next();
    }

    // Nếu không phải path protected => cho qua
    if (!isProtected(pathname)) return NextResponse.next();

    // 1) Check token cookie
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        // Chưa login -> đá về /login, kèm next để quay lại
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    // 2) Decode token để đọc roles/exp
    const payload = decodeJwt(token);
    if (!payload || isExpired(payload)) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    // 3) Chặn /admin nếu không có role admin
    if (isAdminPath(pathname)) {
        const roles = Array.isArray(payload.roles) ? payload.roles : [];
        if (!roles.includes("admin")) {
            return redirectTo(req, "/403");
        }
    }

    return NextResponse.next();
}

/**
 * matcher: middleware chạy cho mọi route trừ static assets.
 * Bạn có thể thu hẹp matcher để tối ưu, nhưng cấu hình này an toàn.
 */
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
