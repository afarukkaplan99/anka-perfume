export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../../../../lib/usersStore";
import { createSessionToken, SESSION_COOKIE_NAME, cookieOptions } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const name = String(body?.name || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "EMAIL_INVALID" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ ok: false, error: "PASSWORD_TOO_SHORT" }, { status: 400 });
    }

    const user = createUser({ email, password, name: name || undefined });
    const token = createSessionToken({ id: user.id, email: user.email });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(SESSION_COOKIE_NAME, token, { ...cookieOptions(), maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "UNKNOWN";
    if (msg === "EMAIL_IN_USE") {
      return NextResponse.json({ ok: false, error: "EMAIL_IN_USE" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
