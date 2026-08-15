"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ReportLost() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const sendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email first");
    
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      }
      else toast.error("Failed to send OTP");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending OTP");
    }
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    try {
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        toast.info("Uploading image...");
        const catboxData = new FormData();
        catboxData.append("reqtype", "fileupload");
        catboxData.append("fileToUpload", imageFile);
        
        // We use a CORS proxy or route? Wait, catbox has permissive CORS.
        const catboxRes = await fetch("https://catbox.moe/user/api.php", {
          method: "POST",
          body: catboxData
        });
        
        if (catboxRes.ok) {
          const imageUrl = await catboxRes.text();
          formData.set("image_url", imageUrl);
        } else {
          toast.error("Image upload failed, proceeding without image");
        }
      }
      
      // Remove the original file to avoid sending it to our API
      formData.delete("image");

      const res = await fetch("/api/items/lost", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        // Show AI Match Results if any
        if (data.matches && data.matches.length > 0) {
          toast.success(`Lost item reported! We found ${data.matches.length} potential matches in our system!`, { duration: 6000 });
        } else {
          toast.success("Lost item reported successfully!");
        }
        setTimeout(() => window.location.href = "/", 2000);
      } else {
        toast.error(data.message || "Failed to report item");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="corporate-card p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#142544] mb-2">Report Lost Item</h1>
          <p className="text-gray-500">Provide details about what you lost to help us match it.</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#142544] mb-2">Item Name</label>
              <input type="text" name="name" required className="corporate-input" placeholder="e.g. Blue Backpack" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#142544] mb-2">Category</label>
              <select name="category" required className="corporate-input">
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="documents">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#142544] mb-2">Description</label>
            <textarea name="description" rows={3} className="corporate-input" placeholder="Describe the item, including any identifying marks..."></textarea>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#142544] mb-2">Location Lost</label>
              <input type="text" name="location" className="corporate-input" placeholder="e.g. Library 2nd floor" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#142544] mb-2">Date Lost</label>
              <input type="datetime-local" name="date_lost" className="corporate-input" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#142544] mb-2">Image (Optional)</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                } else {
                  setPreviewUrl(null);
                }
              }}
              className="corporate-input p-2" 
            />
            {previewUrl && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-md border border-gray-200" />
              </motion.div>
            )}
          </div>

          <hr className="border-gray-100 my-6" />
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-[#142544] mb-4">Verification</h3>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
            <div className="flex gap-4">
              <input 
                type="email" 
                name="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                className="corporate-input flex-1" 
                placeholder="student@sahyadri.edu.in" 
              />
              <button 
                onClick={sendOtp} 
                disabled={loading || otpSent}
                className="btn-secondary whitespace-nowrap flex items-center justify-center min-w-[120px]"
              >
                {loading && !otpSent ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {otpSent ? "OTP Sent" : "Send OTP"}
              </button>
            </div>
            
            {otpSent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">Enter OTP</label>
                <input type="text" name="otp" required className="corporate-input" placeholder="Enter 6-digit OTP" />
              </motion.div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !otpSent}
            className="btn-primary w-full disabled:opacity-50 flex justify-center items-center py-4 text-lg mt-6"
          >
            {loading && otpSent ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading && otpSent ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
