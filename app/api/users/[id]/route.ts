// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Staff from "@/models/user.model";
import { withApiHandler } from "@/lib/api-handler";
import { requireRole } from "@/lib/services/permissions.service";

// Role hệ thống
const SYSTEM_ROLES = new Set(["admin", "staff", "customer"]);
const PROJECT_ROLE_REGEX = /^prj-[a-z0-9-]+$/i;

function normalizeRoles(input: any): string[] | undefined {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) return [];

  const roles = input
      .map((r) => String(r).trim().toLowerCase())
      .filter(Boolean)
      .filter((r) => SYSTEM_ROLES.has(r) || PROJECT_ROLE_REGEX.test(r));

  return Array.from(new Set(roles));
}

// (Tuỳ chọn) GET 1 user theo id (admin-only) - hữu ích cho trang edit
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  return withApiHandler(req, context, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const { id } = context.params;
    const staff = await Staff.findById(id).select("-password -passwordHash");
    if (!staff) {
      return NextResponse.json({ error: "Không tìm thấy nhân viên" }, { status: 404 });
    }
    return NextResponse.json(staff);
  });
}

// PUT: cập nhật thông tin user (admin-only)
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return withApiHandler(req, context, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const { id } = context.params;
    const body = await req.json();

    // Whitelist update field
    const updateDoc: Record<string, any> = {};

    if (body.email !== undefined) updateDoc.email = String(body.email).trim().toLowerCase();
    if (body.firstname !== undefined) updateDoc.firstname = String(body.firstname).trim();
    if (body.lastname !== undefined) updateDoc.lastname = String(body.lastname).trim();
    if (body.phone !== undefined) updateDoc.phone = String(body.phone).trim();

    // Roles
    const roles = normalizeRoles(body.roles);
    if (roles !== undefined) {
      // Không cho set rỗng (tránh user mất quyền)
      if (roles.length === 0) {
        return NextResponse.json(
            { error: "Roles không hợp lệ hoặc rỗng" },
            { status: 400 }
        );
      }
      updateDoc.roles = roles;
    }

    // Không update password ở đây (nếu muốn làm route riêng)
    if (body.password !== undefined) {
      return NextResponse.json(
          { error: "Không hỗ trợ đổi mật khẩu tại endpoint này" },
          { status: 400 }
      );
    }

    const updated = await Staff.findByIdAndUpdate(
        id,
        { $set: updateDoc },
        { new: true, runValidators: true }
    ).select("-password -passwordHash");

    if (!updated) {
      return NextResponse.json({ error: "Không tìm thấy nhân viên" }, { status: 404 });
    }

    return NextResponse.json(updated);
  });
}

// DELETE: xoá user (admin-only)
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  return withApiHandler(req, context, async (req, user) => {
    const deny = requireRole(user, ["admin"]);
    if (deny) return deny;

    const { id } = context.params;

    const deleted = await Staff.findByIdAndDelete(id).select("-password -passwordHash");
    if (!deleted) {
      return NextResponse.json({ error: "Không tìm thấy nhân viên" }, { status: 404 });
    }

    return NextResponse.json({ message: "Đã xóa nhân viên" });
  });
}
