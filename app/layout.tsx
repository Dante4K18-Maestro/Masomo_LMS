import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BrighterFuture — Learn the skills behind tomorrow",
    template: "%s · BrighterFuture",
  },
  description:
    "A modern learning platform for future IT professionals. Master web development, data, cloud, cybersecurity, and AI with practical courses and real feedback.",
  keywords: [
    "IT courses",
    "learning management system",
    "web development",
    "data science",
    "cybersecurity",
    "cloud engineering",
  ],
  authors: [{ name: "BrighterFuture" }],
};

export const viewport: Viewport = {
  themeColor: "#07111f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
