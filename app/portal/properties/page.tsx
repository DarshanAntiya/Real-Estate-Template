
"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../portal.module.css";

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
    active: boolean;
    amenities: string[];
    mapEmbedUrl: string | null;
    images: string[];
    description: string | null;
}

const emptyForm = {
    name: "",
    location: "",
    area: "",
    bhk: "",
    propertyType: "Residential",
    price: "",
    startingFrom: false,
    confidentialPrice: false,
    status: "Available",
    listingType: "Sale",
    featured: false,
    active: true,
    amenities: [] as string[],
    mapEmbedUrl: "",
    images: [] as string[],
    description: "",
};

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Property | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [amenityInput, setAmenityInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const fetchProperties = useCallback(async () => {
        const res = await fetch("/api/portal/properties");
        const data = await res.json();
        setProperties(data.properties || []);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            const res = await fetch("/api/portal/properties");
            const data = await res.json();
            if (isMounted) {
                setProperties(data.properties || []);
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (p: Property) => {
        setEditing(p);
        setForm({
            name: p.name,
            location: p.location,
            area: p.area || "",
            bhk: p.bhk || "",
            propertyType: p.propertyType,
            price: p.price ? String(p.price) : "",
            startingFrom: p.startingFrom,
            confidentialPrice: p.confidentialPrice,
            status: p.status,
            listingType: p.listingType,
            featured: p.featured,
            active: p.active,
            amenities: Array.isArray(p.amenities) ? p.amenities : [],
            mapEmbedUrl: p.mapEmbedUrl || "",
            images: Array.isArray(p.images) ? p.images : [],
            description: p.description || "",
        });
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const url = editing
            ? `/api/portal/properties/${editing.id}`
            : "/api/portal/properties";
        const method = editing ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setSaving(false);
        setShowModal(false);
        fetchProperties();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        await fetch(`/api/portal/properties/${id}`, { method: "DELETE" });
        fetchProperties();
    };

    const toggleField = async (
        id: string,
        field: string,
        current: boolean
    ) => {
        await fetch(`/api/portal/properties/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: !current }),
        });
        fetchProperties();
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        await fetch(`/api/portal/properties/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchProperties();
    };

    const addAmenity = () => {
        if (amenityInput.trim()) {
            setForm({
                ...form,
                amenities: [...form.amenities, amenityInput.trim()],
            });
            setAmenityInput("");
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        setUploading(true);
        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/portal/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    newImages.push(data.url);
                } else {
                    alert("Failed to upload: " + file.name);
                }
            } catch (error) {
                console.error("Upload error:", error);
                alert("Upload failed for " + file.name);
            }
        }

        if (newImages.length > 0) {
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }));
        }
        setUploading(false);
    };

    const formatPrice = (price: number | null) => {
        if (!price) return "—";
        const cr = price / 10000000;
        if (cr >= 1) return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 1)} Cr`;
        return `₹${(price / 100000).toFixed(0)} L`;
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>Properties</h1>
                <p>Manage your property listings</p>
            </div>

            <div className={styles.toolbar}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {properties.length} properties
                </span>
                <button className="btn btn-primary" onClick={openCreate}>
                    + Add Property
                </button>
            </div>

            <div className={styles.tableWrap}>
                <table>
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Listing For</th>
                            <th>Featured</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <strong style={{ display: "block", marginBottom: 2 }}>
                                        {p.name}
                                    </strong>
                                    <span
                                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                                    >
                                        {p.location}
                                        {p.bhk ? ` · ${p.bhk} BHK` : ""}
                                    </span>
                                </td>
                                <td>{p.propertyType}</td>
                                <td>
                                    {p.confidentialPrice ? (
                                        <em style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                            Confidential
                                        </em>
                                    ) : (
                                        <>
                                            {p.startingFrom && (
                                                <span
                                                    style={{ fontSize: 11, color: "var(--text-muted)" }}
                                                >
                                                    From{" "}
                                                </span>
                                            )}
                                            {formatPrice(p.price)}
                                        </>
                                    )}
                                </td>
                                <td>
                                    <select
                                        className={styles.statusSelect}
                                        value={p.status}
                                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Rented">Rented</option>
                                    </select>
                                </td>
                                <td>{p.listingType}</td>
                                <td>
                                    <button
                                        className={`${styles.toggle} ${p.featured ? styles.active : ""
                                            }`}
                                        onClick={() => toggleField(p.id, "featured", p.featured)}
                                    />
                                </td>
                                <td>
                                    <button
                                        className={`${styles.toggle} ${p.active ? styles.active : ""
                                            }`}
                                        onClick={() => toggleField(p.id, "active", p.active)}
                                    />
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => openEdit(p)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== Modal ===== */}
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <div className={styles.modal}>
                        <h2>{editing ? "Edit Property" : "Add New Property"}</h2>
                        <form onSubmit={handleSave}>
                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label>Property Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        placeholder="e.g. The Imperial Residences"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.location}
                                        onChange={(e) =>
                                            setForm({ ...form, location: e.target.value })
                                        }
                                        placeholder="e.g. Worli, Mumbai"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Area</label>
                                    <input
                                        type="text"
                                        value={form.area}
                                        onChange={(e) =>
                                            setForm({ ...form, area: e.target.value })
                                        }
                                        placeholder="e.g. 2,500 sq.ft."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>BHK</label>
                                    <input
                                        type="text"
                                        value={form.bhk}
                                        onChange={(e) =>
                                            setForm({ ...form, bhk: e.target.value })
                                        }
                                        placeholder="e.g. 3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Property Type</label>
                                    <select
                                        value={form.propertyType}
                                        onChange={(e) =>
                                            setForm({ ...form, propertyType: e.target.value })
                                        }
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Under-Construction">
                                            Under-Construction
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
                                        }
                                        placeholder="e.g. 75000000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({ ...form, status: e.target.value })
                                        }
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Rented">Rented</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Listing Type</label>
                                    <select
                                        value={form.listingType}
                                        onChange={(e) =>
                                            setForm({ ...form, listingType: e.target.value })
                                        }
                                    >
                                        <option value="Sale">Sale</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Both">Both (Sale & Rent)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Google Maps Embed URL</label>
                                    <input
                                        type="text"
                                        value={form.mapEmbedUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, mapEmbedUrl: e.target.value })
                                        }
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                </div>

                                {/* Toggles row */}
                                <div>
                                    <div className={styles.checkRow}>
                                        <input
                                            type="checkbox"
                                            id="startingFrom"
                                            checked={form.startingFrom}
                                            onChange={(e) =>
                                                setForm({ ...form, startingFrom: e.target.checked })
                                            }
                                        />
                                        <label htmlFor="startingFrom">
                                            Show &quot;Starting From&quot;
                                        </label>
                                    </div>
                                    <div className={styles.checkRow}>
                                        <input
                                            type="checkbox"
                                            id="confidential"
                                            checked={form.confidentialPrice}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    confidentialPrice: e.target.checked,
                                                })
                                            }
                                        />
                                        <label htmlFor="confidential">
                                            Price Upon Confidential Request
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.checkRow}>
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={form.featured}
                                            onChange={(e) =>
                                                setForm({ ...form, featured: e.target.checked })
                                            }
                                        />
                                        <label htmlFor="featured">Featured</label>
                                    </div>
                                    <div className={styles.checkRow}>
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={form.active}
                                            onChange={(e) =>
                                                setForm({ ...form, active: e.target.checked })
                                            }
                                        />
                                        <label htmlFor="active">Active (Listed)</label>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className={`form-group ${styles.formFull}`}>
                                    <label>Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                        placeholder="Property description..."
                                        rows={3}
                                    />
                                </div>

                                {/* Amenities */}
                                <div className={`form-group ${styles.formFull}`}>
                                    <label>Amenities</label>
                                    <div className={styles.tagsInput}>
                                        {form.amenities.map((a, i) => (
                                            <span key={i} className={styles.tag}>
                                                {a}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            amenities: form.amenities.filter(
                                                                (_, j) => j !== i
                                                            ),
                                                        })
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            className={styles.tagField}
                                            value={amenityInput}
                                            onChange={(e) => setAmenityInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addAmenity();
                                                }
                                            }}
                                            placeholder="Type & press Enter"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className={`form-group ${styles.formFull}`}>
                                    <label>Images</label>

                                    {/* Uploaded Images Preview */}
                                    {form.images.length > 0 && (
                                        <div className={styles.tagsInput} style={{ marginBottom: '10px' }}>
                                            {form.images.map((img, i) => (
                                                <span key={i} className={styles.tag} style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '10px 30px 10px 10px', color: 'transparent', width: '80px', height: '60px', position: 'relative' }}>
                                                    Image
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm({
                                                                ...form,
                                                                images: form.images.filter((_, j) => j !== i),
                                                            })
                                                        }
                                                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Drag & Drop Zone */}
                                    <div
                                        className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ""}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('fileUpload')?.click()}
                                        style={{
                                            border: '2px dashed var(--border)',
                                            borderRadius: '8px',
                                            padding: '40px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            background: dragActive ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <input
                                            id="fileUpload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleChange}
                                            style={{ display: "none" }}
                                        />
                                        {uploading ? (
                                            <p>Uploading files...</p>
                                        ) : (
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 500 }}>Click to upload or drag and drop</p>
                                                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editing
                                            ? "Update Property"
                                            : "Create Property"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
