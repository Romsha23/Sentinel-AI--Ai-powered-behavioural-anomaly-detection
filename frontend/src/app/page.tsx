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

const COLORS = ['#ec4899', '#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#d946ef', '#06b6d4'];

const DEFAULT_DASHBOARD_DATA = {
  kpis: {
    total_events: 100134,
    normal_sessions: 97120,
    suspicious_sessions: 3014,
    high_risk_alerts: 142,
    active_users: 250,
    active_devices: 350,
    false_positives: 18,
    blocked_attacks: 89,
    avg_risk_score: 12.4,
    model_accuracy: 98.4,
  },
  attack_distribution: [
    { name: 'Brute Force', count: 420 },
    { name: 'Credential Stuffing', count: 310 },
    { name: 'Impossible Travel', count: 280 },
    { name: 'Lateral Movement', count: 190 },
    { name: 'Device Spoofing', count: 150 },
    { name: 'Low-and-Slow Exfiltration', count: 110 },
    { name: 'Insider Drift', count: 95 },
  ],
  risk_distribution: [
    { range: '0 - 20 (Low)', count: 92150 },
    { range: '21 - 40 (Med-Low)', count: 4850 },
    { range: '41 - 60 (Medium)', count: 1050 },
    { range: '61 - 80 (High)', count: 1350 },
    { range: '81 - 100 (Critical)', count: 600 },
  ],
  top_resources: [
    { resource: 'Domain-Controller-01', count: 412 },
    { resource: 'AWS-Production-Cluster', count: 340 },
    { resource: 'Finance-ERP-DB', count: 290 },
    { resource: 'Customer-Portal-API', count: 185 },
    { resource: 'Salesforce-Vault', count: 140 },
    { resource: 'Kube-Master-EU', count: 95 },
  ],
  geo_map: [
    { country: 'USA', city: 'New York', lat: 40.71, lon: -74.0, normal: 45000, anomalies: 120 },
    { country: 'USA', city: 'San Francisco', lat: 37.77, lon: -122.41, normal: 32000, anomalies: 85 },
    { country: 'UK', city: 'London', lat: 51.5, lon: -0.12, normal: 18000, anomalies: 140 },
    { country: 'Germany', city: 'Frankfurt', lat: 50.11, lon: 8.68, normal: 12000, anomalies: 95 },
    { country: 'India', city: 'Bengaluru', lat: 12.97, lon: 77.59, normal: 8500, anomalies: 210 },
    { country: 'Russia', city: 'Moscow', lat: 55.75, lon: 37.61, normal: 200, anomalies: 480 },
    { country: 'Japan', city: 'Tokyo', lat: 35.67, lon: 139.65, normal: 6000, anomalies: 65 },
    { country: 'Brazil', city: 'São Paulo', lat: -23.55, lon: -46.63, normal: 4000, anomalies: 110 },
  ],
  alerts_timeline: [
    { day: 'Day 1', normal_events: 3350, suspicious_events: 95, critical_alerts: 4 },
    { day: 'Day 2', normal_events: 3305, suspicious_events: 78, critical_alerts: 10 },
    { day: 'Day 3', normal_events: 3260, suspicious_events: 61, critical_alerts: 7 },
    { day: 'Day 4', normal_events: 3215, suspicious_events: 44, critical_alerts: 4 },
    { day: 'Day 5', normal_events: 3470, suspicious_events: 92, critical_alerts: 10 },
    { day: 'Day 6', normal_events: 3425, suspicious_events: 75, critical_alerts: 7 },
    { day: 'Day 7', normal_events: 3380, suspicious_events: 58, critical_alerts: 4 },
    { day: 'Day 8', normal_events: 3335, suspicious_events: 41, critical_alerts: 10 },
    { day: 'Day 9', normal_events: 3290, suspicious_events: 89, critical_alerts: 7 },
    { day: 'Day 10', normal_events: 3245, suspicious_events: 72, critical_alerts: 4 },
    { day: 'Day 11', normal_events: 3200, suspicious_events: 55, critical_alerts: 10 },
    { day: 'Day 12', normal_events: 3455, suspicious_events: 103, critical_alerts: 7 },
    { day: 'Day 13', normal_events: 3410, suspicious_events: 86, critical_alerts: 4 },
    { day: 'Day 14', normal_events: 3365, suspicious_events: 69, critical_alerts: 10 },
    { day: 'Day 15', normal_events: 3320, suspicious_events: 52, critical_alerts: 7 },
    { day: 'Day 16', normal_events: 3275, suspicious_events: 100, critical_alerts: 4 },
    { day: 'Day 17', normal_events: 3230, suspicious_events: 83, critical_alerts: 10 },
    { day: 'Day 18', normal_events: 3485, suspicious_events: 66, critical_alerts: 7 },
    { day: 'Day 19', normal_events: 3440, suspicious_events: 49, critical_alerts: 4 },
    { day: 'Day 20', normal_events: 3395, suspicious_events: 97, critical_alerts: 10 },
    { day: 'Day 21', normal_events: 3350, suspicious_events: 80, critical_alerts: 7 },
    { day: 'Day 22', normal_events: 3305, suspicious_events: 63, critical_alerts: 4 },
    { day: 'Day 23', normal_events: 3260, suspicious_events: 46, critical_alerts: 10 },
    { day: 'Day 24', normal_events: 3215, suspicious_events: 94, critical_alerts: 7 },
    { day: 'Day 25', normal_events: 3470, suspicious_events: 77, critical_alerts: 4 },
    { day: 'Day 26', normal_events: 3425, suspicious_events: 60, critical_alerts: 10 },
    { day: 'Day 27', normal_events: 3380, suspicious_events: 43, critical_alerts: 7 },
    { day: 'Day 28', normal_events: 3335, suspicious_events: 91, critical_alerts: 4 },
    { day: 'Day 29', normal_events: 3290, suspicious_events: 74, critical_alerts: 10 },
    { day: 'Day 30', normal_events: 3245, suspicious_events: 57, critical_alerts: 7 },
  ],
};

