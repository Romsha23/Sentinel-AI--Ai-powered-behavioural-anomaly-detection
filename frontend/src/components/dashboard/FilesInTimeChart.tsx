'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SAMPLE_FILES_DATA = [
  { month: 'Jan', processed: 1200, anomalous: 800 },
  { month: 'Feb', processed: 2800, anomalous: 1500 },
  { month: 'Mar', processed: 1900, anomalous: 3100 },
  { month: 'Apr', processed: 3200, anomalous: 2200 },
  { month: 'May', processed: 2400, anomalous: 4200, label: 'May 20' },
  { month: 'Jun', processed: 4100, anomalous: 2800 },
  { month: 'Jul', processed: 2900, anomalous: 3400 },
  { month: 'Aug', processed: 3800, anomalous: 4100 },
  { month: 'Sep', processed: 4900, anomalous: 4500, label: 'Sep 2' },
  { month: 'Oct', processed: 3100, anomalous: 2900 },
  { month: 'Nov', processed: 4600, anomalous: 1800 },
  { month: 'Dec', processed: 1500, anomalous: 1100 },
];

interface FilesInTimeChartProps {
  data?: any[];
}

export const FilesInTimeChart: React.FC<FilesInTimeChartProps> = ({ data = SAMPLE_FILES_DATA }) => {
  return (
    <div className="relative rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white">Files In Time</h3>
        <div className="flex items-center space-x-4 text-xs font-medium text-purple-300/70">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span>Scanned Files</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
            <span>Flagged Files</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.15)" vertical={false} />
            <XAxis dataKey="month" stroke="#9482b6" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#9482b6" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c0838',
                borderColor: '#a855f7',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="processed"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBlue)"
            />
            <Area
              type="monotone"
              dataKey="anomalous"
              stroke="#ec4899"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Floating annotations for May 20 and Sep 2 */}
      <div className="absolute top-[38%] left-[42%] bg-[#28114b] text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none">
        May 20
      </div>
      <div className="absolute top-[28%] left-[68%] bg-[#28114b] text-pink-300 border border-pink-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none">
        Sep 2
      </div>
    </div>
  );
};
