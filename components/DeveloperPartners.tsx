import React from "react";
import Image from "next/image";
import styles from "./DeveloperPartners.module.css";

const DEVELOPERS = [
    { name: "Lodha Group", logo: "/logos/lodha.svg" },
    { name: "Godrej Properties", logo: "/logos/godrej.svg" },
    { name: "Oberoi Realty", logo: "/logos/oberoi.svg" },
    { name: "Hiranandani Group", logo: "/logos/hiranandani.svg" },
    { name: "L&T Realty", logo: "/logos/lt.svg" },
    { name: "Kalpataru Group", logo: "/logos/kalpataru.svg" },
    { name: "Sunteck Realty", logo: "/logos/sunteck.svg" },
    { name: "Piramal Realty", logo: "/logos/piramal.svg" },
    { name: "Rustomjee", logo: "/logos/rustomjee.svg" },
];

export default function DeveloperPartners() {
    // Duplicate logos for seamless infinite scrolling
    const logoList = [...DEVELOPERS, ...DEVELOPERS];

    return (
        <section className={styles.partnersSection}>
            <div className="container">
                <div className={styles.header}>
                    <h2>Trusted Developer Partners</h2>
                    <p>
                        Proudly associated with some of Mumbai&apos;s most respected real estate developers.
                    </p>
                </div>
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    {logoList.map((dev, index) => (
                        <div key={`${dev.name}-${index}`} className={styles.logoWrapper}>
                            <Image
                                src={dev.logo}
                                alt={dev.name}
                                width={200}
                                height={60}
                                className={styles.logo}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
