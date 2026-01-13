import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Audit from "@/models/audit.model";
import { getAuthUser, requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: Request) {
    const me = await getAuthUser();

    try {
        requireAuth(me);
        requireRole(me, ["admin"]);

        const { searchParams } = new URL(req.url);
        const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

        const action = searchParams.get("action");
        const email = searchParams.get("email");
        const success = searchParams.get("success"); // "true" | "false"
        const resource = searchParams.get("resource");

        const filter: any = {};
        if (action) filter.action = action;
        if (email) filter.email = email;
        if (resource) filter.resource = resource;
        if (success === "true") filter.success = true;
        if (success === "false") filter.success = false;

        await dbConnect();
        const data = await Audit.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        const msg = String(e?.message || e);
        const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
        return NextResponse.json({ ok: false, error: msg }, { status });
    }
}
