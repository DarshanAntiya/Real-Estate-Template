"use client";

import { useEffect, useState } from "react";
import styles from "../portal.module.css";

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string | null;
    source: string;
    createdAt: string;
    property: { name: string; location: string } | null;
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        fetch("/api/portal/leads")
            .then((r) => r.json())
            .then((data) => setLeads(data.leads || []));
    }, []);

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>Leads</h1>
                <p>All property inquiries from your website</p>
            </div>

            <div className={styles.toolbar}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {leads.length} total leads
                </span>
            </div>

            <div className={styles.tableWrap}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Property</th>
                            <th>Message</th>
                            <th>Source</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                                    <p style={{ color: "var(--text-muted)" }}>
                                        No leads yet. They will appear here when visitors submit
                                        inquiries.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        <strong>{lead.name}</strong>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13 }}>{lead.email}</div>
                                        <div
                                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                                        >
                                            {lead.phone}
                                        </div>
                                    </td>
                                    <td>
                                        {lead.property ? (
                                            <>
                                                <div style={{ fontSize: 13 }}>
                                                    {lead.property.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: "var(--text-muted)",
                                                    }}
                                                >
                                                    {lead.property.location}
                                                </div>
                                            </>
                                        ) : (
                                            <span style={{ color: "var(--text-muted)" }}>
                                                General
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                fontSize: 13,
                                                color: "var(--text-light)",
                                                maxWidth: 200,
                                                display: "block",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {lead.message || "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="badge badge-available"
                                            style={{ fontSize: 10 }}
                                        >
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