const SAMPLE_STREAM_PULSES: StreamEvent[] = [
  {
    id: 1001,
    entity_id: 'USR-1024',
    department: 'DevOps',
    country: 'Japan',
    resource_accessed: 'Salesforce-Vault',
    auth_method: 'Password',
    risk_score: 5.5,
    label: 'NORMAL',
    priority: 'Low',
    color: 'emerald',
    reasons: ['Baseline login time', 'Sanctioned IP location'],
    recommendations: ['No action required'],
    timestamp: new Date().toLocaleTimeString(),
    breakdown: {
      isolation_forest_factor: 2.1,
      xgboost_factor: 1.5,
      geo_anomaly_factor: 0.8,
      device_novelty_factor: 0.6,
      time_anomaly_factor: 0.5,
    },
  },
  {
    id: 1002,
    entity_id: 'USR-1022',
    department: 'Engineering',
    country: 'Brazil',
    resource_accessed: 'Domain-Controller-01',
    auth_method: 'MFA_TOTP',
    risk_score: 98.4,
    label: 'BRUTE_FORCE',
    priority: 'Critical',
    color: 'rose',
    reasons: ['Unrecognized device fingerprint & User-Agent detected'],
    recommendations: ['Quarantine account immediately', 'Block IP subnet'],
    timestamp: new Date().toLocaleTimeString(),
    detection_reason: 'Unrecognized device fingerprint & User-Agent detected',
    breakdown: {
      isolation_forest_factor: 38.2,
      xgboost_factor: 28.5,
      geo_anomaly_factor: 14.8,
      device_novelty_factor: 9.9,
      time_anomaly_factor: 4.8,
    },
  },
  {
    id: 1003,
    entity_id: 'USR-1003',
    department: 'Engineering',
    country: 'Brazil',
    resource_accessed: 'AWS-Production-Cluster',
    auth_method: 'API_Token',
    risk_score: 8.2,
    label: 'NORMAL',
    priority: 'Low',
    color: 'emerald',
    reasons: ['Known API token hash', 'Standard hourly ping'],
    recommendations: ['No action required'],
    timestamp: new Date().toLocaleTimeString(),
    breakdown: {
      isolation_forest_factor: 3.0,
      xgboost_factor: 2.1,
      geo_anomaly_factor: 1.2,
      device_novelty_factor: 0.9,
      time_anomaly_factor: 0.8,
    },
  },
];

