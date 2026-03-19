import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, createToken } from "@/lib/auth";
import { loginRateLimiter, getIpFromRequest, loginSchema, sanitizeInput } from "@/lib/security";

export async function POST(request: Request) {
    try {
        const ip = getIpFromRequest(request);

        // Strict rate limiting
        try {
            await loginRateLimiter.consume(ip);
        } catch (rejRes) {
            return NextResponse.json(
                { error: "Too many login attempts. Account locked for 15 minutes." },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Validate payload
        const parseResult = loginSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, password } = parseResult.data;
        const sanitizedEmail = sanitizeInput(email).toLowerCase();

        const user = await prisma.adminUser.findUnique({ where: { email: sanitizedEmail } });
        if (!user) {
            // Generic error
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const valid = await comparePasswords(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Reset rate limiter on successful login
        await loginRateLimiter.delete(ip);

        const token = await createToken({ userId: user.id, email: user.email });

        const response = NextResponse.json({ success: true });
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: true, // Always true in production, but let's enforce it
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error); // Could be logged securely
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
