"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Header from "@/components/Header";
import DeveloperPartners from "@/components/DeveloperPartners";

import StackedCards from "@/components/StackedCards";
import HeroEnd from "@/components/HeroEnd";
import ScrollRevealText from "@/components/ScrollRevealText";
import styles from "./page.module.css";

/* ——— Types ——— */
interface Property {
  id: string;
  name: string;
  location: string;
  price: number | null;
  startingFrom: boolean;
  confidentialPrice: boolean;
  status: string;
  listingType: string;
  propertyType: string;
  bhk: string | null;
  images: string[];
}

/* ——— Scroll Reveal Hook ——— */
function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ——— Price Formatter ——— */
function formatPrice(
  price: number | null,
  startingFrom: boolean,
  confidentialPrice: boolean
) {
  if (confidentialPrice) return "Price on Request";
  if (!price) return "Price on Request";
  const cr = price / 10000000;
  const prefix = startingFrom ? "Starting From " : "";
  if (cr >= 1) return `${prefix}₹${cr.toFixed(cr % 1 === 0 ? 0 : 1)} Cr`;
  const lakh = price / 100000;
  return `${prefix}₹${lakh.toFixed(0)} L`;
}

/* ——— Testimonials Data ——— */
const testimonials = [
  {
    name: "Rajesh & Priya Mehta",
    text: "RIZ-WEE & CO. understood exactly what we were looking for. Their discretion and market knowledge helped us secure our dream home in Bandra within weeks.",
    role: "Homeowners, Bandra West",
  },
  {
    name: "Vikram Shah",
    text: "As an investor, I value precision and transparency. RIZ-WEE & CO. delivered both — their advisory on commercial properties has been exceptional.",
    role: "Investor & Business Owner",
  },
  {
    name: "Ananya & Suresh Iyer",
    text: "From the first consultation to closing, the experience was seamless. They truly live up to their promise of transforming dreams into homes.",
    role: "Homeowners, Worli",
  },
];