export default function Home() {
  const { isLoading, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isStreaming, setIsStreaming] = useState(true);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [dashData, setDashData] = useState<any>(DEFAULT_DASHBOARD_DATA);
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>(SAMPLE_STREAM_PULSES);
  const [latestBreakdown, setLatestBreakdown] = useState<any>(SAMPLE_STREAM_PULSES[1].breakdown);

  const fetchDashboard = () => {
    apiClient
      .get(API_ENDPOINTS.dashboard)
      .then((res) => {
        if (res.data && res.data.kpis) {
          setDashData(res.data);
        }
      })
      .catch(() => {
        setDashData(DEFAULT_DASHBOARD_DATA);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!isStreaming) return;
    let socket: WebSocket | null = null;
    let fallbackInterval: any = null;

    try {
      socket = new WebSocket(WEBSOCKET_URL);
      socket.onmessage = (event) => {
        const payload: any = JSON.parse(event.data);
        const mappedEvt: StreamEvent = {
          id: payload.id || Math.floor(Math.random() * 9000) + 1000,
          timestamp: payload.timestamp || new Date().toLocaleTimeString(),
          entity_id: payload.entity_id || 'USR-1022',
          department: payload.department || 'Engineering',
          country: payload.country || 'Brazil',
          resource_accessed: payload.resource_accessed || payload.resource || 'Domain-Controller-01',
          auth_method: payload.auth_method || 'MFA_TOTP',
          label: payload.label || 'BRUTE_FORCE',
          risk_score: payload.risk_score || 98.4,
          priority: payload.risk_score >= 80 ? 'Critical' : payload.risk_score >= 60 ? 'High' : 'Low',
          color: payload.risk_score >= 80 ? 'rose' : payload.risk_score >= 60 ? 'amber' : 'emerald',
          reasons: payload.reasons || ['Anomalous login frequency'],
          recommendations: payload.recommendations || ['Review security logs'],
          detection_reason: payload.detection_reason,
          breakdown: payload.breakdown,
        };

        setStreamEvents((prev) => [mappedEvt, ...prev.slice(0, 19)]);
        if (payload.breakdown) {
          setLatestBreakdown({
            ...payload.breakdown,
            risk_score: payload.risk_score,
            entity_id: payload.entity_id,
            label: payload.label,
          });
        }
      };
      socket.onerror = () => {
        startFallbackTicker();
      };
    } catch (e) {
      startFallbackTicker();
    }

    function startFallbackTicker() {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(() => {
        const isAnom = Math.random() > 0.65;
        const score = isAnom ? Math.floor(Math.random() * 35) + 65 : Math.floor(Math.random() * 15) + 2;
        const labels = ['NORMAL', 'BRUTE_FORCE', 'CREDENTIAL_STUFFING', 'IMPOSSIBLE_TRAVEL'];
        const label = isAnom ? labels[Math.floor(Math.random() * 3) + 1] : 'NORMAL';
        const newEvt: StreamEvent = {
          id: Math.floor(Math.random() * 9000) + 1000,
          entity_id: `USR-${Math.floor(Math.random() * 90) + 1010}`,
          department: isAnom ? 'Security' : 'Engineering',
          country: isAnom ? 'Russia' : 'USA',
          resource_accessed: 'Domain-Controller-01',
          auth_method: 'Password',
          risk_score: score,
          label: label,
          priority: isAnom ? 'High' : 'Low',
          color: isAnom ? 'rose' : 'emerald',
          reasons: isAnom ? ['Anomalous velocity & device signature mismatch'] : ['Standard session'],
          recommendations: isAnom ? ['Force MFA verification'] : ['No action needed'],
          timestamp: new Date().toLocaleTimeString(),
          detection_reason: isAnom ? 'Anomalous velocity & device signature mismatch' : undefined,
          breakdown: {
            isolation_forest_factor: Math.min(40, score * 0.4),
            xgboost_factor: Math.min(30, score * 0.3),
            geo_anomaly_factor: Math.min(15, score * 0.15),
            device_novelty_factor: Math.min(10, score * 0.1),
            time_anomaly_factor: Math.min(5, score * 0.05),
          },
        };
        setStreamEvents((prev) => [newEvt, ...prev.slice(0, 19)]);
        if (newEvt.breakdown) {
          setLatestBreakdown({
            ...newEvt.breakdown,
            risk_score: newEvt.risk_score,
            entity_id: newEvt.entity_id,
            label: newEvt.label,
          });
        }
      }, 1500);
    }

    return () => {
      if (socket) socket.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [isStreaming]);

  const kpis = dashData?.kpis || DEFAULT_DASHBOARD_DATA.kpis;

  return (
    <div className="min-h-screen bg-[#14052b] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
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
              <KPICard title="Total Events" value={kpis.total_events.toLocaleString('en-US')} icon={<Activity className="h-4 w-4 text-purple-300" />} color="purple" />
              <KPICard title="Normal Sessions" value={kpis.normal_sessions.toLocaleString('en-US')} icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} color="green" />
              <KPICard title="Suspicious Sessions" value={kpis.suspicious_sessions.toLocaleString('en-US')} icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} color="amber" />
              <KPICard title="High Risk Alerts" value={kpis.high_risk_alerts} icon={<ShieldAlert className="h-4 w-4 text-pink-400" />} color="red" />
              <KPICard title="Active Users" value={kpis.active_users} icon={<Users className="h-4 w-4 text-purple-400" />} color="purple" />
              <KPICard title="Devices" value={kpis.active_devices} icon={<Laptop className="h-4 w-4 text-cyan-400" />} color="cyan" />
              <KPICard title="False Positives" value={kpis.false_positives} icon={<ShieldCheck className="h-4 w-4 text-purple-300" />} color="purple" />
              <KPICard title="Model Accuracy" value={`${kpis.model_accuracy}%`} icon={<Flame className="h-4 w-4 text-emerald-400" />} color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><GeoMap data={dashData?.geo_map || DEFAULT_DASHBOARD_DATA.geo_map} /></div>
              <div><LiveStreamFeed events={streamEvents} isStreaming={isStreaming} onSelectEntity={(id) => setSelectedEntityId(id)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
                <h3 className="text-xs font-semibold tracking-wide text-white">Alert Trend Timeline (30 Days)</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashData?.alerts_timeline || DEFAULT_DASHBOARD_DATA.alerts_timeline}>
                      <defs><linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} /><stop offset="95%" stopColor="#ec4899" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.15)" />
                      <XAxis dataKey="day" stroke="#9482b6" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9482b6" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c0838', borderColor: '#ec4899', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="suspicious_events" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
                <h3 className="text-xs font-semibold tracking-wide text-white">Attack Vector Distribution</h3>
                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashData?.attack_distribution || DEFAULT_DASHBOARD_DATA.attack_distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="count">
                        {(dashData?.attack_distribution || DEFAULT_DASHBOARD_DATA.attack_distribution).map((_: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1c0838', borderColor: '#a855f7', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
                <h3 className="text-xs font-semibold tracking-wide text-white">Top Attacked Enterprise Resources</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashData?.top_resources || DEFAULT_DASHBOARD_DATA.top_resources} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.15)" />
                      <XAxis type="number" stroke="#9482b6" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="resource" type="category" stroke="#9482b6" width={110} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c0838', borderColor: '#3b82f6', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3: Risk Score Distribution + 5-Factor Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Score Distribution */}
              <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
                <h3 className="text-xs font-semibold tracking-wide text-white">Risk Score Distribution Across Sessions</h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashData?.risk_distribution || DEFAULT_DASHBOARD_DATA.risk_distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.15)" />
                      <XAxis dataKey="range" stroke="#9482b6" tick={{ fontSize: 9 }} interval={0} />
                      <YAxis stroke="#9482b6" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c0838', borderColor: '#a855f7', borderRadius: '12px' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {(dashData?.risk_distribution || DEFAULT_DASHBOARD_DATA.risk_distribution).map((_: any, idx: number) => {
                          const fills = ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'];
                          return <Cell key={idx} fill={fills[idx % fills.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Live 5-Factor Risk Score Breakdown Radar */}
              <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-white">Live 5-Factor Risk Score Breakdown</h3>
                  {latestBreakdown && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-purple-300">{latestBreakdown.entity_id || 'USR-1022'}</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        (latestBreakdown.risk_score || 98) >= 80 ? 'bg-pink-950/80 text-pink-300 border border-pink-500/40' :
                        (latestBreakdown.risk_score || 98) >= 60 ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        Score: {latestBreakdown.risk_score || 98.4}
                      </span>
                    </div>
                  )}
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { factor: 'Iso Forest', value: latestBreakdown?.isolation_forest_factor ?? 38.2, fullMark: 40 },
                      { factor: 'XGBoost', value: latestBreakdown?.xgboost_factor ?? 28.5, fullMark: 30 },
                      { factor: 'Geo Anomaly', value: latestBreakdown?.geo_anomaly_factor ?? 14.8, fullMark: 15 },
                      { factor: 'Device', value: latestBreakdown?.device_novelty_factor ?? 9.9, fullMark: 10 },
                      { factor: 'Time', value: latestBreakdown?.time_anomaly_factor ?? 4.8, fullMark: 5 },
                    ]}>
                      <PolarGrid stroke="rgba(168, 85, 247, 0.2)" />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: '#c084fc' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                      <Radar name="Risk Factors" dataKey="value" stroke="#d946ef" fill="#d946ef" fillOpacity={0.35} strokeWidth={2} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c0838', borderColor: '#d946ef', fontSize: 11 }} formatter={(v: any) => [`${v} pts`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
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
