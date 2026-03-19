"use client";

import { useEffect, useState } from "react";
import styles from "./portal.module.css";

interface Stats {
    total: number;
    active: number;
    featured: number;
    leads: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        total: 0,
        active: 0,
        featured: 0,
        leads: 0,
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/portal/properties").then((r) => r.json()),
            fetch("/api/portal/leads").then((r) => r.json()),
        ]).then(([propData, leadData]) => {
            const props = propData.properties || [];
            setStats({
                total: props.length,
                active: props.filter((p: { active: boolean }) => p.active).length,
                featured: props.filter((p: { featured: boolean }) => p.featured).length,
                leads: (leadData.leads || []).length,
            });
        });
    }, []);

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>Dashboard</h1>
                <p>Overview of your portfolio and inquiries</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h4>Total Properties</h4>
                    <span className={styles.statValue}>{stats.total}</span>
                </div>
                <div className={styles.statCard}>
                    <h4>Active Listings</h4>
                    <span className={styles.statValue}>{stats.active}</span>
                </div>
                <div className={styles.statCard}>
                    <h4>Featured</h4>
                    <span className={styles.statValue}>{stats.featured}</span>
                </div>
                <div className={styles.statCard}>
                    <h4>Total Leads</h4>
                    <span className={styles.statValue}>{stats.leads}</span>
                </div>
            </div>
        </>
    );
}
