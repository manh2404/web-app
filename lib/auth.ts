// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/mongo";
import User from "@/models/user.model";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "accessToken";

function getJwtSecret(): string | null {
  const s = process.env.JWT_SECRET;
  return s && s.length > 0 ? s : null;
}

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role?: "admin" | "staff" | "customer" | string;
};

type TokenPayload = JwtPayload & {
  sub?: string;
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
};

async function getTokenFromRequest(): Promise<string | null> {
  // ✅ cookies() của bạn đang là Promise => phải await
  const store = await cookies();

  const byEnv = store.get(COOKIE_NAME)?.value;
  if (byEnv) return byEnv;

  const fallbacks = ["accessToken", "access_token", "token", "jwt"] as const;
  for (const name of fallbacks) {
    const v = store.get(name)?.value;
    if (v) return v;
  }

  // ✅ headers() của bạn cũng là Promise => phải await
  const h = await headers();
  const auth = h.get("authorization") || h.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length).trim();
  }

  return null;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJwtSecret();
    if (!secret) return null;
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const secret = getJwtSecret();
    if (!secret) return null;

    const token = await getTokenFromRequest();
    if (!token) return null;

    const payload = jwt.verify(token, secret) as TokenPayload;

    const userId = payload.sub || payload.id || payload._id;
    if (!userId) return null;

    await dbConnect();
    const u: any = await User.findById(userId).lean();
    if (!u) return null;

    return {
      id: String(u._id),
      email: u.email,
      name: u.name || u.fullName || u.username || u.email,
      role: u.role,
    };
  } catch {
    return null;
  }
}

export function requireAuth(user: AuthUser | null): asserts user is AuthUser {
  if (!user) throw new Error("UNAUTHORIZED");
}

export function requireRole(user: AuthUser, roles: string[]) {
  if (user.role === "admin") return;
  if (!user.role || !roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}
