"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, PlusCircle, CheckCircle, Package, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState({ lost_items: [], found_items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (itemId: number) => {
    try {
      const res = await fetch(`/api/admin/return/${itemId}`, { method: "POST" });
      if (res.ok) {
        toast.success("Item marked as returned successfully");
        fetchData(); // Refresh data
      } else {
        toast.error("Failed to mark item as returned");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center text-[#142544]">
          <Package className="w-12 h-12 animate-pulse mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const lostCount = data.lost_items?.filter((i: any) => i.status === 'lost').length || 0;
  const foundCount = data.found_items?.length || 0;
  const returnedCount = data.lost_items?.filter((i: any) => i.status === 'returned').length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#142544]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all reported lost and found items across the campus.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-outline flex items-center px-4 py-2 text-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="corporate-card p-6 flex items-center"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mr-4">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Lost Items</p>
            <p className="text-3xl font-bold text-[#142544]">{lostCount}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="corporate-card p-6 flex items-center"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Found Items (Inventory)</p>
            <p className="text-3xl font-bold text-[#142544]">{foundCount}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="corporate-card p-6 flex items-center"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Successfully Returned</p>
            <p className="text-3xl font-bold text-[#142544]">{returnedCount}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="corporate-card p-6 border-t-4 border-t-red-500">
          <h2 className="text-xl font-bold text-[#142544] mb-6 flex items-center">
            <Search className="w-5 h-5 mr-2 text-red-500" />
            Recently Lost
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-500">Item Name</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Location</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.lost_items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-[#142544]">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        item.status === 'lost' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {item.status === 'lost' && (
                        <button 
                          onClick={() => handleReturn(item.id)}
                          className="text-xs font-semibold text-[#D4A24C] hover:text-[#c4963e] border border-[#D4A24C] hover:bg-[#D4A24C]/10 px-3 py-1.5 rounded transition-colors"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {data.lost_items?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">No lost items reported.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="corporate-card p-6 border-t-4 border-t-green-500">
          <h2 className="text-xl font-bold text-[#142544] mb-6 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-green-500" />
            Found Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-500">Item Name</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Location Found</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Finder Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.found_items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-[#142544]">{item.name}</td>
                    <td className="py-4 text-sm text-gray-600">{item.location}</td>
                    <td className="py-4 text-sm text-gray-500">{item.email}</td>
                  </tr>
                ))}
                {data.found_items?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">No found items reported.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
