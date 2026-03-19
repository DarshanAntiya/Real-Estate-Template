import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /portal routes (except /portal/login)
    if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
        const token = request.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/portal/login", request.url));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/portal/login", request.url));
        }
    }

    // Protect portal API routes
    if (
        pathname.startsWith("/api/portal") &&
        !pathname.startsWith("/api/portal/login")
    ) {
        const token = request.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/portal/:path*", "/api/portal/:path*"],
};
