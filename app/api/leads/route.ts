import { NextResponse } from "next/server";
import { leadSchema, sanitizeInput, contactFormRateLimiter, getIpFromRequest } from "@/lib/security";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const ip = getIpFromRequest(request);

        // Rate limiting
        try {
            await contactFormRateLimiter.consume(ip);
        } catch (rejRes) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Validate payload
        const parseResult = leadSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = parseResult.data;

        // Honeypot check — fake success for bots
        if (data.honeypot) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Sanitize string inputs
        const sanitizedName = sanitizeInput(data.name);
        const sanitizedEmail = sanitizeInput(data.email);
        const sanitizedPhone = sanitizeInput(data.phone);
        const sanitizedMessage = data.message ? sanitizeInput(data.message) : null;
        const sanitizedSource = data.source ? sanitizeInput(data.source) : "inquiry";

        // Save to Firebase Firestore
        const leadData = {
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            message: sanitizedMessage,
            propertyId: data.propertyId || null,
            source: sanitizedSource,
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, "leads"), leadData);

        return NextResponse.json(
            { success: true, lead: { id: docRef.id, ...leadData } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { error: "Failed to submit inquiry" },
            { status: 500 }
        );
    }
}
