import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                property: {
                    select: { name: true, location: true },
                },
            },
        });
        return NextResponse.json({ leads });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        );
    }
}
