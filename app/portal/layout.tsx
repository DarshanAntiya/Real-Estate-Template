"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./portal.module.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Don't apply admin layout to login page
    if (pathname === "/portal/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch("/api/portal/logout", { method: "POST" });
        router.push("/portal/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/portal", icon: "📊" },
        { label: "Properties", href: "/portal/properties", icon: "🏠" },
        { label: "Leads", href: "/portal/leads", icon: "📋" },
    ];

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <img src="/logo.png" alt="RIZ-WEE & CO." className={styles.sidebarLogo} />
                    <span>Admin Panel</span>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ""
                                }`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.viewSite}>
                        ← View Website
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className={styles.adminMain}>
                <div className={styles.adminContent}>{children}</div>
            </main>
        </div>
    );
}
