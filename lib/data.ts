export interface Property {
    id: string;
    name: string;
    location: string;
    area: string | null;
    bhk: string | null;
    propertyType: string;
    price: number | null;
    startingFrom: boolean;
    confidentialPrice: boolean;
    status: string;
    listingType: string;
    featured: boolean;
    active: boolean;
    amenities: string[];
    mapEmbedUrl: string | null;
    images: string[];
    description: string | null;
}

export const staticProperties: Property[] = [
    {
        id: "cl-1",
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
        id: "cl-2",
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
        id: "cl-3",
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
        id: "cl-4",
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
        id: "cl-5",
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
        id: "cl-6",
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

export const staticLeads = [];
export const staticAdminUser = {
    email: "admin@shreenath.estate",
    passwordHash: "$2b$12$Qa9xwZcY2rJN2q01LZ6AzuCMeXQuf6T6TVAMFxAB9tIpJckgD3I8q", // Hash for "admin123"
};
