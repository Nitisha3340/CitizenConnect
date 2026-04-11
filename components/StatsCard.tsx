"use client";

import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
    </motion.div>
  );
}
