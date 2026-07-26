'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { FileText, Download } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api';

const REPORT_BAR_DATA = [
  { date: '15', count: 420 },
  { date: '16', count: 180 },
  { date: '17', count: 320 },
  { date: '18', count: 150 },
  { date: '19', count: 280 },
  { date: '20', count: 110 },
  { date: '21', count: 390 },
  { date: '22', count: 240 },
  { date: '23', count: 480 },
  { date: '24', count: 210 },
  { date: '25', count: 350 },
];

export const OneTimeReportPanel: React.FC = () => {
  const handleDownloadReport = () => {
    window.open(`${API_BASE_URL}${API_ENDPOINTS.reportPdf}`, '_blank');
  };

  return (
    <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white flex items-center space-x-2">
          <FileText className="h-4 w-4 text-purple-400" />
          <span>Get one-time report</span>
        </h3>
        <button
          onClick={handleDownloadReport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Vertical Bars / Smooth Wave Chart */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REPORT_BAR_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#9482b6" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#9482b6" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c0838',
                borderColor: '#d946ef',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#d946ef"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#reportGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
