'use client';

import React from 'react';
import { Globe, AlertTriangle } from 'lucide-react';

interface GeoPoint {
  country: string;
  city: string;
  lat: number;
  lon: number;
  normal: number;
  anomalies: number;
}

interface GeoMapProps {
  data: GeoPoint[];
}

export const GeoMap: React.FC<GeoMapProps> = ({ data }) => {
  // Convert Lat/Lon coordinates to SVG percentage coordinates (Equirectangular Projection)
  const getCoordinates = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="glass-panel relative rounded-2xl border border-slate-800 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-semibold tracking-wide text-white">Geographic Access & Anomaly Map</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Normal Logins</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-slate-400">Anomaly Threat Pings</span>
          </div>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-950/80 border border-slate-900 flex items-center justify-center">
        {/* World Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Stylized World Silhouette Outline */}
        <svg viewBox="0 0 1000 500" className="h-full w-full opacity-20 stroke-blue-500 fill-blue-950/40">
          <path d="M150,150 Q200,100 300,140 T450,120 T600,160 T800,120 L850,300 L650,400 L400,380 L150,350 Z" />
        </svg>

        {/* Dynamic Location Map Pins */}
        {data.map((pt, idx) => {
          const coords = getCoordinates(pt.lat, pt.lon);
          const hasAnomaly = pt.anomalies > 50;

          return (
            <div
              key={idx}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: coords.x, top: coords.y }}
            >
              {/* Outer Pulse */}
              {hasAnomaly && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></span>
              )}
              
              {/* Core Marker Pin */}
              <div
                className={`relative flex h-4 w-4 items-center justify-center rounded-full border border-white/40 shadow-lg ${
                  hasAnomaly ? 'bg-rose-500 cyber-glow-red' : 'bg-emerald-500 cyber-glow-green'
                }`}
              >
                {hasAnomaly && <AlertTriangle className="h-2.5 w-2.5 text-white" />}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-slate-900 border border-slate-700 p-2.5 shadow-xl group-hover:block z-50 min-w-[140px]">
                <p className="text-xs font-bold text-white">{pt.city}, {pt.country}</p>
                <div className="mt-1 space-y-0.5 text-[11px]">
                  <p className="text-emerald-400">Normal: {pt.normal.toLocaleString()}</p>
                  <p className="text-rose-400 font-medium">Anomalies: {pt.anomalies}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
