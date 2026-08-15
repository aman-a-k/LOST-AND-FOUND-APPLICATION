"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-6rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#D4A24C] text-xs font-bold tracking-[0.2em] uppercase">Public Inventory</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#142544] mt-3">Recently Found Items</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Browse items that have been turned in across the Sahyadri campus.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by item name or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="corporate-input pl-10 w-full"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="corporate-input sm:w-48"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Search className="w-10 h-10 text-[#142544] animate-pulse" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="corporate-card p-12 text-center max-w-2xl mx-auto">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No items found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any, idx) => (
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
