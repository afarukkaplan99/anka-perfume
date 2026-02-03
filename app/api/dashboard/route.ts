export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

// Cookie string içinden isimle cookie çek
function getCookieFromHeader(cookieHeader: string, name: string) {
  // "a=1; session=XYZ; b=2"
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(name + "="));
  if (!found) return null;
  return decodeURIComponent(found.slice(name.length + 1));
}

export async function GET(req: Request) {
  try {
    // 1) Auth kontrol (headers üzerinden)
    const cookieHeader = req.headers.get("cookie") || "";
    const session = getCookieFromHeader(cookieHeader, SESSION_COOKIE_NAME);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) dashboard.json oku
    const filePath = path.join(process.cwd(), "data", "dashboard.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error: "dashboard.json not found",
          expectedPath: filePath,
          cwd: process.cwd(),
        },
        { status: 500 }
      );
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch (jsonErr: any) {
      return NextResponse.json(
        {
          error: "dashboard.json parse error",
          message: jsonErr?.message || String(jsonErr),
          preview: raw.slice(0, 300),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled server error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
