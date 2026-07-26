'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, AlertCircle, ShieldAlert, Plus, Trash2, ChevronLeft, ChevronRight, ArrowUpDown,
} from 'lucide-react';
import { apiClient, API_ENDPOINTS, buildAlertQuery } from '@/lib/api';

export interface AlertItem {
  id: string;
  timestamp: string;
  entity_id: string;
  risk_score: number;
  attack_type: string;
  priority: string;
  status: string;
  assigned_analyst: string;
  notes: string;
  reasons: string[];
  recommendations: string[];
  breakdown?: {
    isolation_forest_factor: number;
    xgboost_factor: number;
    geo_anomaly_factor: number;
    device_novelty_factor: number;
    time_anomaly_factor: number;
  };
}

interface AlertQueueProps {
  onSelectEntity: (entityId: string) => void;
}

const PAGE_SIZE = 5;

export const AlertQueue: React.FC<AlertQueueProps> = ({ onSelectEntity }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [attackFilter, setAttackFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [analystInput, setAnalystInput] = useState('Analyst Sarah');
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({
    entity_id: '', risk_score: 75, attack_type: 'Brute Force', priority: 'High', notes: '',
  });

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildAlertQuery({
        search: search || undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        attack_type: attackFilter !== 'ALL' ? attackFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      const res = await apiClient.get(`${API_ENDPOINTS.alerts}${qs}`);
      setAlerts(res.data.alerts || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [search, priorityFilter, attackFilter, statusFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchAlerts, 300);
    return () => clearTimeout(debounce);
  }, [fetchAlerts]);

  useEffect(() => {
    setPage(0);
  }, [search, priorityFilter, attackFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleUpdateAlert = async (alertId: string, status: string, analyst?: string, notes?: string) => {
    await apiClient.put(`${API_ENDPOINTS.alerts}${alertId}`, { status, assigned_analyst: analyst, notes });
    fetchAlerts();
  };

  const handleDelete = async (alertId: string) => {
    if (!confirm(`Delete alert ${alertId}?`)) return;
    await apiClient.delete(API_ENDPOINTS.alert(alertId));
    fetchAlerts();
  };

  const handleCreate = async () => {
    await apiClient.post(API_ENDPOINTS.alerts, {
      ...newAlert,
      status: 'New',
      assigned_analyst: 'Unassigned',
    });
    setShowCreate(false);
    setNewAlert({ entity_id: '', risk_score: 75, attack_type: 'Brute Force', priority: 'High', notes: '' });
    fetchAlerts();
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Alert ID, Entity ID, or Attack Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none light:bg-white light:border-slate-300 light:text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none light:bg-white light:text-slate-900">
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={attackFilter} onChange={(e) => setAttackFilter(e.target.value)} className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none light:bg-white light:text-slate-900">
            <option value="ALL">All Attack Types</option>
            <option value="Brute Force">Brute Force</option>
            <option value="Impossible Travel">Impossible Travel</option>
            <option value="Credential Stuffing">Credential Stuffing</option>
            <option value="Lateral Movement">Lateral Movement</option>
            <option value="Device Spoofing">Device Spoofing</option>
            <option value="Low-and-Slow Exfiltration">Low-and-Slow Exfil</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none light:bg-white light:text-slate-900">
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="False Positive">False Positive</option>
          </select>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-3.5 w-3.5" /> New Alert
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] light:bg-slate-100 light:text-slate-600">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Alert ID</th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer" onClick={() => toggleSort('timestamp')}>
                  <span className="flex items-center gap-1">Timestamp <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-3.5 px-4 font-semibold">Entity</th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer" onClick={() => toggleSort('risk_score')}>
                  <span className="flex items-center gap-1">Risk Score <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-3.5 px-4 font-semibold">Attack Type</th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer" onClick={() => toggleSort('priority')}>
                  <span className="flex items-center gap-1">Priority <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-3.5 px-4 font-semibold cursor-pointer" onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-3.5 px-4 font-semibold">Analyst</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 light:text-slate-700">
              {loading ? (
                <tr><td colSpan={9} className="py-8 text-center text-slate-400">Loading alerts...</td></tr>
              ) : alerts.length === 0 ? (
                <tr><td colSpan={9} className="py-8 text-center text-slate-400">No alerts match the selected criteria.</td></tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/40 transition-all cursor-pointer light:hover:bg-slate-100">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{alert.id}</td>
                    <td className="py-3.5 px-4 text-slate-400">{alert.timestamp.replace('T', ' ').slice(0, 19)}</td>
                    <td className="py-3.5 px-4">
                      <button onClick={(e) => { e.stopPropagation(); onSelectEntity(alert.entity_id); }} className="font-mono font-medium text-white hover:text-blue-400 light:text-slate-900">
                        {alert.entity_id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{alert.risk_score}</td>
                    <td className="py-3.5 px-4">{alert.attack_type}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        alert.priority === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        alert.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>{alert.priority}</span>
                    </td>
                    <td className="py-3.5 px-4">{alert.status}</td>
                    <td className="py-3.5 px-4 text-slate-400">{alert.assigned_analyst}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button onClick={() => { setSelectedAlert(alert); setNotesInput(alert.notes || ''); }} className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-600/30">Investigate</button>
                      <button onClick={() => handleDelete(alert.id)} className="rounded-lg bg-rose-600/20 px-2 py-1 text-[11px] text-rose-400 hover:bg-rose-600/30"><Trash2 className="h-3 w-3 inline" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 light:border-slate-200">
          <span className="text-xs text-slate-400">
            Showing {total === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40 light:bg-slate-200 light:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40 light:bg-slate-200 light:text-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2"><Plus className="h-5 w-5 text-blue-400" /> Create New Alert</h3>
            <input placeholder="Entity ID (e.g. USR-1234)" value={newAlert.entity_id} onChange={(e) => setNewAlert({ ...newAlert, entity_id: e.target.value })} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white" />
            <input type="number" placeholder="Risk Score" value={newAlert.risk_score} onChange={(e) => setNewAlert({ ...newAlert, risk_score: +e.target.value })} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white" />
            <select value={newAlert.attack_type} onChange={(e) => setNewAlert({ ...newAlert, attack_type: e.target.value })} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white">
              <option>Brute Force</option><option>Impossible Travel</option><option>Lateral Movement</option><option>Device Spoofing</option>
            </select>
            <select value={newAlert.priority} onChange={(e) => setNewAlert({ ...newAlert, priority: e.target.value })} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white">
              <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <textarea placeholder="Notes" value={newAlert.notes} onChange={(e) => setNewAlert({ ...newAlert, notes: e.target.value })} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white" rows={2} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCreate(false)} className="rounded-xl bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button>
              <button onClick={handleCreate} disabled={!newAlert.entity_id} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-6 w-6 text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-white">SOC Alert Investigation — {selectedAlert.id}</h3>
                  <p className="text-xs text-slate-400">Entity: <span className="font-mono text-blue-400">{selectedAlert.entity_id}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">✕</button>
            </div>
            <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Risk Score:</span>
                <span className="font-mono text-lg font-bold text-rose-400">{selectedAlert.risk_score} / 100</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedAlert.reasons.map((r, i) => (<li key={i}>• {r}</li>))}
              </ul>
            </div>

            {/* 5-Factor Risk Score Breakdown */}
            {selectedAlert.breakdown && (() => {
              const bd = selectedAlert.breakdown!;
              const factors = [
                { label: 'Isolation Forest (40%)', value: bd.isolation_forest_factor, max: 40, color: 'bg-blue-500' },
                { label: 'XGBoost Classifier (30%)', value: bd.xgboost_factor, max: 30, color: 'bg-purple-500' },
                { label: 'Geo Velocity Anomaly (15%)', value: bd.geo_anomaly_factor, max: 15, color: 'bg-amber-500' },
                { label: 'Device Novelty (10%)', value: bd.device_novelty_factor, max: 10, color: 'bg-rose-500' },
                { label: 'Time Anomaly (5%)', value: bd.time_anomaly_factor, max: 5, color: 'bg-cyan-500' },
              ];
              return (
                <div className="rounded-xl bg-slate-900 p-4 border border-blue-900/40 space-y-3">
                  <p className="text-xs font-semibold text-blue-300">5-Factor Risk Score Breakdown</p>
                  <div className="space-y-2.5">
                    {factors.map((f) => (
                      <div key={f.label} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">{f.label}</span>
                          <span className="font-mono text-white">{f.value.toFixed(1)} / {f.max} pts</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800">
                          <div
                            className={`h-1.5 rounded-full ${f.color} transition-all`}
                            style={{ width: `${Math.min(100, (f.value / f.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <input type="text" value={analystInput} onChange={(e) => setAnalystInput(e.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white" placeholder="Assign analyst" />
            <textarea rows={3} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white" placeholder="Investigation notes..." />
            <div className="flex flex-wrap justify-between gap-2 pt-3 border-t border-slate-800">
              <button onClick={() => { onSelectEntity(selectedAlert.entity_id); setSelectedAlert(null); }} className="rounded-xl bg-slate-800 px-4 py-2 text-xs text-blue-400">View Timeline →</button>
              <div className="flex space-x-2">
                <button onClick={() => { handleUpdateAlert(selectedAlert.id, 'False Positive', analystInput, notesInput); setSelectedAlert(null); }} className="rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-300">False Positive</button>
                <button onClick={() => { handleUpdateAlert(selectedAlert.id, 'Resolved', analystInput, notesInput); setSelectedAlert(null); }} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Resolve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
