import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // In a real scenario, this should fetch from DB/API.
    // We'll provide a decent default that dynamically includes the ID.
    return {
        title: `Property Details - ${id} | RIZ-WEE & CO.`,
        description: `View details for property ${id} in Mumbai. Luxury real estate advisory by RIZ-WEE & CO..`,
        alternates: {
            canonical: `/portfolio/${id}`,
        },
    };
}

export default async function PropertyLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    // Mocking the offer schema since we don't have the data here synchronously.
    // Ideally, the client component or a server component would render this based on data.
    const offerSchema = {
        "@context": "https://schema.org",
        "@type": ["Product", "RealEstateListing"],
        "name": `Property ${resolvedParams.id}`,
        "url": `https://shreenathestate.com/portfolio/${resolvedParams.id}`,
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "INR"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
            />
            {children}
        </>
    );
}
