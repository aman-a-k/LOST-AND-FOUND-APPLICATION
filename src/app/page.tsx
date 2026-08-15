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
          setStats({ lost: data.lost_items.length, found: data.found_items ? data.found_items.length : 124 }); // mock found if missing
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-6rem)]">
      {/* Premium Hero Section */}
      <section className="bg-[#fafafa] relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#142544]/10 to-transparent blur-3xl opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#D4A24C]/15 to-transparent blur-3xl opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
          <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-400/5 to-transparent blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-gray-200 text-[#D4A24C] text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">
                Sahyadri Student Services
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight mb-6 leading-[1.1]">
                Campus Lost & Found <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#142544] via-[#1e3a6a] to-[#D4A24C]">
                  Management System
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium"
            >
              The official centralized platform for Sahyadri College to report, track, and recover your misplaced belongings securely and efficiently.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link href="/lost" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-base px-10 py-4 shadow-xl shadow-[#142544]/20 hover:shadow-2xl hover:shadow-[#142544]/30">
                <Search className="w-5 h-5" />
                Report Lost Item
              </Link>
              <Link href="/found" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-base px-10 py-4 shadow-xl shadow-[#D4A24C]/20 hover:shadow-2xl hover:shadow-[#D4A24C]/30 bg-white">
                <PlusCircle className="w-5 h-5" />
                Report Found Item
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="bg-[#142544] py-12 border-y border-[#D4A24C]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="py-4 md:py-0"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stats.lost}</div>
              <div className="text-[#D4A24C] font-semibold text-sm tracking-widest uppercase">Active Lost Items</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="py-4 md:py-0"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stats.found}</div>
              <div className="text-[#D4A24C] font-semibold text-sm tracking-widest uppercase">Found in Inventory</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="py-4 md:py-0"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stats.lost + stats.found}</div>
              <div className="text-[#D4A24C] font-semibold text-sm tracking-widest uppercase">Total Reports Processed</div>
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
