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
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
  isLiveUpdated = false,
}) => {
  const colorMap = {
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    red: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel glass-panel-hover relative overflow-hidden rounded-2xl p-5 border ${
        isLiveUpdated ? 'border-blue-500/60 ring-1 ring-blue-500/40' : 'border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-3 border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400">
          <span className="font-mono font-medium text-emerald-400">{trend}</span>
          <span>vs baseline profile</span>
        </div>
      )}
    </motion.div>
  );
};
