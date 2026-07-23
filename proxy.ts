import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/upload", "/reports", "/clients", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("fs_token")?.value;

  if (!token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/reports/:path*",
    "/clients/:path*",
    "/settings/:path*",
  ],
};
