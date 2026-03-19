import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Property Portfolio | RIZ-WEE & CO. | Real Estate Mumbai",
    description: "Explore our curated portfolio of luxury residential and commercial properties in Mumbai. Find your dream home or next investment with RIZ-WEE & CO..",
    alternates: {
        canonical: "/portfolio",
    },
};

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://shreenathestate.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Portfolio",
                "item": "https://shreenathestate.com/portfolio"
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