// Animation variants for staggered grid items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.8 },
  },
};

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Responsive check for scroll animations
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion scroll hooks for hero animation
  const { scrollY } = useScroll();

  // Transform values for desktop only viewports
  // Background zooms from 1.2 to 1 as we scroll from 0 to 800px (approx height of hero)
  const bgScale = useTransform(scrollY, [0, 800], [1.2, 1.0]);

  // Text content fades from 1 opacity to 0.6 opacity as we scroll
  const contentOpacity = useTransform(scrollY, [0, 600], [1.0, 0.4]);

  useScrollReveal([featuredProperties]);

  useEffect(() => {
    fetch("/api/properties?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.properties) setFeaturedProperties(data.properties.slice(0, 4));
      })
      .catch(() => { });
  }, []);

  // Scroll-driven theme transition: toggle dark class on the About section only
  useEffect(() => {
    const aboutEl = aboutRef.current;
    if (!aboutEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aboutEl.classList.add(styles.aboutDark);
        } else {
          aboutEl.classList.remove(styles.aboutDark);
        }
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0,
      }
    );

    observer.observe(aboutEl);
    return () => {
      observer.disconnect();
      aboutEl.classList.remove(styles.aboutDark);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />

      {/* ===== HERO ===== */}
      <main>
        <section className={styles.heroWrapper}>
          <div className={styles.heroSticky}>
            {/* Animated Background Video */}
            <motion.div
              className={styles.heroVideo}
              style={{
                scale: isMobile ? 1 : bgScale,
                willChange: "transform"
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/hero-poster.jpg"
              >
                <source src="/hero-video new.mp4" type="video/mp4" />
              </video>
              <div className={styles.heroOverlay} />
            </motion.div>

            {/* Animated Hero Content */}
            <motion.div
              className={styles.heroContent}
              style={{
                opacity: isMobile ? 1 : contentOpacity,
                willChange: "opacity"
              }}
            >
              <h1 className={styles.heroTitle}>
                Exceptional Homes.
                <br />
                Distinguished Addresses.
              </h1>
              <p className={styles.heroSub}>
                Private, RERA-Registered Real Estate Advisory for Mumbai&apos;s
                Luxury Market.
                <br />
                100+ Successful Closings &nbsp;|&nbsp; 5 Years of Trusted
                Representation
              </p>
              <Link href="/portfolio" className={`btn btn-primary ${styles.heroCta}`}>
                View Exclusive Listings
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className={styles.heroScroll}
              style={{
                opacity: isMobile ? 1 : contentOpacity,
                willChange: "opacity"
              }}
            >
              <span />
            </motion.div>
          </div>
        </section>

        <div className={styles.contentWrapper}>
          {/* ===== SCROLL REVEAL TEXT ===== */}
          <ScrollRevealText />

          {/* ===== FEATURED PORTFOLIO ===== */}
          <section id="featured" className={`section ${styles.portfolioSection}`}>
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label">Current Portfolio</span>
                <h2>A Curated Selection</h2>
                <p>
                  Residential and commercial opportunities in Mumbai&apos;s most
                  distinguished addresses.
                </p>
              </div>

              {/* Animated Matrix Grid */}
              <motion.div
                key={featuredProperties.length > 0 ? "loaded" : "loading"}
                className={styles.propertyGrid}
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {featuredProperties.length > 0 ? (
                  featuredProperties.map((property, i) => (
                    <motion.div
                      key={property.id}
                      variants={cardVariants}
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      className={`card`}
                    >
                      <Link href={`/portfolio/${property.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.cardImage}>
                          <motion.div
                            className={styles.cardImageBg}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Image
                              src={property.images?.[0] || "/placeholder-property.jpg"}
                              alt={property.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                            />
                          </motion.div>
                          <span
                            className={`badge ${property.status === "Available"
                              ? "badge-available"
                              : property.status === "Sold"
                                ? "badge-sold"
                                : "badge-rented"
                              } ${styles.cardBadge}`}
                          >
                            {property.status}
                          </span>
                          <span
                            className={`badge ${property.listingType === "Sale"
                              ? "badge-sale"
                              : property.listingType === "Rent"
                                ? "badge-rent"
                                : "badge-both"
                              }`}
                            style={{ position: 'absolute', top: 16, right: 16 }}
                          >
                            {property.listingType === "Both" ? "Sale/Rent" : `For ${property.listingType}`}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <h3 className={styles.cardTitle}>{property.name}</h3>
                          <p className={styles.cardLocation}>{property.location}</p>
                          <div className={styles.cardMeta}>
                            {property.bhk && (
                              <span className={styles.cardMetaItem}>
                                {property.bhk} BHK
                              </span>
                            )}
                            <span className={styles.cardMetaItem}>
                              {property.propertyType}
                            </span>
                          </div>
                          <div className={styles.cardFooter}>
                            <span className={styles.cardPrice}>
                              {formatPrice(
                                property.price,
                                property.startingFrom,
                                property.confidentialPrice
                              )}
                            </span>
                            <span
                              className={styles.cardLink}
                            >
                              View Details →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  /* Placeholder cards when no data */
                  [1, 2, 3].map((i) => (
                    <div key={i} className={`card reveal reveal-delay-${i}`}>
                      <div className={styles.cardImage}>
                        <div className={styles.cardImageBg}>
                          <Image
                            src="/placeholder-property.jpg"
                            alt="Placeholder Property"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <span className={`badge badge-available ${styles.cardBadge}`}>
                          Available
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>
                          {["Luxe Residences", "The Pinnacle", "Marina Heights"][i - 1]}
                        </h3>
                        <p className={styles.cardLocation}>
                          {["Bandra West", "Worli Sea Face", "Marine Drive"][i - 1]}
                        </p>
                        <div className={styles.cardMeta}>
                          <span className={styles.cardMetaItem}>
                            {["3", "4", "3"][i - 1]} BHK
                          </span>
                          <span className={styles.cardMetaItem}>Residential</span>
                        </div>
                        <div className={styles.cardFooter}>
                          <span className={styles.cardPrice}>
                            Starting From ₹{[3.5, 7, 12][i - 1]} Cr
                          </span>
                          <Link href="/portfolio" className={styles.cardLink}>
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>

              <div className={styles.portfolioCta}>
                <Link href="/portfolio" className="btn btn-outline">
                  Explore Full Portfolio
                </Link>
              </div>
            </div>
          </section>

          {/* ===== STACKED CARDS (OUR FOCUS AREAS) ===== */}
          <StackedCards />

          {/* ===== DEVELOPER PARTNERS ===== */}
          <DeveloperPartners />




          {/* ===== ABOUT ===== */}
          <section id="about" ref={aboutRef} className={`section ${styles.aboutSection}`}>
            <div className="container">
              <div className={styles.aboutGrid}>
                <div className={`${styles.aboutImage} reveal`}>
                  <Image
                    src="/about-profile.png"
                    alt="RIZ-WEE & CO. — Professional Real Estate Advisory"
                    className={styles.aboutImageInner}
                    width={400}
                    height={533}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={`${styles.aboutContent} reveal reveal-delay-2`}>
                  <span className="section-label">About Us</span>
                  <h2>Private Real Estate Advisory</h2>
                  <div className="divider" style={{ margin: "20px 0" }} />
                  <p>
                    At RIZ-WEE & CO., we represent opportunity with discretion,
                    clarity, and strategic precision — ensuring each property aligns
                    with both ambition and long-term value.
                  </p>
                  <p style={{ marginTop: "16px" }}>
                    With over 5 years of dedicated experience in Mumbai&apos;s luxury
                    real estate market and 100+ successful transactions, we have
                    built a reputation grounded in trust, transparency, and
                    personalized service.
                  </p>
                  <p style={{ marginTop: "16px" }}>
                    As a RERA-registered firm, we bring regulatory compliance and
                    market intelligence to every engagement — whether it&apos;s a
                    premium residence, a strategic commercial acquisition, or a
                    high-potential under-construction opportunity.
                  </p>
                  <div className={styles.aboutStats}>
                    <div className={styles.aboutStat}>
                      <span className={styles.aboutStatNum}>100+</span>
                      <span className={styles.aboutStatLabel}>Successful Closings</span>
                    </div>
                    <div className={styles.aboutStat}>
                      <span className={styles.aboutStatNum}>5+</span>
                      <span className={styles.aboutStatLabel}>Years Experience</span>
                    </div>
                    <div className={styles.aboutStat}>
                      <span className={styles.aboutStatNum}>Premium</span>
                      <span className={styles.aboutStatLabel}>Luxury Portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* ===== TESTIMONIALS ===== */}
          <section className={`section ${styles.testimonialSection}`}>
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label">Client Stories</span>
                <h2>Trusted by Distinguished Clients</h2>
              </div>

              <div className={styles.testimonialCarousel}>
                {testimonials.map((t, i) => (
                  <div
                    key={t.name}
                    className={`${styles.testimonialCard} ${i === currentTestimonial ? styles.testimonialActive : ""
                      }`}
                  >
                    <div className={styles.testimonialQuote}>&ldquo;</div>
                    <p className={styles.testimonialText}>{t.text}</p>
                    <div className={styles.testimonialAuthor}>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                ))}
                <div className={styles.testimonialDots}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.dot} ${i === currentTestimonial ? styles.dotActive : ""
                        }`}
                      onClick={() => setCurrentTestimonial(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>


        </div>
      </main>

      <HeroEnd />

      {/* ===== FOOTER ===== */}
      {/* ===== FOOTER REMOVED (Rendered correctly in layout.tsx) ===== */}
    </>
  );
}
