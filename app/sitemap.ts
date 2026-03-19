import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://shreenathestate.com";

    // Fetch properties (this is a mock URL based on how you fetch properties)
    // In a real app we'd import the Prisma logic, but here we can just use the API if accessible or mock.
    // Actually, generating sitemap requires absolute URL or db access.
    // We'll leave it as a static sitemap with dynamic placeholders.
    let propertyUrls: MetadataRoute.Sitemap = [];

    try {
        // If you have build-accessible API:
        // const res = await fetch(`${baseUrl}/api/properties`);
        // const data = await res.json();
        // propertyUrls = data.properties.map((p: any) => ({
        //   url: `${baseUrl}/portfolio/${p.id}`,
        //   lastModified: new Date(),
        // }));
    } catch (error) {
        console.error("Error fetching properties for sitemap", error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/#about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/#contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        ...propertyUrls,
    ];
}
