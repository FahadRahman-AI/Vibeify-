import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibeify AI",
  description: "Rewrite your text in any tone with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased

          /* FIX: Background stays gradient so navbar never hits white */
          bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-500
        `}
      >
        {/* Navbar at top */}
        <Navbar />

        {/* Prevent navbar overlap */}
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
