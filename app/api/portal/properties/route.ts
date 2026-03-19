import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPropertySchema, sanitizeInput } from "@/lib/security";

export async function GET() {
    try {
        const properties = await prisma.property.findMany({
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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate payload
        const parseResult = createPropertySchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = parseResult.data;

        const property = await prisma.property.create({
            data: {
                name: sanitizeInput(data.name),
                location: sanitizeInput(data.location),
                area: data.area ? sanitizeInput(data.area) : null,
                bhk: data.bhk ? sanitizeInput(data.bhk) : null,
                propertyType: data.propertyType ? sanitizeInput(data.propertyType) : "Residential",
                price: data.price || null,
                startingFrom: data.startingFrom || false,
                confidentialPrice: data.confidentialPrice || false,
                status: data.status ? sanitizeInput(data.status) : "Available",
                listingType: data.listingType ? sanitizeInput(data.listingType) : "Sale",
                featured: data.featured || false,
                active: data.active !== false,
                // amenities, mapEmbedUrl, and images might contain structural or external data
                // Basic sanitization on string inputs:
                amenities: Array.isArray(body.amenities) ? body.amenities.map((a: string) => sanitizeInput(a)) : [],
                mapEmbedUrl: data.mapEmbedUrl || null,
                images: Array.isArray(body.images) ? body.images : [], // Validate object structure if needed later
                description: data.description ? sanitizeInput(data.description) : null,
            },
        });

        return NextResponse.json({ property }, { status: 201 });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json(
            { error: "Failed to create property" },
            { status: 500 }
        );
    }
}
