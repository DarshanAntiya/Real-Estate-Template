import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | RIZ-WEE & CO. | Luxury Real Estate Advisory",
  description:
    "Schedule a confidential consultation with RIZ-WEE & CO. — Mumbai's trusted luxury real estate advisory. Reach out for personalized property guidance.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />

      {/* ===== HERO BANNER ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroImage}>
          <Image
            src="/contact-hero.jpg"
            alt="RIZ-WEE & CO. Office"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>
            Schedule a confidential consultation with our advisory team.
          </p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT ===== */}
      <section className={styles.contactPage}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Left Column — Info */}
            <div className={styles.infoColumn}>
              <span className={styles.sectionLabel}>Get in Touch</span>
              <h2 className={styles.heading}>
                Let&apos;s Find Your
                <br />
                Perfect Address.
              </h2>
              <p className={styles.subtitle}>
                Whether you&apos;re looking to buy, sell, or invest in
                Mumbai&apos;s luxury market — our advisory team is here to guide
                you with discretion and expertise.
              </p>
              <div className={styles.divider} />

              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div className={styles.contactItemContent}>
                    <h4>Office</h4>
                    <p>Mumbai, Maharashtra, India</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📞</div>
                  <div className={styles.contactItemContent}>
                    <h4>Phone</h4>
                    <a href="tel:+919999999999">+91 99999 99999</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>💬</div>
                  <div className={styles.contactItemContent}>
                    <h4>WhatsApp</h4>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉️</div>
                  <div className={styles.contactItemContent}>
                    <h4>Email</h4>
                    <a href="mailto:info@shreenathestate.com">
                      info@shreenathestate.com
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="WhatsApp"
                >
                  💬
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram"
                >
                  📷
                </a>
              </div>
            </div>

            {/* Right Column — Form */}
            <div className={styles.formColumn}>
              <h2 className={styles.formHeading}>
                Schedule a Consultation
              </h2>
              <p className={styles.formSubheading}>
                Fill in your details and our advisory team will reach out
                confidentially.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
