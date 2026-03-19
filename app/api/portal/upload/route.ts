import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
    try {


        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate file extension to prevent malicious uploads (like .html, .exe)
        const ext = path.extname(file.name).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.svg', '.mp4'];

        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json({ success: false, error: "Invalid file type. Allowed: JPG, PNG, WEBP, MP4, PDF, SVG." }, { status: 400 });
        }

        const uniqueId = crypto.randomUUID();
        const filename = `${uniqueId}${ext}`;

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public/uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Ignore error if directory exists
        }

        const filepath = path.join(uploadDir, filename);

        // Write the file
        await writeFile(filepath, buffer);

        // Return the public URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
    }
}
