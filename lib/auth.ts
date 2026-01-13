// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongo";
import User from "@/models/user.model";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "accessToken";

// ⚠️ Không throw ở top-level để tránh làm chết page/layout khi thiếu env.
// Nếu thiếu JWT_SECRET, auth sẽ return null (coi như chưa đăng nhập).
function getJwtSecret(): string | null {
  const s = process.env.JWT_SECRET;
  return s && s.length > 0 ? s : null;
}

export type AuthUser = {
  id: string;
  email?: string;
  role?: "admin" | "staff" | "customer" | string;
};

type TokenPayload = JwtPayload & {
  sub?: string; // chuẩn JWT
  id?: string;  // fallback token cũ
  email?: string;
  role?: string;
};

/**
 * verifyToken:
 * - Dùng để verify JWT và trả payload (không query DB)
 * - Không throw, trả null nếu token/secret sai
 * - Giữ lại để code cũ (layout / middleware) không bị lỗi import
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJwtSecret();
    if (!secret) return null;
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * getAuthUser:
 * - Đọc cookie accessToken
 * - Verify token để lấy userId (sub/id)
 * - Query DB để lấy email/role mới nhất (khớp audit log)
 * - Không throw, lỗi => null
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const secret = getJwtSecret();
    if (!secret) return null;

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = jwt.verify(token, secret) as TokenPayload;

    const userId = payload.sub || payload.id;
    if (!userId) return null;

    await dbConnect();
    const u: any = await User.findById(userId).lean();
    if (!u) return null;

    return {
      id: String(u._id),
      email: u.email,
      role: u.role,
    };
  } catch {
    return null;
  }
}

/** Helpers cho route/service */
export function requireAuth(user: AuthUser | null): asserts user is AuthUser {
  if (!user) throw new Error("UNAUTHORIZED");
}

export function requireRole(user: AuthUser, roles: string[]) {
  // admin là superuser (tuỳ bạn giữ/ bỏ)
  if (user.role === "admin") return;

  if (!user.role || !roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}
