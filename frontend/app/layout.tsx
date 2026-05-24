import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PRism — AI Code Review for Engineering Teams",
  description:
    "PRism detects bugs, security vulnerabilities, performance bottlenecks, and code smells in your pull requests automatically using AI.",
  keywords: ["code review", "AI", "pull request", "GitHub", "security", "DevOps"],
  openGraph: {
    title: "PRism — AI Code Review",
    description: "Automated, intelligent PR reviews powered by AI.",
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
