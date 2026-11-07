import "./globals.css";
import "./landing.css";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ScanLine } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins" });

export const metadata = {
  title: "Scanang – Bali Culture Lens",
  description: "A guide that explains Balinese culture and etiquette from a photo, in your language.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9eae3" },
    { media: "(prefers-color-scheme: dark)", color: "#111312" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label="Scanang home">
              <span className="brand-mark" aria-hidden="true" />
              <span>Scanang</span>
            </Link>
            <nav className="nav" aria-label="Main">
              <Link href="/etiket">Etiquette</Link>
              <Link href="/scan" className="nav-cta">
                <ScanLine size={16} strokeWidth={2} aria-hidden="true" /> Try it
              </Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <span className="brand small"><span className="brand-mark" aria-hidden="true" /> Scanang</span>
            <span>Bali DigiFest 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
