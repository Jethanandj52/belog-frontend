"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DemoVideoModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/10 backdrop-blur-md flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
            >
              <X size={20} />
            </button>

            {/* Video */}
            <div className="aspect-video">
          <iframe
  className="w-full h-full"
  src="https://www.youtube.com/embed/Hin8-nEFIuI?autoplay=1&mute=0&loop=1&playlist=Hin8-nEFIuI&controls=0&modestbranding=1&rel=0"
  title="Demo Video"
  allow="autoplay; encrypted-media; picture-in-picture"
  allowFullScreen
/>


            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
