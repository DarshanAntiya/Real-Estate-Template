import Link from "next/link";
import styles from "./HeroEnd.module.css";

export default function HeroEnd() {
    return (
        <section className={styles.heroEnd}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h2 className={styles.heading}>Your Exclusive Invitation</h2>
                <p className={styles.subtext}>
                    Join a curated selection of homeowners who have found their perfect luxury residence with RIZ-WEE & CO. Private viewings available upon request.
                </p>
                <Link href="/contact" className={styles.ctaButton}>
                    Inquire Now
                </Link>
            </div>
        </section>
    );
}
