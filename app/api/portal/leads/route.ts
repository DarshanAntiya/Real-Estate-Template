import { NextResponse } from "next/server";
import { staticLeads } from "@/lib/data";

export async function GET() {
    try {
        // Return static leads (empty for now)
        return NextResponse.json({ leads: staticLeads });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        );
    }
}
