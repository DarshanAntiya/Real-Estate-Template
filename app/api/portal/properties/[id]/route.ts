import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPropertySchema, propertyIdSchema, sanitizeInput } from "@/lib/security";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const paramsData = await params;
        const idParse = propertyIdSchema.safeParse({ id: paramsData.id });
        if (!idParse.success) {
            return NextResponse.json({ error: "Invalid Property ID" }, { status: 400 });
        }
        const id = idParse.data.id;

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

        const property = await prisma.property.update({
            where: { id },
            data: {
                name: sanitizeInput(data.name),
                location: sanitizeInput(data.location),
                area: data.area ? sanitizeInput(data.area) : null,
                bhk: data.bhk ? sanitizeInput(data.bhk) : null,
                propertyType: data.propertyType ? sanitizeInput(data.propertyType) : "Residential",
                price: data.price || null,
                startingFrom: data.startingFrom ?? false,
                confidentialPrice: data.confidentialPrice ?? false,
                status: data.status ? sanitizeInput(data.status) : "Available",
                listingType: data.listingType ? sanitizeInput(data.listingType) : "Sale",
                featured: data.featured ?? false,
                active: data.active ?? true,
                amenities: Array.isArray(body.amenities) ? body.amenities.map((a: string) => sanitizeInput(a)) : [],
                mapEmbedUrl: data.mapEmbedUrl || null,
                images: Array.isArray(body.images) ? body.images : [],
                description: data.description ? sanitizeInput(data.description) : null,
            },
        });

        return NextResponse.json({ property });
    } catch (error) {
        console.error("Error updating property:", error);
        return NextResponse.json(
            { error: "Failed to update property" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const paramsData = await params;
        const idParse = propertyIdSchema.safeParse({ id: paramsData.id });
        if (!idParse.success) {
            return NextResponse.json({ error: "Invalid Property ID" }, { status: 400 });
        }
        const id = idParse.data.id;

        // Delete related leads first
        await prisma.lead.deleteMany({ where: { propertyId: id } });
        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting property:", error);
        return NextResponse.json(
            { error: "Failed to delete property" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const paramsData = await params;
        const idParse = propertyIdSchema.safeParse({ id: paramsData.id });
        if (!idParse.success) {
            return NextResponse.json({ error: "Invalid Property ID" }, { status: 400 });
        }
        const id = idParse.data.id;

        const body = await request.json();

        // Prevent mass assignment and use partial schema
        const updateSchema = createPropertySchema.partial();
        const parseResult = updateSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = parseResult.data;

        // Perform basic sanitization for updated fields if they exist
        const safeData: any = { ...data };
        if (safeData.name) safeData.name = sanitizeInput(safeData.name);
        if (safeData.location) safeData.location = sanitizeInput(safeData.location);
        if (safeData.area) safeData.area = sanitizeInput(safeData.area);
        if (safeData.bhk) safeData.bhk = sanitizeInput(safeData.bhk);
        if (safeData.propertyType) safeData.propertyType = sanitizeInput(safeData.propertyType);
        if (safeData.status) safeData.status = sanitizeInput(safeData.status);
        if (safeData.listingType) safeData.listingType = sanitizeInput(safeData.listingType);
        if (safeData.description) safeData.description = sanitizeInput(safeData.description);
        if (body.amenities && Array.isArray(body.amenities)) {
            safeData.amenities = body.amenities.map((a: string) => sanitizeInput(a));
        }

        const property = await prisma.property.update({
            where: { id },
            data: safeData,
        });

        return NextResponse.json({ property });
    } catch (error) {
        console.error("Error patching property:", error);
        return NextResponse.json(
            { error: "Failed to update property" },
            { status: 500 }
        );
    }
}
