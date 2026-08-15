import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ["latin"] });

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
      <body className={outfit.className}>
        <Toaster theme="light" position="bottom-right" />
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 md:h-24">
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center group py-1">
                  <img 
                    src="/sahyadri-logo.png" 
                    alt="Sahyadri College of Engineering & Management" 
                    className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-8">
                <Link href="/gallery" className="text-sm font-semibold text-[#142544] hover:text-[#D4A24C] transition-colors relative group">
                  Gallery
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4A24C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/lost" className="text-sm font-semibold text-[#142544] hover:text-[#D4A24C] transition-colors relative group">
                  Report Lost
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4A24C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/found" className="text-sm font-semibold text-[#142544] hover:text-[#D4A24C] transition-colors relative group">
                  Report Found
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4A24C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/login" className="btn-primary text-sm py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-lg shadow-[#142544]/20 hover:shadow-[#142544]/40 transition-all">
                  Admin Login
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-24 md:pt-28 min-h-screen bg-[#fafafa]">
          {children}
        </main>
      </body>
    </html>
  );
}
