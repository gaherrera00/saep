import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon.ico", "/manifest.json", "/icon.png", "/robots.txt"];

export function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const token = req.cookies.get("token")?.value;

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", req.url);
    if (pathname && pathname !== "/") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
