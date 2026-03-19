import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import styles from "./location.module.css";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const formattedLocation =
        resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1).replace(/-/g, " ");

    return {
        title: `Luxury Real Estate in ${formattedLocation} | RIZ-WEE & CO.`,
        description: `Discover premium properties, luxury apartments, and commercial real estate in ${formattedLocation}, Mumbai. Expert real estate advisory by RIZ-WEE & CO..`,
        alternates: {
            canonical: `/location/${resolvedParams.slug}`,
        },
    };
}

const getLocationData = (slug: string) => {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
    return {
        name,
        tagline: `Experience the Ultimate Luxury Lifestyle in ${name}, Mumbai`,
        intro: `Welcome to our comprehensive guide to luxury real estate in ${name}. As one of Mumbai's most sought-after and prestigious neighborhoods, ${name} offers an unparalleled lifestyle, combining modern amenities with rich cultural heritage. Whether you are looking for a sea-facing apartment, a sprawling penthouse, or a strategic commercial space, RIZ-WEE & CO. is your trusted partner. Our deep market knowledge and exclusive property portfolio ensure that you find the perfect address that matches your aspirations. Mumbai's real estate market is dynamic, and navigating it requires expertise. In ${name}, the demand for premium homes continues to rise, driven by its excellent connectivity, world-class infrastructure, and a vibrant community. At RIZ-WEE & CO., we specialize in curating properties that offer not just a home, but a legacy.`,
        landmarks: [
            `Iconic promenades and seafront views defining the ${name} skyline.`,
            `Exclusive clubs, luxury hotels, and premium dining destinations.`,
            `Heritage structures blending seamlessly with ultra-modern skyscrapers.`,
        ],
        connectivity: `Connectivity is a major highlight of ${name}. With swift access to the Bandra-Worli Sea Link, the upcoming coastal road, and major arterial highways, residents enjoy seamless travel to the business districts of BKC and South Mumbai. The proximity to domestic and international airports further adds to the convenience for globetrotting individuals and business leaders.`,
        schools: `Families residing in ${name} have access to some of the finest educational institutions in the country. From renowned international schools offering global curricula like IB and IGCSE to prestigious heritage schools, the educational ecosystem here is unparalleled, ensuring a bright future for the next generation.`,
        lifestyle: `The lifestyle in ${name} is the epitome of luxury and convenience. Residents can indulge in high-end retail therapy at designer boutiques, dine at Michelin-starred restaurants, and enjoy a vibrant nightlife. The presence of verdant parks, exclusive sports clubs, and cultural centers ensures a balanced and enriching life. It’s a neighborhood where every amenity is just a stone's throw away.`,
        whyInvest: `Investing in ${name} is a strategic financial decision. The property values here have consistently shown strong appreciation, making it a safe haven for investors. Whether you are seeking rental yield or long-term capital growth, luxury properties in ${name} offer both. RIZ-WEE & CO. provides data-driven insights to help you make informed investment choices in this lucrative market.`,
        mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(name + ", Mumbai")}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
        faqs: [
            {
                question: `What types of luxury properties are available in ${name}?`,
                answer: `We offer a wide range of luxury properties including penthouses, duplexes, sea-facing apartments, and premium commercial spaces in ${name}.`,
            },
            {
                question: `Is ${name} a good area for real estate investment?`,
                answer: `Absolutely. ${name} is one of Mumbai's most prime locations, offering excellent capital appreciation and high rental yields due to continuous infrastructural developments.`,
            },
            {
                question: `How can RIZ-WEE & CO. help me find a property in ${name}?`,
                answer: `As a RERA-registered real estate advisory, we provide personalized end-to-end services, from property shortlisting and site visits to documentation and final registration.`,
            },
        ],
    };
};

export default async function LocationPage({ params }: Props) {
    const resolvedParams = await params;
    const data = getLocationData(resolvedParams.slug);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };

    return (
        <>
            <Header />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <section className={styles.heroSection}>
                <div className="container">
                    <span className="section-label">Location Spotlight</span>
                    <h1 className={styles.heroTitle}>{data.name} Real Estate</h1>
                    <p className={styles.heroSubtitle}>{data.tagline}</p>
                </div>
            </section>

            <main className={styles.mainContent}>
                <div className="container">
                    <article className={styles.article}>
                        <h2>Discover Luxury Living in {data.name}</h2>
                        <p>{data.intro}</p>

                        <div className={styles.gridSection}>
                            <div className={styles.contentBlock}>
                                <h3>Local Landmarks</h3>
                                <ul>
                                    {data.landmarks.map((l, i) => (
                                        <li key={i}>{l}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.contentBlock}>
                                <h3>World-Class Lifestyle</h3>
                                <p>{data.lifestyle}</p>
                            </div>
                        </div>

                        <h2>Connectivity & Infrastructure</h2>
                        <p>{data.connectivity}</p>

                        <h2>Education & Schools</h2>
                        <p>{data.schools}</p>

                        <h2>Investment Potential</h2>
                        <p>{data.whyInvest}</p>
                        <p>
                            Choosing the right property requires understanding the nuances of the local market.
                            Our advisory team is equipped with the latest data on price trends, upcoming infrastructural
                            projects, and neighborhood dynamics. We ensure that you get the best value for your
                            investment, backed by transparent and ethical practices.
                        </p>
                        <p>
                            Are you ready to explore the finest properties in {data.name}? Browse our
                            exclusive <Link href="/portfolio" className={styles.inlineLink}>portfolio</Link> or
                            schedule a <Link href="/#contact" className={styles.inlineLink}>consultation</Link> today.
                        </p>

                        <div className={styles.mapSection}>
                            <h3>{data.name} exploring the Area</h3>
                            <iframe
                                src={data.mapEmbedUrl}
                                width="100%"
                                height="400"
                                style={{ border: 0, borderRadius: "12px", marginTop: "1rem" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${data.name}`}
                            />
                        </div>

                        <section className={styles.faqSection}>
                            <h3>Frequently Asked Questions about {data.name} Real Estate</h3>
                            <div className={styles.faqList}>
                                {data.faqs.map((faq, i) => (
                                    <div key={i} className={styles.faqItem}>
                                        <h4>{faq.question}</h4>
                                        <p>{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </article>
                </div>
            </main>
        </>
    );
}
