"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./StackedCards.module.css";

const panels = [
    {
        id: 1,
        title: "Luxury Apartments",
        description: "Curated living spaces crafted by world-renowned designers and architects. Experience the pinnacle of urban elegance.",
        image: "/properties/Luxury Apartments.png",
        link: "/portfolio",
        cta: "Explore Apartments",
    },
    {
        id: 2,
        title: "Sea View Residences",
        description: "Wake up to endless horizons. Exclusive waterfront properties offering unparalleled views and serenity.",
        image: "/properties/Stack Luxury Apartment.png",
        link: "/portfolio",
        cta: "View Collection",
    },
    {
        id: 3,
        title: "Premium Villas",
        description: "Private estates that redefine luxury. Sprawling layouts with bespoke amenities for the ultimate lifestyle.",
        image: "/properties/Luxury Villa.png",
        link: "/portfolio",
        cta: "Discover Villas",
    },
    {
        id: 4,
        title: "Penthouses",
        description: "The crown jewels of real estate. Masterpieces of design offering privacy, prestige, and panoramic cityscapes.",
        image: "/properties/Luxury Penthouse.png",
        link: "/portfolio",
        cta: "View Penthouses",
    },
];

export default function StackedCards() {
    return (
        <section className={styles.container}>
            {panels.map((panel, index) => (
                <div
                    key={panel.id}
                    className={styles.panel}
                    style={{ zIndex: index + 1 }}
                >
                    <div className={styles.imageBg}>
                        <Image
                            src={panel.image}
                            alt={panel.title}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                            priority={index === 0}
                        />
                    </div>
                    <div className={styles.overlay} />

                    <div className={styles.content}>
                        <h2 className={styles.title}>{panel.title}</h2>
                        <p className={styles.description}>{panel.description}</p>
                        <Link href={panel.link} className={styles.cta}>
                            {panel.cta}
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}
