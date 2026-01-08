"use client";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We will contact you soon.");
  };

  return (
    <section id="contact" className="relative py-32 bg-transparent overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9b2dee]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e300b4]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Text & Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles size={14} className="text-[#e300b4]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Contact Us</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-white italic">
              Say <span className="text-[#9b2dee]">Hello.</span>
            </h1>
            <p className="text-xl text-white/40 mb-12 font-medium">
              Have a question? We are here to help you grow.
            </p>
            
            <div className="space-y-6">
              <ContactInfo icon={Mail} label="Email Us" val="hello@entrovex.com" />
              <ContactInfo icon={Phone} label="Call Us" val="+92 3042507846" />
            </div>
          </motion.div>

          {/* Right Side: Glass Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="relative"
          >
            {/* Form Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] rounded-[3rem] blur-xl opacity-10" />
            
            <div className="relative bg-[#0d0118]/60 backdrop-blur-3xl p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" placeholder="Ahmad" />
                  <Input label="Last Name" placeholder="Khan" />
                </div>
                <Input label="Email Address" type="email" placeholder="ahmad@example.com" />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#e300b4]/50 transition-all resize-none placeholder:text-white/20 font-medium" 
                    placeholder="How can we help you?" 
                  />
                </div>

                <button className="w-full py-5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(227,0,180,0.4)] transition-all uppercase text-xs tracking-widest">
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Simple Reusable Components
const ContactInfo = ({ icon: Icon, label, val }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9b2dee] group-hover:bg-[#9b2dee] group-hover:text-white transition-all shadow-lg">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white/90">{val}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{label}</label>
    <input 
      required 
      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#e300b4]/50 transition-all placeholder:text-white/20 font-medium" 
      {...props} 
    />
  </div>
);