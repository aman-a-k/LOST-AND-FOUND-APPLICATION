"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, PlusCircle, ShieldCheck, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({ lost: 0, found: 0 });

  useEffect(() => {
    // Fetch stats from backend
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if(data && data.lost_items) {
          setStats({ lost: data.lost_items.length, found: 0 });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-6rem)]">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#142544]/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A24C]/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[#D4A24C] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                Sahyadri Student Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#142544] tracking-tight mb-6 leading-tight">
                Campus Lost & Found <br />
                <span className="text-[#D4A24C]">Management System</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto"
            >
              The official centralized platform for Sahyadri College to report, track, and recover your misplaced belongings securely and efficiently.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/lost" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-full">
                <Search className="w-5 h-5" />
                Report Lost Item
              </Link>
              <Link href="/found" className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-full">
                <PlusCircle className="w-5 h-5" />
                Report Found Item
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-[#D4A24C] text-xs font-bold tracking-[0.2em] uppercase">How It Works</span>
          <h2 className="text-3xl font-bold text-[#142544] mt-3">Seamless Item Recovery</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="corporate-card p-8 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-[#142544]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#142544] transition-colors duration-300">
              <Search className="w-7 h-7 text-[#142544] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-[#142544] mb-3">Smart Tracking</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Report your lost items with detailed descriptions. Our system helps administration match them with found inventory across the campus.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="corporate-card p-8 group hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#142544] to-[#D4A24C]"></div>
            <div className="w-14 h-14 bg-[#142544]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#142544] transition-colors duration-300">
              <ShieldCheck className="w-7 h-7 text-[#142544] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-[#142544] mb-3">Secure Verification</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We employ strict OTP-based email verification to ensure items are only claimed by and returned to their rightful owners.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="corporate-card p-8 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-[#142544]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#142544] transition-colors duration-300">
              <MapPin className="w-7 h-7 text-[#142544] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-[#142544] mb-3">Campus Wide</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Whether you lost it in the library, cafeteria, or a classroom, our unified platform connects the entire Sahyadri community.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
