"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.footerBrand}>
                    <Image
                        src="/logo.png"
                        alt="RIZ-WEE & CO."
                        className={styles.footerLogo}
                        width={125}
                        height={70}
                        quality={100}
                        unoptimized
                    />
                </div>
                <div className={styles.footerInfo}>
                    <div className={styles.footerCol}>
                        <h4>Quick Links</h4>
                        <Link href="/">Home</Link>
                        <Link href="/portfolio">Portfolio</Link>
                        <Link href="/#about">About</Link>
                        <Link href="/contact">Contact</Link>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>Locations</h4>
                        <Link href="/location/bandra">Bandra</Link>
                        <Link href="/location/worli">Worli</Link>
                        <Link href="/location/south-mumbai">South Mumbai</Link>
                        <Link href="/location/juhu">Juhu</Link>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>Contact</h4>
                        <p>Mumbai, Maharashtra, India</p>
                        <a
                            href="https://wa.me/919999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <div className={styles.reraBadge}>
                        <span className={styles.reraIcon}>✓</span>
                        <span>RERA Registered</span>
                    </div>
                    <p>
                        © {new Date().getFullYear()} RIZ-WEE & CO.. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
