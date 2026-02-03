import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Korumalı sayfalar
  const protectedPaths = ["/hesabim"];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Korumalı değilse devam et
  if (!isProtected) {
    return NextResponse.next();
  }

  // Cookie var mı?
  const session = req.cookies.get("session")?.value;

  // Yoksa giriş sayfasına at
  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/giris";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie varsa devam
  return NextResponse.next();
}

export const config = {
  // Sadece /hesabim ve altını yakala (performans + döngü riskini sıfırlar)
  matcher: ["/hesabim/:path*"],
};
