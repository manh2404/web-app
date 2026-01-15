// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import Staff from "@/models/user.model";
import { withApiHandler } from "@/lib/api-handler";
import { requireRole } from "@/lib/services/permissions.service";
import bcrypt from 'bcryptjs';

const SYSTEM_ROLES = new Set(["admin", "staff", "customer"]);
const PROJECT_ROLE_REGEX = /^prj-[a-z0-9-]+$/i;

// normalize roles: nhận mảng -> lọc -> unique
function normalizeRoles(input: any): string[] {
  if (!Array.isArray(input)) return [];
  const roles = input
      .map((r) => String(r).trim().toLowerCase())
      .filter(Boolean)
      .filter((r) => SYSTEM_ROLES.has(r) || PROJECT_ROLE_REGEX.test(r));

  return Array.from(new Set(roles));
}

// pick whitelist field khi create
function pickCreateFields(body: any) {
  const doc: Record<string, any> = {};

  if (body.email !== undefined) doc.email = String(body.email).trim().toLowerCase();
  if (body.phone !== undefined) doc.phone = String(body.phone).trim();
  if (body.firstname !== undefined) doc.firstname = String(body.firstname).trim();
  if (body.lastname !== undefined) doc.lastname = String(body.lastname).trim();

  // roles: nếu UI không gửi hoặc gửi sai -> default staff
  const roles = normalizeRoles(body.roles);
  doc.roles = roles.length ? roles : ["staff"];

  // password sẽ được hash ở POST trước khi create
  if (body.password !== undefined) doc.password = String(body.password);

  return doc;
}

// GET: lấy danh sách user (admin-only)
export async function GET(req: NextRequest) {
  return withApiHandler(req, { params: {} }, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const staffs = await Staff.find({}).select("-password -passwordHash");
    return NextResponse.json(staffs);
  });
}

// POST: tạo user mới (admin-only)
export async function POST(req: NextRequest) {
  return withApiHandler(req, { params: {} }, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const body = await req.json();

    // Validate tối thiểu
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc" }, { status: 400 });
    }

    const passwordPlain = String(body.password || "");
    if (!passwordPlain) {
      return NextResponse.json({ error: "Mật khẩu là bắt buộc" }, { status: 400 });
    }

    // Check trùng email
    const existEmail = await Staff.findOne({ email });
    if (existEmail) {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
    }

    // Check trùng phone
    if (body.phone) {
      const phone = String(body.phone).trim();
      const existPhone = await Staff.findOne({ phone });
      if (existPhone) {
        return NextResponse.json({ error: "Số điện thoại đã tồn tại" }, { status: 400 });
      }
    }

    // ✅ Whitelist + normalize
    const staffData = pickCreateFields({ ...body, email });

    // ✅ HASH PASSWORD TRƯỚC KHI CREATE (đây là chỗ bạn đang thiếu)
    staffData.password = await bcrypt.hash(passwordPlain, 10);

    const newStaff = await Staff.create(staffData);

    // trả về bản sạch (không password)
    const safeStaff = await Staff.findById(newStaff._id).select("-password -passwordHash");

    return NextResponse.json({ message: "Tạo thành công", staff: safeStaff }, { status: 201 });
  });
}
