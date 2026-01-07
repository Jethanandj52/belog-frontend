"use client";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Entrovex team will contact you soon.");
  };

  return (
    <section id="contact" className="py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black mb-8 tracking-tighter">Get in Touch.</h1>
            <p className="text-xl text-slate-500 mb-12">Expert support for your guest posting needs.</p>
            <div className="space-y-8">
              <ContactInfo icon={Mail} label="Email" val="hello@entrovex.com" />
              <ContactInfo icon={Phone} label="Phone" val="+1 Entrovex-HQ" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="Ahmad" />
                <Input label="Last Name" placeholder="Khan" />
              </div>
              <Input label="Email" type="email" placeholder="ahmad@example.com" />
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
                <textarea required rows={4} className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tell us about your project..." />
              </div>
              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-lg">
                Send to Entrovex <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Reusable Sub-components
const ContactInfo = ({ icon: Icon, label, val }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all shadow-sm">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-900">{val}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>
    <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all" {...props} />
  </div>
);