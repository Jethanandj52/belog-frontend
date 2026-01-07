"use client";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Writers", value: "12K+" },
    { label: "Articles Published", value: "450K+" },
    { label: "Monthly Readers", value: "2M+" },
    { label: "Countries Reach", value: "140+" },
  ];

  return (
    <div className="pt-32 pb-20 bg-white">
      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            We’re building the <br/> 
            <span className="text-purple-600 italic">Future of Voice.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Lumina was founded in 2024 with a simple mission: to give every writer 
            a premium space to share ideas that move the world forward.
          </p>
        </motion.div>
      </section>

      {/* Interactive Stats */}
      <section className="bg-slate-900 py-20 mb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-purple-400 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://cdn.prod.website-files.com/653108f1b39efbd3832a7724/67c82f58e69b6d95cc5d5850_aHNJQR6zhLYDL1pVsfdK5LRZeexdShmFcLhjEslYy0gCDicoA-tmppty_bw4k.jpg" 
              className="rounded-[3rem] shadow-2xl" 
              alt="Team" 
            />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
          <div className="space-y-10">
            <h2 className="text-4xl font-black">Our Core Values</h2>
            {[
              { icon: Heart, t: "Creator First", d: "We build for the writer. Every feature is designed to make publishing effortless." },
              { icon: Target, t: "Radical Transparency", d: "We believe in open communication and honest metrics for our creators." },
              { icon: Rocket, t: "Innovation", d: "Constantly pushing the boundaries of what a blogging platform can be." }
            ].map((v, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <v.icon size={24}/>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{v.t}</h4>
                  <p className="text-slate-500">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}