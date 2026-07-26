'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export interface StreamEvent {
  id: number | string;
  timestamp: string;
  entity_id: string;
  department: string;
  country: string;
  resource_accessed: string;
  auth_method: string;
  label: string;
  risk_score: number;
  priority: string;
  color: string;
  reasons: string[];
  recommendations: string[];
  detection_reason?: string;
  breakdown?: {
    isolation_forest_factor: number;
    xgboost_factor: number;
    geo_anomaly_factor: number;
    device_novelty_factor: number;
    time_anomaly_factor: number;
  };
}

interface LiveStreamFeedProps {
  events: StreamEvent[];
  isStreaming: boolean;
  onSelectEntity: (entityId: string) => void;
}

export const LiveStreamFeed: React.FC<LiveStreamFeedProps> = ({
  events,
  isStreaming,
  onSelectEntity,
}) => {
  return (
    <div className="glass-panel relative rounded-2xl border border-slate-800 p-5 flex flex-col h-[420px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative flex h-3 w-3">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isStreaming ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
          </div>
          <h3 className="text-sm font-semibold tracking-wide text-white">Near Real-Time Access Event Stream</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-400">WebSocket /ws/stream (1.5s interval)</span>
      </div>

      {/* Stream List Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              <Radio className="h-4 w-4 mr-2 animate-spin" />
              <span>Connecting to live event stream...</span>
            </div>
          ) : (
            events.map((ev) => {
              const isHigh = ev.risk_score >= 60;

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => onSelectEntity(ev.entity_id)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all hover:border-blue-500/50 ${
                    isHigh
                      ? 'bg-rose-950/20 border-rose-800/40 hover:bg-rose-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {isHigh ? (
                        <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-white hover:text-blue-400 underline decoration-blue-500/40">
                            {ev.entity_id}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                            {ev.department}
                          </span>
                          <span className="text-[10px] text-slate-400">• {ev.country}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-300">
                          Accessed <span className="text-blue-300 font-mono">{ev.resource_accessed}</span> via {ev.auth_method}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className={`font-mono text-sm font-bold ${isHigh ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {ev.risk_score}
                        </span>
                        <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        ev.priority === 'Critical' ? 'bg-rose-900/60 text-rose-300' :
                        ev.priority === 'High' ? 'bg-amber-900/60 text-amber-300' :
                        ev.priority === 'Medium' ? 'bg-yellow-900/60 text-yellow-300' :
                        'bg-emerald-900/60 text-emerald-300'
                      }`}>
                        {ev.label}
                      </span>
                    </div>
                  </div>

                  {/* Reasons Preview */}
                  {ev.reasons && ev.reasons.length > 0 && isHigh && (
                    <div className="mt-2 rounded-lg bg-rose-950/40 border border-rose-900/40 p-2 text-[10.5px] text-rose-200">
                      <p className="font-medium text-rose-300">⚡ Detection Reason:</p>
                      <p className="mt-0.5 text-rose-100">{ev.reasons[0]}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
