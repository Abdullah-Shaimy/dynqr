import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/providers/ProfileProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DynQR — Dynamic QR Code Management",
  description:
    "Create, manage, and track dynamic QR codes. Update destination URLs anytime without changing your QR code.",
  keywords: ["QR code", "dynamic QR", "QR management", "analytics", "URL shortener"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
