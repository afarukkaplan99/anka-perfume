export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "../../../../lib/usersStore";
import { createSessionToken, SESSION_COOKIE_NAME, cookieOptions } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(user, password)) {
      return NextResponse.json({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    const token = createSessionToken({ id: user.id, email: user.email });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    // ✅ Cookie set (localhost'ta secure=false olmalı)
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      ...cookieOptions(),
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });

    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
