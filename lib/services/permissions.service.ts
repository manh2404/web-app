import { NextResponse } from "next/server";
import { IUser } from "@/models/user.model";

function getRoles(user: IUser): string[] {
    return Array.isArray((user as any).roles) ? (user as any).roles : [];
}

export function requireRole(user: IUser, roles: string[]): NextResponse | null {
    const userRoles = getRoles(user);

    // admin là superuser
    if (userRoles.includes("admin")) return null;

    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return null;
}

export function requireProjectPermission(
    user: IUser,
    projectCode: string
): NextResponse | null {
    const roles = getRoles(user);
    const code = String(projectCode).trim();

    if (roles.includes("admin")) return null;

    if (!roles.includes(code)) {
        return NextResponse.json({ message: "No permission for this project" }, { status: 403 });
    }

    return null;
}
