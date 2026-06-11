import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sentinel — AI Pull Request Guardian",
  description:
    "Sentinel watches your pull requests around the clock — surfacing bugs, security risks, performance issues, and code quality problems before they ship.",
  keywords: ["code review", "AI", "pull request", "GitHub", "security", "DevOps", "Sentinel"],
  icons: {
    icon: "/sentinel-icon.png",
    apple: "/sentinel-icon.png",
  },
  openGraph: {
    title: "Sentinel — AI Pull Request Guardian",
    description: "Automated PR analysis that keeps your main branch safe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
