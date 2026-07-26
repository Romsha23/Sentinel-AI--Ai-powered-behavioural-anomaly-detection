'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserCheck, Shield, Clock, Globe, Laptop, Server, AlertTriangle, ArrowLeft } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface EntityTimelineDrawerProps {
  entityId: string | null;
  onClose: () => void;
}

export const EntityTimelineDrawer: React.FC<EntityTimelineDrawerProps> = ({
  entityId,
  onClose,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;
    setLoading(true);
    apiClient
      .get(API_ENDPOINTS.entities(entityId))
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load entity baseline timeline:', err);
      })
      .finally(() => setLoading(false));
  }, [entityId]);

  if (!entityId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="glass-panel h-full w-full max-w-3xl overflow-y-auto border-l border-slate-700 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-mono text-white">{entityId}</h2>
                {data?.baseline_profile?.cold_start ? (
                  <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-800">
                    ⭐ COLD START (Peer Group Fallback)
                  </span>
                ) : (
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800">
                    ESTABLISHED BASELINE ({data?.baseline_profile?.session_count} Sessions)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Department: <span className="text-blue-400 font-medium">{data?.department || 'Engineering'}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Behavioral Baseline Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Normal Login Hours</span>
            </div>
            <p className="text-xs font-mono font-medium text-white">
              {data?.baseline_profile?.normal_hours ? `${data.baseline_profile.normal_hours.slice(0, 5).join(', ')}:00` : '08:00 - 18:00'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Normal Countries</span>
            </div>
            <p className="text-xs font-medium text-white">
              {data?.baseline_profile?.normal_countries ? data.baseline_profile.normal_countries.join(', ') : 'USA, UK'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Server className="h-4 w-4 text-purple-400" />
              <span>Frequent Resources</span>
            </div>
            <p className="text-xs font-mono text-white truncate">
              {data?.baseline_profile?.frequent_resources ? data.baseline_profile.frequent_resources.slice(0, 2).join(', ') : 'GitLab, Wiki'}
            </p>
          </div>
        </div>

        {/* Risk Trend Chart */}
        <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300">Entity Risk Score Progression</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.risk_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tickFormatter={(t) => t.slice(11, 16)} />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="risk_score" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Session History Audit Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300">Session Audit Timeline & Anomaly Logs</h3>
          <div className="space-y-3">
            {data?.session_history?.map((sess: any, idx: number) => {
              const isAnomaly = sess.risk_score >= 60;

              return (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border space-y-2.5 ${
                    isAnomaly ? 'bg-rose-950/20 border-rose-800/40' : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white">{sess.timestamp.replace('T', ' ').slice(0, 19)}</span>
                      <span className="text-xs text-slate-400">• {sess.city}, {sess.country} ({sess.source_ip})</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                      Risk Score: {sess.risk_score}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 text-xs gap-2 text-slate-300">
                    <div>Resource: <span className="font-mono text-blue-300">{sess.resource_accessed}</span></div>
                    <div>Auth Method: <span className="text-slate-200">{sess.auth_method}</span></div>
                    <div>Failed Attempts: <span className="font-mono text-amber-300">{sess.failed_attempts}</span></div>
                    <div>Session Duration: <span className="font-mono text-slate-200">{sess.session_duration}s</span></div>
                  </div>

                  {sess.command_sequence && (
                    <div className="rounded-lg bg-slate-950 p-2 font-mono text-[11px] text-slate-400 border border-slate-900">
                      &gt; {sess.command_sequence}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
