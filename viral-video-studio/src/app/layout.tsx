import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Video Studio",
  description:
    "Generate virality-optimized short-form scripts & storyboards for TikTok, Reels, and Shorts — powered by local Ollama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
