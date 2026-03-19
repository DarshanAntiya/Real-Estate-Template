import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { RateLimiterMemory } from "rate-limiter-flexible";

// ----------------------------------------------------------------------
// Rate Limiter
// ----------------------------------------------------------------------

// Rate limiter for general API routes (e.g., 100 requests per 15 minutes per IP)
export const apiRateLimiter = new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 15 * 60, // Per 15 minutes
});

// Rate limiter for login attempts (strict: 5 attempts per 15 mins)
export const loginRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 15 * 60, // Lockout for 15 mins after 5 fails
});

// Rate limiter for contact form (points consumed on submit)
export const contactFormRateLimiter = new RateLimiterMemory({
    points: 3, // Max 3 messages
    duration: 60 * 60, // Per hour
});

// Helper function to extract IP for rate limiting
export function getIpFromRequest(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    return "127.0.0.1"; // Fallback
}

// ----------------------------------------------------------------------
// Sanitization
// ----------------------------------------------------------------------

export function sanitizeInput(input: string): string {
    if (!input) return "";
    return sanitizeHtml(input, {
        allowedTags: [], // Strip all HTML
        allowedAttributes: {},
    });
}

// ----------------------------------------------------------------------
// Validation Schemas (Zod)
// ----------------------------------------------------------------------

// Login Schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

// Lead / Contact Form Schema
export const leadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    email: z.string().email("Invalid email format").max(255, "Email too long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number too long"),
    message: z.string().max(2000, "Message too long").optional(),
    propertyId: z.string().optional(),
    source: z.string().max(50).optional(),
    // honeypot field (should be empty if human)
    honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

// Property Base Schema (Example)
// More fields can be added depending on the exact property creation logic
export const propertyIdSchema = z.object({
    id: z.string().cuid("Invalid Property ID"), // Assuming CUIDs are used based on Prisma schema
});

export const createPropertySchema = z.object({
    name: z.string().min(2).max(255),
    location: z.string().min(2).max(255),
    area: z.string().optional(),
    bhk: z.string().optional(),
    propertyType: z.string().optional(),
    price: z.number().positive().optional(),
    startingFrom: z.boolean().optional(),
    confidentialPrice: z.boolean().optional(),
    status: z.string().optional(),
    listingType: z.string().optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
    mapEmbedUrl: z.string().url().optional().or(z.literal("")),
    description: z.string().optional(),
});
