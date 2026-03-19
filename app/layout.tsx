import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import { SmoothScrolling } from "@/components/SmoothScrolling";
import Footer from "@/components/Footer";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shreenathestate.com"),
  title: "Real Estate Broker in Mumbai | RIZ-WEE & CO. | Luxury Homes",
  description:
    "Private, RERA-Registered Real Estate Advisory for Mumbai's Luxury Market. 100+ Successful Closings. Residential, Commercial & Under-Construction properties.",
  keywords: [
    "Real Estate Broker in Mumbai",
    "luxury real estate Mumbai",
    "Luxury Flats in Bandra",
    "RERA registered agent",
    "RIZ-WEE & CO.",
    "luxury homes Mumbai",
    "real estate advisory",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Real Estate Broker in Mumbai | RIZ-WEE & CO.",
    description:
      "Private Real Estate Advisory for Mumbai's Luxury Market. 100+ Successful Closings.",
    url: "https://shreenathestate.com",
    siteName: "RIZ-WEE & CO.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Broker in Mumbai | RIZ-WEE & CO.",
    description: "Private Real Estate Advisory for Mumbai's Luxury Market.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: "RIZ-WEE & CO.",
    image: "https://shreenathestate.com/logo.png",
    "@id": "https://shreenathestate.com",
    url: "https://shreenathestate.com",
    telephone: "+919999999999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mumbai",
      addressLocality: "Mumbai",
      addressRegion: "MH",
      postalCode: "400001",
      addressCountry: "IN",
    }
  };

  return (
    <html lang="en" className={cn(inter.className, "font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScrolling>
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
