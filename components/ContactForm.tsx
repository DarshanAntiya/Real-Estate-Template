"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        honeypot: "", // Used to catch bots
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                    source: "consultation_form",
                    honeypot: formData.honeypot, // bots will fill this, failing backend check or returning fake success
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit inquiry.");
            }

            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phone: "", honeypot: "" });
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    if (status === "success") {
        return (
            <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Request Received</h3>
                <p>Our advisory team has received your information and will contact you confidentially shortly.</p>
                <button
                    className="btn btn-outline"
                    onClick={() => setStatus("idle")}
                    style={{ marginTop: "24px", borderColor: "rgba(255,255,255,0.2)", color: "var(--white)" }}
                >
                    Submit Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
            {/* Honeypot field - visually hidden, prevents bots that fill all fields */}
            <input
                type="text"
                name="honeypot"
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={handleChange}
            />

            <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        minLength={1}
                        maxLength={50}
                        pattern="^[A-Za-z\s]+$"
                        title="Only letters and spaces are allowed."
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="lastName">Surname</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        minLength={1}
                        maxLength={50}
                        pattern="^[A-Za-z\s]+$"
                        title="Only letters and spaces are allowed."
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        minLength={10}
                        maxLength={10}
                        pattern="^[0-9]{10}$"
                        title="Please enter exactly 10 digits."
                        placeholder="10 digit number"
                        className={styles.input}
                    />
                </div>
            </div>

            {status === "error" && <div className={styles.errorMessage}>{errorMessage}</div>}

            <button
                type="submit"
                disabled={status === "submitting"}
                className={`btn btn-primary ${styles.submitButton}`}
            >
                {status === "submitting" ? "Submitting..." : "Schedule Confidential Consultation"}
            </button>
        </form>
    );
}
