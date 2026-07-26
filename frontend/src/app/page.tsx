'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  ShieldAlert,
  CheckCircle2,
  Users,
  Laptop,
  AlertTriangle,
  Activity,
  Flame,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { KPICard } from '@/components/dashboard/KPICard';
import { GeoMap } from '@/components/dashboard/GeoMap';
import { LiveStreamFeed, StreamEvent } from '@/components/dashboard/LiveStreamFeed';
import { AlertQueue } from '@/components/alerts/AlertQueue';
import { EntityTimelineDrawer } from '@/components/entity/EntityTimelineDrawer';
import { AttackReplayModal } from '@/components/replay/AttackReplayModal';
import { AnalyticsStudio } from '@/components/analytics/AnalyticsStudio';
import { DataUploadModal } from '@/components/upload/DataUploadModal';
import { UserProfilePanel } from '@/components/profile/UserProfilePanel';
import { useAuth } from '@/context/AuthContext';
import { apiClient, API_BASE_URL, API_ENDPOINTS, WEBSOCKET_URL } from '@/lib/api';

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];

export default function Home() {
  const { isLoading, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isStreaming, setIsStreaming] = useState(true);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [dashData, setDashData] = useState<any>(null);
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [latestBreakdown, setLatestBreakdown] = useState<any>(null);

  const fetchDashboard = () => {
    apiClient.get(API_ENDPOINTS.dashboard).then((res) => setDashData(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  useEffect(() => {
    if (!isStreaming || !token) return;
    let socket: WebSocket;
    try {
      socket = new WebSocket(WEBSOCKET_URL);
      socket.onmessage = (event) => {
        const payload: StreamEvent = JSON.parse(event.data);
        setStreamEvents((prev) => [payload, ...prev.slice(0, 19)]);
        // Track latest risk breakdown for the breakdown panel
        if ((payload as any).breakdown) {
          setLatestBreakdown({ ...(payload as any).breakdown, risk_score: payload.risk_score, entity_id: payload.entity_id, label: payload.label });
        }
        setDashData((prev: any) => {
          if (!prev) return prev;
          const kpis = { ...prev.kpis };
          kpis.total_events = (kpis.total_events || 100000) + 1;
          if (payload.risk_score >= 60) {
            kpis.suspicious_sessions = (kpis.suspicious_sessions || 3000) + 1;
            kpis.high_risk_alerts = (kpis.high_risk_alerts || 142) + 1;
          } else {
            kpis.normal_sessions = (kpis.normal_sessions || 97000) + 1;
          }
          return { ...prev, kpis };
        });
      };
    } catch (e) {
      console.error('WebSocket connection error:', e);
    }
    return () => { if (socket) socket.close(); };
  }, [isStreaming, token]);

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg">
        <div className="text-slate-400 text-sm animate-pulse">Loading Sentinel AI...</div>
      </div>
    );
  }

  const kpis = dashData?.kpis || {
    total_events: 100000, normal_sessions: 97000, suspicious_sessions: 3000,
    high_risk_alerts: 142, active_users: 250, active_devices: 350,
    false_positives: 18, blocked_attacks: 89, avg_risk_score: 12.4, model_accuracy: 98.4,
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReplay={() => setIsReplayOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onDownloadReport={() => window.open(`${API_BASE_URL}${API_ENDPOINTS.reportPdf}`, '_blank')}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <KPICard title="Total Events" value={kpis.total_events.toLocaleString('en-US')} icon={<Activity className="h-4 w-4 text-blue-400" />} color="blue" />
              <KPICard title="Normal Sessions" value={kpis.normal_sessions.toLocaleString('en-US')} icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} color="green" />
              <KPICard title="Suspicious Sessions" value={kpis.suspicious_sessions.toLocaleString('en-US')} icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} color="amber" />
              <KPICard title="High Risk Alerts" value={kpis.high_risk_alerts} icon={<ShieldAlert className="h-4 w-4 text-rose-400" />} color="red" />
              <KPICard title="Active Users" value={kpis.active_users} icon={<Users className="h-4 w-4 text-purple-400" />} color="purple" />
              <KPICard title="Devices" value={kpis.active_devices} icon={<Laptop className="h-4 w-4 text-cyan-400" />} color="cyan" />
              <KPICard title="False Positives" value={kpis.false_positives} icon={<ShieldCheck className="h-4 w-4 text-slate-400" />} color="blue" />
              <KPICard title="Model Accuracy" value={`${kpis.model_accuracy}%`} icon={<Flame className="h-4 w-4 text-emerald-400" />} color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><GeoMap data={dashData?.geo_map || []} /></div>
              <div><LiveStreamFeed events={streamEvents} isStreaming={isStreaming} onSelectEntity={(id) => setSelectedEntityId(id)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-white">Alert Trend Timeline (30 Days)</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashData?.alerts_timeline || []}>
                      <defs><linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Area type="monotone" dataKey="suspicious_events" stroke="#EF4444" fillOpacity={1} fill="url(#colorAlerts)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-white">Attack Vector Distribution</h3>
                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashData?.attack_distribution || []} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="count">
                        {(dashData?.attack_distribution || []).map((_: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-white">Top Attacked Enterprise Resources</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashData?.top_resources || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="resource" type="category" stroke="#64748b" width={110} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3: Risk Score Distribution + 5-Factor Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Score Distribution */}
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-white">Risk Score Distribution Across Sessions</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashData?.risk_distribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 9 }} interval={0} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {(dashData?.risk_distribution || []).map((_: any, idx: number) => {
                          const fills = ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'];
                          return <Cell key={idx} fill={fills[idx % fills.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Live 5-Factor Risk Score Breakdown Radar */}
              <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-white">Live 5-Factor Risk Score Breakdown</h3>
                  {latestBreakdown && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{latestBreakdown.entity_id}</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        latestBreakdown.risk_score >= 80 ? 'bg-rose-900/60 text-rose-300' :
                        latestBreakdown.risk_score >= 60 ? 'bg-amber-900/60 text-amber-300' :
                        'bg-emerald-900/60 text-emerald-300'
                      }`}>
                        Score: {latestBreakdown.risk_score}
                      </span>
                    </div>
                  )}
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { factor: 'Iso Forest', value: latestBreakdown?.isolation_forest_factor ?? 0, fullMark: 40 },
                      { factor: 'XGBoost', value: latestBreakdown?.xgboost_factor ?? 0, fullMark: 30 },
                      { factor: 'Geo Anomaly', value: latestBreakdown?.geo_anomaly_factor ?? 0, fullMark: 15 },
                      { factor: 'Device', value: latestBreakdown?.device_novelty_factor ?? 0, fullMark: 10 },
                      { factor: 'Time', value: latestBreakdown?.time_anomaly_factor ?? 0, fullMark: 5 },
                    ]}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                      <Radar name="Risk Factors" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} strokeWidth={2} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: 11 }} formatter={(v: any) => [`${v} pts`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {!latestBreakdown && (
                  <p className="text-center text-[11px] text-slate-500 -mt-2">Waiting for live stream event...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && <AlertQueue onSelectEntity={(id) => setSelectedEntityId(id)} />}
        {activeTab === 'analytics' && <AnalyticsStudio />}
        {activeTab === 'profile' && <UserProfilePanel />}
      </main>

      <EntityTimelineDrawer entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />
      <AttackReplayModal isOpen={isReplayOpen} onClose={() => setIsReplayOpen(false)} />
      <DataUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onRefreshData={fetchDashboard} onDownloadReport={() => window.open(`${API_BASE_URL}${API_ENDPOINTS.reportPdf}`, '_blank')} />
    </div>
  );
}
