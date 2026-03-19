import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 12);
    const admin = await prisma.adminUser.upsert({
        where: { email: "admin@shreenath.estate" },
        update: {},
        create: {
            email: "admin@shreenath.estate",
            passwordHash,
        },
    });
    console.log(`✓ Admin user created: ${admin.email}`);

    // Delete existing properties to prevent duplicates
    await prisma.property.deleteMany({});

    // Seed properties
    const properties = [
        {
            name: "The Imperial Residences",
            location: "Tardeo, South Mumbai",
            area: "2,850 sq.ft.",
            bhk: "4",
            propertyType: "Residential",
            price: 120000000,
            startingFrom: true,
            confidentialPrice: false,
            status: "Available",
            featured: true,
            active: true,
            listingType: "Sale",
            description:
                "A landmark address offering panoramic sea views and world-class amenities. Designed for those who seek the finest in luxury living with impeccable craftsmanship and curated interiors.",
            amenities: [
                "Sea View",
                "Swimming Pool",
                "Private Gym",
                "24/7 Concierge",
                "Valet Parking",
                "Clubhouse",
                "Landscaped Garden",
                "Smart Home Automation",
            ],
            mapEmbedUrl:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.5!2d72.81!3d18.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU4JzEyLjAiTiA3MsKwNDgnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
            images: ["/properties/prop3.png"],
        },
        {
            name: "Bayview Heights",
            location: "Worli Sea Face, Mumbai",
            area: "3,200 sq.ft.",
            bhk: "4",
            propertyType: "Residential",
            price: 180000000,
            startingFrom: false,
            confidentialPrice: false,
            status: "Available",
            featured: true,
            active: true,
            listingType: "Both",
            description:
                "Positioned along the iconic Worli Sea Face, this residence offers unobstructed views of the Arabian Sea. A masterpiece of contemporary architecture with bespoke interiors and premium finishes.",
            amenities: [
                "Sea View",
                "Infinity Pool",
                "Private Elevator",
                "Wine Cellar",
                "Home Theatre",
                "Spa & Sauna",
                "Jogging Track",
                "Multi-Level Parking",
            ],
            mapEmbedUrl: null,
            images: ["/properties/prop2.png"],
        },
        {
            name: "Crest One",
            location: "Bandra West, Mumbai",
            area: "1,800 sq.ft.",
            bhk: "3",
            propertyType: "Residential",
            price: 75000000,
            startingFrom: true,
            confidentialPrice: false,
            status: "Available",
            featured: true,
            active: true,
            listingType: "Rent",
            description:
                "A boutique development in the heart of Bandra offering sophisticated 3 BHK residences. Each unit features floor-to-ceiling windows, Italian marble flooring, and designer kitchens.",
            amenities: [
                "Rooftop Pool",
                "Fitness Center",
                "Children's Play Area",
                "Landscaped Terrace",
                "24/7 Security",
                "EV Charging",
            ],
            mapEmbedUrl: null,
            images: ["/properties/prop1.png"],
        },
        {
            name: "Marina Commercial Tower",
            location: "BKC, Mumbai",
            area: "5,500 sq.ft.",
            bhk: null,
            propertyType: "Commercial",
            price: 250000000,
            startingFrom: false,
            confidentialPrice: true,
            status: "Available",
            featured: true,
            active: true,
            listingType: "Sale",
            description:
                "A Grade-A commercial space in Mumbai's business capital. Offering premium office environments with state-of-the-art infrastructure and prime connectivity.",
            amenities: [
                "Central AC",
                "Power Backup",
                "Fire Safety",
                "Visitor Parking",
                "Conference Facilities",
                "Food Court",
                "High-Speed Elevators",
            ],
            mapEmbedUrl: null,
            images: ["/properties/prop6.png"],
        },
        {
            name: "Skyline Towers",
            location: "Andheri West, Mumbai",
            area: "1,450 sq.ft.",
            bhk: "3",
            propertyType: "Under-Construction",
            price: 35000000,
            startingFrom: true,
            confidentialPrice: false,
            status: "Available",
            featured: false,
            active: true,
            listingType: "Sale",
            description:
                "An upcoming luxury project in the rapidly developing Andheri corridor. Expected completion in 2027 with modern amenities and excellent connectivity to both airports.",
            amenities: [
                "Swimming Pool",
                "Gymnasium",
                "Children's Play Area",
                "Multipurpose Hall",
                "Jogging Track",
                "24/7 Security",
            ],
            mapEmbedUrl: null,
            images: ["/properties/prop5.png"],
        },
        {
            name: "The Grand Penthouse",
            location: "Juhu, Mumbai",
            area: "6,200 sq.ft.",
            bhk: "5",
            propertyType: "Residential",
            price: 450000000,
            startingFrom: false,
            confidentialPrice: false,
            status: "Sold",
            featured: false,
            active: true,
            listingType: "Both",
            description:
                "A rare penthouse offering 360-degree views of the coastline and city skyline. Spread across two levels with a private terrace, pool, and landscaped garden.",
            amenities: [
                "Private Pool",
                "360° Views",
                "Private Elevator",
                "Landscaped Terrace",
                "Smart Home",
                "Butler Service",
                "Wine Room",
                "Home Office",
            ],
            mapEmbedUrl: null,
            images: ["/properties/prop4.png"],
        },
    ];

    for (const prop of properties) {
        await prisma.property.create({
            data: prop,
        });
    }

    console.log(`✓ ${properties.length} properties created`);
    console.log("\n🎉 Seeding complete!");
    console.log(`\n📋 Admin Login Credentials:`);
    console.log(`   Email: admin@shreenath.estate`);
    console.log(`   Password: admin123`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
