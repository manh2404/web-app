// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Staff from "@/models/user.model";
import { withApiHandler } from "@/lib/api-handler";
import { requireRole } from "@/lib/services/permissions.service";

// Tuỳ bạn: role hệ thống + role dự án theo pattern
const SYSTEM_ROLES = new Set(["admin", "staff", "customer"]);
const PROJECT_ROLE_REGEX = /^prj-[a-z0-9-]+$/i;

function normalizeRoles(input: any): string[] | undefined {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) return [];

  const roles = input
      .map((r) => String(r).trim())
      .filter(Boolean)
      .filter((r) => SYSTEM_ROLES.has(r) || PROJECT_ROLE_REGEX.test(r));

  // unique
  return Array.from(new Set(roles));
}

// PUT: Cập nhật thông tin (bao gồm roles)
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
  return withApiHandler(req, context, async (req, user) => {
    // Chỉ admin được update user
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const { id } = context.params;

    const body = await req.json();

    // ✅ Whitelist field được update (bạn bổ sung theo schema của bạn)
    const updateDoc: Record<string, any> = {};

    if (body.email !== undefined) updateDoc.email = String(body.email).trim();
    if (body.firstname !== undefined) updateDoc.firstname = String(body.firstname).trim();
    if (body.lastname !== undefined) updateDoc.lastname = String(body.lastname).trim();
    if (body.phone !== undefined) updateDoc.phone = String(body.phone).trim();

    // ✅ Roles: bắt buộc là mảng string (lọc hợp lệ)
    const roles = normalizeRoles(body.roles);
    if (roles !== undefined) updateDoc.roles = roles;

    // ⚠️ Nếu bạn cho phép update password thì làm route riêng /api/users/[id]/password
    // vì findByIdAndUpdate sẽ không chạy middleware hash password (nếu bạn dùng pre-save).

    const updatedStaff = await Staff.findByIdAndUpdate(
        id,
        { $set: updateDoc },
        { new: true, runValidators: true }
    ).select("-password -passwordHash");

    if (!updatedStaff) {
      return NextResponse.json(
          { error: "Không tìm thấy nhân viên" },
          { status: 404 }
      );
    }

    return NextResponse.json(updatedStaff);
  });
}

// DELETE: Xóa nhân viên
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
  return withApiHandler(req, context, async (req, user) => {
    // Chỉ admin được delete user
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const { id } = context.params;

    const deleted = await Staff.findByIdAndDelete(id).select(
        "-password -passwordHash"
    );

    if (!deleted) {
      return NextResponse.json(
          { error: "Không tìm thấy nhân viên" },
          { status: 404 }
      );
    }

    return NextResponse.json({ message: "Đã xóa nhân viên" });
  });
}
