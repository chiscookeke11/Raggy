import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grotesque = Hanken_Grotesk({
  variable: "--font-grotesque",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Raggy",
  description: "A local-first RAG platform that shows every step between your question and the answer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${grotesque.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-grotesque
        ">
        {children}</body>
    </html>
  );
}
