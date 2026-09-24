import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Levrone Technologies | Laptop repairs, sales and IT support in Bloemfontein",
  description: "Laptop and desktop repairs, laptop sales, CCTV installation and IT support in Bloemfontein. 10% student discount for UFS students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
