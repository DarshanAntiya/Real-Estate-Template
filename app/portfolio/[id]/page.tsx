"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "./detail.module.css";

interface Property {
    id: string;
    name: string;
    location: string;
    area: string | null;
    bhk: string | null;
    propertyType: string;
    price: number | null;
    startingFrom: boolean;
    confidentialPrice: boolean;
    status: string;
    listingType: string;
    featured: boolean;
    amenities: string[];
    mapEmbedUrl: string | null;
    images: string[];
    description: string | null;
}

function formatPrice(
    price: number | null,
    startingFrom: boolean,
    confidentialPrice: boolean
) {
    if (confidentialPrice) return "Price Upon Confidential Request";
    if (!price) return "Price on Request";
    const cr = price / 10000000;
    const prefix = startingFrom ? "Starting From " : "";
    if (cr >= 1) return `${prefix}₹${cr.toFixed(cr % 1 === 0 ? 0 : 1)} Cr`;
    const lakh = price / 100000;
    return `${prefix}₹${lakh.toFixed(0)} L`;
}

export default function PropertyDetailPage() {
    const params = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    /* Form state */
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        honeypot: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        fetch(`/api/properties/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setProperty(data.property || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    propertyId: property?.id,
                    source: "property-detail",
                }),
            });
            setSubmitted(true);
        } catch {
            alert("Something went wrong. Please try WhatsApp instead.");
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.loadingPage}>
                    <p>Loading property details...</p>
                </div>
            </>
        );
    }

    if (!property) {
        return (
            <>
                <Header />
                <div className={styles.loadingPage}>
                    <h2>Property Not Found</h2>
                    <p>This property may no longer be available.</p>
                    <Link href="/portfolio" className="btn btn-primary">
                        Browse Portfolio
                    </Link>
                </div>
            </>
        );
    }

    const images =
        property.images.length > 0
            ? property.images
            : ["/placeholder-property.jpg"];
    const amenities = Array.isArray(property.amenities)
        ? property.amenities
        : [];

    return (
        <>
            <Header />

            {/* Lightbox */}
            {lightbox && (
                <div className={styles.lightbox} onClick={() => setLightbox(false)}>
                    <button
                        className={styles.lightboxClose}
                        onClick={() => setLightbox(false)}
                    >
                        ✕
                    </button>
                    <div style={{ position: "relative", width: "90vw", height: "80vh" }}>
                        <Image
                            src={images[activeImage]}
                            alt={property.name}
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <div className={styles.lightboxNav}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveImage((p) => (p > 0 ? p - 1 : images.length - 1));
                            }}
                        >
                            ←
                        </button>
                        <span>
                            {activeImage + 1} / {images.length}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveImage((p) => (p < images.length - 1 ? p + 1 : 0));
                            }}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

            <section className={styles.detailHero}>
                <div className="container">
                    <Link href="/portfolio" className={styles.backLink}>
                        ← Back to Portfolio
                    </Link>
                </div>
            </section>

            <section className={styles.detailBody}>
                <div className="container">
                    <div className={styles.detailGrid}>
                        {/* Left: Gallery + Details */}
                        <div className={styles.detailLeft}>
                            {/* Gallery */}
                            <div className={styles.gallery}>
                                <div
                                    className={styles.mainImage}
                                    onClick={() => setLightbox(true)}
                                    style={{ cursor: "pointer", position: "relative", minHeight: "400px" }}
                                >
                                    <Image
                                        src={images[activeImage]}
                                        alt={property.name}
                                        fill
                                        style={{ objectFit: "cover", borderRadius: "8px" }}
                                    />
                                </div>
                                {images.length > 1 && (
                                    <div className={styles.thumbs}>
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ""
                                                    }`}
                                                onClick={() => setActiveImage(i)}
                                                style={{ position: "relative", overflow: "hidden" }}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`View ${i + 1}`}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className={styles.infoBlock}>
                                <div className={styles.infoHeader}>
                                    <div>
                                        <h1>{property.name}</h1>
                                        <p className={styles.infoLoc}>{property.location}</p>
                                    </div>
                                    <span
                                        className={`badge ${property.status === "Available"
                                            ? "badge-available"
                                            : property.status === "Sold"
                                                ? "badge-sold"
                                                : "badge-rented"
                                            }`}
                                    >
                                        {property.status}
                                    </span>
                                </div>

                                <div className={styles.priceRow}>
                                    <span className={styles.priceValue}>
                                        {formatPrice(
                                            property.price,
                                            property.startingFrom,
                                            property.confidentialPrice
                                        )}
                                    </span>
                                    <span className={styles.priceNote}>
                                        Pricing subject to availability.
                                    </span>
                                </div>

                                <div className={styles.detailTags}>
                                    {property.bhk && (
                                        <div className={styles.detailTag}>
                                            <span className={styles.tagLabel}>Configuration</span>
                                            <span className={styles.tagValue}>
                                                {property.bhk} BHK
                                            </span>
                                        </div>
                                    )}
                                    {property.area && (
                                        <div className={styles.detailTag}>
                                            <span className={styles.tagLabel}>Area</span>
                                            <span className={styles.tagValue}>{property.area}</span>
                                        </div>
                                    )}
                                    <div className={styles.detailTag}>
                                        <span className={styles.tagLabel}>Type</span>
                                        <span className={styles.tagValue}>
                                            {property.propertyType}
                                        </span>
                                    </div>
                                    <div className={styles.detailTag}>
                                        <span className={styles.tagLabel}>Status</span>
                                        <span className={styles.tagValue}>{property.status}</span>
                                    </div>
                                    <div className={styles.detailTag}>
                                        <span className={styles.tagLabel}>Listing For</span>
                                        <span className={styles.tagValue}>
                                            {property.listingType === "Both"
                                                ? "Sale & Rent"
                                                : property.listingType}
                                        </span>
                                    </div>
                                </div>

                                {property.description && (
                                    <div className={styles.descBlock}>
                                        <h3>About This Property</h3>
                                        <p>{property.description}</p>
                                    </div>
                                )}

                                {amenities.length > 0 && (
                                    <div className={styles.amenitiesBlock}>
                                        <h3>Amenities</h3>
                                        <div className={styles.amenitiesList}>
                                            {amenities.map((a) => (
                                                <span key={String(a)} className={styles.amenity}>
                                                    ✓ {String(a)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {property.mapEmbedUrl && (
                                    <div className={styles.mapBlock}>
                                        <h3>Location</h3>
                                        <div className={styles.mapEmbed}>
                                            <iframe
                                                src={property.mapEmbedUrl}
                                                width="100%"
                                                height="300"
                                                style={{ border: 0, borderRadius: 12 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="Property Location"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Inquiry Form */}
                        <div className={styles.detailRight}>
                            <div className={styles.inquiryCard}>
                                <h3>Interested in This Property?</h3>
                                <p>
                                    Submit your details and our team will get back to you shortly.
                                </p>

                                {submitted ? (
                                    <div className={styles.successMsg}>
                                        <span className={styles.successIcon}>✓</span>
                                        <h4>Thank You!</h4>
                                        <p>
                                            We&apos;ve received your inquiry. Our team will contact
                                            you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: "none" }} aria-hidden="true">
                                            <label htmlFor="bot-field">Do not fill this out</label>
                                            <input
                                                id="bot-field"
                                                name="honeypot"
                                                type="text"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={form.honeypot}
                                                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                pattern="^[A-Za-z\s]+$"
                                                title="Only letters and spaces are allowed."
                                                placeholder="Your full name"
                                                value={form.name}
                                                onChange={(e) =>
                                                    setForm({ ...form, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm({ ...form, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                minLength={10}
                                                maxLength={10}
                                                pattern="^[0-9]{10}$"
                                                title="Please enter exactly 10 digits."
                                                placeholder="10 digit number"
                                                value={form.phone}
                                                onChange={(e) =>
                                                    setForm({ ...form, phone: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">Message (Optional)</label>
                                            <textarea
                                                id="message"
                                                placeholder="Tell us about your requirements..."
                                                value={form.message}
                                                onChange={(e) =>
                                                    setForm({ ...form, message: e.target.value })
                                                }
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ width: "100%" }}
                                            disabled={submitting}
                                        >
                                            {submitting ? "Submitting..." : "Submit Inquiry"}
                                        </button>
                                    </form>
                                )}

                                <div className={styles.dividerOr}>
                                    <span>or</span>
                                </div>

                                <a
                                    href={`https://wa.me/919999999999?text=Hi, I'm interested in ${encodeURIComponent(
                                        property.name
                                    )} at ${encodeURIComponent(property.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn ${styles.waBtn}`}
                                >
                                    <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
                                        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.058 9.376L1.06 31.08l5.893-1.948A15.905 15.905 0 0 0 16.004 32C24.828 32 32 24.824 32 16.004 32 7.176 24.828 0 16.004 0Zm9.314 22.6c-.392 1.104-1.944 2.02-3.204 2.288-.864.18-1.992.324-5.792-1.244-4.86-2.008-7.988-6.94-8.228-7.26-.232-.32-1.944-2.588-1.944-4.936 0-2.348 1.232-3.504 1.668-3.98.392-.432 1.036-.632 1.652-.632.2 0 .38.02.54.036.436.02.656.044.944.732.36.86 1.236 3.012 1.344 3.232.108.22.216.512.068.812-.14.308-.264.496-.484.764-.22.268-.432.472-.652.76-.2.252-.424.524-.176.96.248.432 1.104 1.82 2.372 2.948 1.632 1.452 3.008 1.904 3.44 2.112.432.208.684.176.936-.108.26-.292 1.1-1.28 1.392-1.72.288-.432.58-.36.976-.216.4.14 2.544 1.2 2.98 1.42.436.22.728.328.836.512.104.184.104 1.068-.288 2.172v-.008Z" />
                                    </svg>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
