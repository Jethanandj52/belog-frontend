"use client";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Heart, Sparkles, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Writers", value: "12K+", color: "from-[#9b2dee] to-[#e300b4]" },
    { label: "Articles Published", value: "450K+", color: "from-[#e300b4] to-[#ff00c8]" },
    { label: "Monthly Readers", value: "2M+", color: "from-[#ff00c8] to-[#ff7700]" },
    { label: "Countries Reach", value: "140+", color: "from-[#ff7700] to-[#9b2dee]" },
  ];

  return (
    <div className="relative pt-32 pb-20 bg-transparent text-white overflow-hidden">
      
      {/* --- BACKGROUND BLOBS (Matching HomePage) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[40%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      {/* Vision Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles className="w-3 h-3 text-[#ff00c8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">The Protocol</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-[1000] mb-10 tracking-tighter leading-[0.9] uppercase italic">
            Building the <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8] drop-shadow-[0_0_15px_rgba(227,0,180,0.4)]">
              Future of Voice.
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">
            Entrovex was forged in the digital void with a mission: to provide 
            architects of thought a high-octane, <span className="text-white">premium space</span> to manifest ideas that shift the global frequency.
          </p>
        </motion.div>
      </section>

      {/* Interactive Stats - Glass Card Style */}
      <section className="relative z-10 mb-40 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h3 className={`text-4xl md:text-6xl font-[1000] mb-3 tracking-tighter bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </h3>
                <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Image with Neon Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#9b2dee] to-[#e300b4] rounded-[3.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative p-2 bg-gradient-to-br from-white/20 to-transparent rounded-[3.2rem]">
              <img 
                src="https://cdn.prod.website-files.com/653108f1b39efbd3832a7724/67c82f58e69b6d95cc5d5850_aHNJQR6zhLYDL1pVsfdK5LRZeexdShmFcLhjEslYy0gCDicoA-tmppty_bw4k.jpg" 
                className="rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" 
                alt="Architecture" 
              />
            </div>
            {/* Floating Decorative Element */}
            <div className="absolute -bottom-6 -left-6 bg-[#0d0118] border border-white/10 p-6 rounded-3xl shadow-neon-sm backdrop-blur-xl">
               <ShieldCheck size={32} className="text-[#e300b4]" />
            </div>
          </motion.div>

          <div className="space-y-12">
            <div>
              <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter mb-4">Core <span className="text-[#9b2dee]">Values</span></h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#9b2dee] to-transparent rounded-full" />
            </div>

            {[
              { icon: Heart, t: "Creator Centric", d: "The writer is the center of our universe. Every line of code is written to amplify your influence.", color: "bg-[#e300b4]/10 text-[#e300b4]" },
              { icon: Target, t: "Radical Transparency", d: "No hidden algorithms. Pure, honest engagement metrics for the digital architects.", color: "bg-[#9b2dee]/10 text-[#9b2dee]" },
              { icon: Rocket, t: "Next-Gen Innovation", d: "We don't follow trends; we set the frequency for what a publishing platform should be.", color: "bg-[#ff7700]/10 text-[#ff7700]" }
            ].map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex gap-8 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
              >
                <div className={`w-16 h-16 rounded-[1.2rem] ${v.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <v.icon size={28}/>
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2 text-white/90">{v.t}</h4>
                  <p className="text-slate-400 leading-relaxed font-medium">{v.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}