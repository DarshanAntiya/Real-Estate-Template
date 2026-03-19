"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import styles from "./Header.module.css";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const lenis = useLenis();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);

            if (pathname === "/") {
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
                setAtBottom(isBottom);
            } else {
                setAtBottom(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [pathname]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setMenuOpen(false);

        // If it's a hash link and we are on the homepage, intercept and smooth scroll
        if (href.startsWith('/#') && pathname === '/') {
            e.preventDefault();
            const targetId = href.replace('/#', '');
            const targetElement = document.getElementById(targetId);
            if (targetElement && lenis) {
                lenis.scrollTo(targetElement, { offset: -90 });
                // Optionally update URL
                window.history.pushState(null, '', `/#${targetId}`);
            }
        }
    };

    const headerScrolled = scrolled && !atBottom;

    return (
        <header className={`${styles.header} ${headerScrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.brand}>
                    <Image
                        src="/logo.png"
                        alt="RIZ-WEE & CO."
                        className={styles.brandLogo}
                        width={90}
                        height={50}
                        quality={100}
                        unoptimized
                        priority
                    />
                    <span className={styles.brandName}>RIZ-WEE &amp; CO.</span>
                </Link>

                <button
                    className={`${styles.menuToggle} ${menuOpen ? styles.open : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                    <Link href="/" onClick={(e) => handleNavClick(e, "/")}>
                        Home
                    </Link>
                    <Link href="/#featured" onClick={(e) => handleNavClick(e, "/#featured")}>
                        Featured
                    </Link>
                    <Link href="/portfolio" onClick={(e) => handleNavClick(e, "/portfolio")}>
                        Portfolio
                    </Link>
                    <Link href="/#about" onClick={(e) => handleNavClick(e, "/#about")}>
                        About
                    </Link>
                    <Link href="/contact" onClick={(e) => handleNavClick(e, "/contact")}>
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}
