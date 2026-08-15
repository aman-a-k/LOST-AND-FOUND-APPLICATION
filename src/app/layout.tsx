import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahyadri Lost & Found",
  description: "A premium lost and found application for Sahyadri College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster theme="light" position="bottom-right" />
        <nav className="border-b border-gray-100 bg-white fixed top-0 w-full z-50 shadow-[0_1px_4px_rgba(20,37,68,0.06)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 md:h-24">
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center group py-1">
                  <img 
                    src="https://sahyadri-placement-portal.vercel.app/sahyadri-logo-header.png" 
                    alt="Sahyadri College of Engineering & Management" 
                    className="h-[60px] md:h-[76px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/lost" className="text-sm font-semibold text-[#142544] hover:text-[#D4A24C] transition-colors">Report Lost</Link>
                <Link href="/found" className="text-sm font-semibold text-[#142544] hover:text-[#D4A24C] transition-colors">Report Found</Link>
                <Link href="/login" className="btn-primary text-sm py-2 px-5 rounded-full inline-flex items-center gap-2">
                  Admin Login
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-24 md:pt-28 min-h-screen bg-[#F5F5F5]">
          {children}
        </main>
      </body>
    </html>
  );
}
