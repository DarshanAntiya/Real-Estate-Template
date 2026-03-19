"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "./portfolio.module.css";

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
    images: string[];
}

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

const budgetRanges = [
    { label: "All Budgets", min: 0, max: Infinity },
    { label: "₹3Cr – ₹5Cr", min: 30000000, max: 50000000 },
    { label: "₹5Cr – ₹10Cr", min: 50000000, max: 100000000 },
    { label: "₹10Cr+", min: 100000000, max: Infinity },
];

const locations = [
    "All Locations",
    "South Mumbai",
    "Bandra",
    "Worli",
    "Andheri",
    "Juhu",
    "Powai",
    "Thane",
];

const bhkOptions = ["All BHK", "1", "2", "3", "4+"];

const propertyTypes = [
    "All Types",
    "Residential",
    "Commercial",
    "Under-Construction",
];

const statusOptions = ["All Status", "Available", "Sold", "Rented"];

export default function PortfolioPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState(0);
    const [location, setLocation] = useState("All Locations");
    const [bhk, setBhk] = useState("All BHK");
    const [type, setType] = useState("All Types");
    const [status, setStatus] = useState("All Status");
    const [listing, setListing] = useState("All Options");

    useEffect(() => {
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => {
                setProperties(data.properties || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = properties.filter((p) => {
        const range = budgetRanges[budget];
        if (
            p.price &&
            !p.confidentialPrice &&
            (p.price < range.min || p.price > range.max)
        )
            return false;
        if (
            location !== "All Locations" &&
            !p.location.toLowerCase().includes(location.toLowerCase())
        )
            return false;
        if (bhk !== "All BHK") {
            if (bhk === "4+") {
                if (p.bhk && parseInt(p.bhk) < 4) return false;
            } else {
                if (p.bhk !== bhk) return false;
            }
        }
        if (type !== "All Types" && p.propertyType !== type) return false;
        if (status !== "All Status" && p.status !== status) return false;
        if (
            listing !== "All Options" &&
            p.listingType !== "Both" &&
            `For ${p.listingType}` !== listing
        )
            return false;
        return true;
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible");
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [filtered]);

    return (
        <>
            <Header />

            <section className={styles.pageHero}>
                <div className="container">
                    <span className="section-label">Our Portfolio</span>
                    <h1>Exclusive Listings</h1>
                    <p>
                        Discover luxury residential and commercial properties across
                        Mumbai&apos;s most prestigious locations.
                    </p>
                </div>
            </section>

            <section className={`section ${styles.portfolioBody}`}>
                <div className="container">
                    {/* Filters */}
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label>Budget</label>
                            <select
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                            >
                                {budgetRanges.map((r, i) => (
                                    <option key={r.label} value={i}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>Location</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                {locations.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>BHK</label>
                            <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
                                {bhkOptions.map((b) => (
                                    <option key={b} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                {propertyTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>Listing</label>
                            <select
                                value={listing}
                                onChange={(e) => setListing(e.target.value)}
                            >
                                {["All Options", "For Sale", "For Rent"].map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className={styles.loadingState}>
                            <p>Loading properties...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No Properties Found</h3>
                            <p>
                                Try adjusting your filters or contact us for off-market
                                opportunities.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filtered.map((property, i) => (
                                <Link
                                    key={property.id}
                                    href={`/portfolio/${property.id}`}
                                    className={`${styles.propertyCard} reveal reveal-delay-${(i % 3) + 1
                                        }`}
                                >
                                    <div className={styles.cardImage}>
                                        <div className={styles.cardImageBg}>
                                            <Image
                                                src={property.images?.[0] || "/placeholder-property.jpg"}
                                                alt={property.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
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
                                            style={{ position: "absolute", top: 16, right: 16 }}
                                        >
                                            {property.listingType === "Both"
                                                ? "Sale/Rent"
                                                : `For ${property.listingType}`}
                                        </span>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3>{property.name}</h3>
                                        <p className={styles.cardLoc}>{property.location}</p>
                                        <div className={styles.cardMeta}>
                                            {property.bhk && <span>{property.bhk} BHK</span>}
                                            {property.area && <span>{property.area}</span>}
                                            <span>{property.propertyType}</span>
                                        </div>
                                        <div className={styles.cardPrice}>
                                            {formatPrice(
                                                property.price,
                                                property.startingFrom,
                                                property.confidentialPrice
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <p className={styles.resultCount}>
                        Showing {filtered.length} propert
                        {filtered.length === 1 ? "y" : "ies"}
                    </p>
                </div>
            </section>
        </>
    );
}
