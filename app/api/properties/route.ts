import { NextResponse } from "next/server";
import { staticProperties } from "@/lib/data";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get("featured");
        const listingType = searchParams.get("listingType");

        let properties = staticProperties.filter(p => p.active);

        if (featured === "true") {
            properties = properties.filter(p => p.featured);
        }

        if (listingType && listingType !== "All") {
            properties = properties.filter(p => p.listingType === listingType || p.listingType === "Both");
        }

        // Simulating the order by createdAt desc by assuming the static list is already ordered or just returning it
        return NextResponse.json({ properties });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json(
            { error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}
