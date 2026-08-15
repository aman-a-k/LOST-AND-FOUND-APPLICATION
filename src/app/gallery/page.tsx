"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items?status=found")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItems(data.items);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load gallery items.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-6rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#D4A24C] text-xs font-bold tracking-[0.2em] uppercase">Public Inventory</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#142544] mt-3">Recently Found Items</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Browse items that have been turned in across the Sahyadri campus. If you see your lost item here, please contact administration or file a Lost Report matching this category to begin the claim process.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Search className="w-10 h-10 text-[#142544] animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <div className="corporate-card p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No found items right now</h3>
            <p className="text-gray-500 mt-2">Check back later or report a lost item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="corporate-card overflow-hidden flex flex-col hover:-translate-y-1"
              >
                {/* Image Placeholder / Display */}
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                  {item.image_path && item.image_path.startsWith('http') ? (
                    <img src={item.image_path} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs font-medium">No Image Provided</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#142544] shadow-sm uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#142544] mb-2">{item.name}</h3>
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-[#D4A24C]" />
                      Found at: {item.location || "Unknown location"}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-[#D4A24C]" />
                      {new Date(item.date_reported).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
