// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import Staff from "@/models/user.model";
import { withApiHandler } from "@/lib/api-handler";
import { requireRole } from "@/lib/services/permissions.service";

// Tuỳ bạn: role hệ thống + role dự án theo pattern
const SYSTEM_ROLES = new Set(["admin", "staff", "customer"]);
const PROJECT_ROLE_REGEX = /^prj-[a-z0-9-]+$/i;

function normalizeRoles(input: any): string[] {
  if (!Array.isArray(input)) return [];
  const roles = input
      .map((r) => String(r).trim())
      .filter(Boolean)
      .filter((r) => SYSTEM_ROLES.has(r) || PROJECT_ROLE_REGEX.test(r));
  return Array.from(new Set(roles)); // unique
}

function pickCreateFields(body: any) {
  // ✅ Whitelist fields (bạn bổ sung theo schema thực tế)
  const doc: Record<string, any> = {};

  if (body.email !== undefined) doc.email = String(body.email).trim();
  if (body.phone !== undefined) doc.phone = String(body.phone).trim();
  if (body.firstname !== undefined) doc.firstname = String(body.firstname).trim();
  if (body.lastname !== undefined) doc.lastname = String(body.lastname).trim();

  // roles nhận mảng ['admin','prj-a']...
  doc.roles = normalizeRoles(body.roles);

  // Nếu model của bạn có field passwordHash hoặc password xử lý riêng,
  // KHÔNG nên cho tạo thẳng từ body ở đây nếu chưa hash.
  // Bạn chỉ nên nhận password nếu model có pre-save hash.
  if (body.password !== undefined) doc.password = String(body.password);

  return doc;
}

// GET: Lấy danh sách tất cả nhân viên (admin-only)
export async function GET(req: NextRequest) {
  return withApiHandler(req, { params: {} }, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const staffs = await Staff.find({})
        .select("-password -passwordHash");

    return NextResponse.json(staffs);
  });
}

// POST: Tạo nhân viên mới (admin-only)
export async function POST(req: NextRequest) {
  return withApiHandler(req, { params: {} }, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const body = await req.json();

    // Kiểm tra trùng phone (giữ logic bạn đang làm)
    if (body.phone) {
      const exist = await Staff.findOne({ phone: String(body.phone).trim() });
      if (exist) {
        return NextResponse.json(
            { error: "Số điện thoại đã tồn tại" },
            { status: 400 }
        );
      }
    }

    // ✅ Whitelist + normalize roles
    const staffData = pickCreateFields(body);

    const newStaff = await Staff.create(staffData);

    // trả về bản sạch (không password)
    const safeStaff = await Staff.findById(newStaff._id)
        .select("-password -passwordHash");

    return NextResponse.json(
        { message: "Tạo thành công", staff: safeStaff },
        { status: 201 }
    );
  });
}
