// lib/auth.ts
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongo";
import Staff, { IUser } from "@/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_TOKEN;

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not set in env");
}

type Decoded = {
  sub?: string;
  userId?: string;
  id?: string;
  _id?: string;
  roles?: string[];
  [key: string]: any;
};

function getUserId(decoded: Decoded): string | null {
  const id = decoded.userId || decoded._id || decoded.id || decoded.sub;
  return id ? String(id) : null;
}

export async function verifyToken(token: string): Promise<IUser | null> {
  try {
    if (!token || !JWT_SECRET) return null;

    // ✅ verify chữ ký JWT
    const decoded = jwt.verify(token, JWT_SECRET) as Decoded;

    const userId = getUserId(decoded);
    if (!userId) return null;

    // ✅ connect DB trước khi query user
    await dbConnect();

    // ✅ lấy user thật từ DB để có roles thật
    const user = await Staff.findById(userId).select("-password -passwordHash");
    if (!user) return null;

    return user as unknown as IUser;
  } catch (err) {
    console.error("verifyToken error:", err);
    return null;
  }
}
