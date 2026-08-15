"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      
      if (res.ok) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="corporate-card w-full max-w-md p-8 md:p-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#142544]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#142544]" />
          </div>
          <h1 className="text-3xl font-bold text-[#142544] mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to manage lost and found items</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#142544] mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                required 
                className="corporate-input pl-10" 
                placeholder="admin"
                value={credentials.username}
                onChange={e => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#142544] mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                required 
                className="corporate-input pl-10" 
                placeholder="••••••••"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full mt-8 py-3 flex items-center justify-center text-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
