import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "visual-python-learning-secret-key-change-in-production-2024"
);

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/learn", "/practice", "/playground", "/settings", "/progress"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // Check if user is authenticated
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/practice/:path*",
    "/playground/:path*",
    "/settings/:path*",
    "/progress/:path*",
    "/login",
    "/register",
  ],
};
