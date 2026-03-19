"use client";

import Image from "next/image";
import styles from "./ExpandingPanels.module.css";

const panels = [
    {
        id: 1,
        title: "Exclusive Pre-Launches",
        subtitle: "First access to Mumbai's most anticipated developments before they hit the market.",
        image: "/properties/prop1.png",
    },
    {
        id: 2,
        title: "Bespoke Interiors",
        subtitle: "Curated living spaces crafted by world-renowned designers and architects.",
        image: "/properties/prop2.png",
    },
    {
        id: 3,
        title: "Global Investments",
        subtitle: "Diversify your portfolio with strategic international real estate opportunities.",
        image: "/properties/prop3.png",
    },
    {
        id: 4,
        title: "Private Mandates",
        subtitle: "Confidential representation for high-profile acquisitions and sales.",
        image: "/properties/prop4.png",
    },
];

export default function ExpandingPanels() {
    return (
        <section className={`section ${styles.panelsSection} reveal`}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <span className="section-label">Expertise</span>
                    <h2>Our Focus Areas</h2>
                </div>
                <div className={styles.panelsContainer}>
                    {panels.map((panel) => (
                        <div key={panel.id} className={styles.panel}>
                            <div className={styles.panelImageBg}>
                                <Image
                                    src={panel.image}
                                    alt={panel.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    style={{ objectFit: "cover" }}
                                />
                                <div className={styles.overlay} />
                            </div>
                            <div className={styles.panelContent}>
                                <div className={styles.panelContentInner}>
                                    <h3 className={styles.panelTitle}>{panel.title}</h3>
                                    <p className={styles.panelSubtitle}>{panel.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
