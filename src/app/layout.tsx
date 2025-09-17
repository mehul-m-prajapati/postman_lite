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
  title: "Postman Lite",
  description: "Send HTTP requests and view the responses",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en" className="overflow-y-scroll">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased scrollbar-gutter-stable overflow-y-scroll`}>
        <Navbar />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
