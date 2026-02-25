import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!isAuthorized(token)) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|favicon).*)"],
};
