import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get("featured");
        const listingType = searchParams.get("listingType");

        const where: Record<string, unknown> = { active: true };
        if (featured === "true") where.featured = true;
        if (listingType && listingType !== "All") where.listingType = listingType;

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ properties });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json(
            { error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}
