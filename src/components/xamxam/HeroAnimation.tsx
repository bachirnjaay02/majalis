"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroAnimation() {
  return (
    <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full border border-[#f3d27a]/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          maskImage:
            "conic-gradient(from 0deg, black, transparent 40%, black 60%, transparent)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-2 rounded-full border border-dashed border-[#f3d27a]/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_0_45px_rgba(243,210,122,0.4)]"
      >
        <motion.div
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" fill sizes="56px" className="object-cover" priority />
        </motion.div>
      </motion.div>
    </div>
  );
}
