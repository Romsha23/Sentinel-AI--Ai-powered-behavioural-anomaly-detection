'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface DonutKPICardProps {
  title: string;
  count: number;
  total?: number;
  percentage: number;
  gradientColors: { stroke1: string; stroke2: string; id: string };
  onClick?: () => void;
  isActive?: boolean;
}

export const DonutKPICard: React.FC<DonutKPICardProps> = ({
  title,
  count,
  total = 50,
  percentage,
  gradientColors,
  onClick,
  isActive = false,
}) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border ${
        isActive
          ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-500/20'
          : 'border-purple-500/20 hover:border-purple-400/40'
      } p-4 text-white shadow-xl transition-all`}
    >
      <div className="flex items-center space-x-2 text-purple-200/80 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-300">
          <Shield className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-purple-100">{title}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold tracking-tight text-white">{count}</div>
          <div className="text-[11px] text-purple-300/60 mt-0.5">of {total} Total</div>
        </div>

        {/* Circular Donut Progress SVG */}
        <div className="relative h-16 w-16 flex items-center justify-center">
          <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 70 70">
            <defs>
              <linearGradient id={gradientColors.id} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientColors.stroke1} />
                <stop offset="100%" stopColor={gradientColors.stroke2} />
              </linearGradient>
            </defs>
            {/* Background track circle */}
            <circle
              cx="35"
              cy="35"
              r={radius}
              stroke="rgba(68, 28, 114, 0.6)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active progress stroke */}
            <circle
              cx="35"
              cy="35"
              r={radius}
              stroke={`url(#${gradientColors.id})`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-bold text-white">{percentage}%</span>
        </div>
      </div>
    </motion.div>
  );
};
