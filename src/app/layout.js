import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dave Krugman | Photographer & Digital Artist",
  description: "Dave Krugman is a New York City based photographer, writer, and founder of ALLSHIPS. Creating work at the intersection of technology and art.",
  keywords: ["Dave Krugman", "photographer", "nyc", "instagram", "digital art", "NFT", "New York", "ALLSHIPS"],
  authors: [{ name: "Dave Krugman" }],
  creator: "Dave Krugman",
  openGraph: {
    title: "Dave Krugman | Photographer & Digital Artist",
    description: "Photographer, writer, and founder of ALLSHIPS. Based in New York City.",
    url: "https://davekrugman.com",
    siteName: "Dave Krugman",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dave Krugman | Photographer & Digital Artist",
    description: "Photographer, writer, and founder of ALLSHIPS. Based in New York City.",
    creator: "@dave_krugman",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}