'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'amber' | 'purple' | 'cyan';
  trend?: string;
  isLiveUpdated?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'purple',
  trend,
  isLiveUpdated = false,
  onClick,
}) => {
  const colorMap = {
    blue: 'border-purple-400/40 text-purple-300 bg-purple-900/40',
    red: 'border-pink-500/40 text-pink-400 bg-pink-950/40',
    green: 'border-emerald-400/40 text-emerald-300 bg-emerald-950/40',
    amber: 'border-amber-400/40 text-amber-300 bg-amber-950/40',
    purple: 'border-fuchsia-400/40 text-fuchsia-300 bg-fuchsia-950/40',
    cyan: 'border-cyan-400/40 text-cyan-300 bg-cyan-950/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl p-4 border ${
        isLiveUpdated
          ? 'border-pink-500 ring-1 ring-pink-500/40 shadow-lg shadow-pink-500/20'
          : 'border-purple-500/20 hover:border-purple-400/50'
      } shadow-xl transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-purple-200/70 uppercase">{title}</p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-white">{value}</h3>
          {subtitle && <p className="mt-0.5 text-[11px] text-purple-300/60">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-2.5 border shadow-inner ${colorMap[color]}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-purple-300/60">
          <span className="font-mono font-medium text-pink-400">{trend}</span>
          <span>vs baseline profile</span>
        </div>
      )}
    </motion.div>
  );
};
