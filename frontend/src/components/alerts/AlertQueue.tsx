'use client';

import React, { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2, UserCheck, ChevronRight, XCircle, FileText, ShieldAlert } from 'lucide-react';

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
}

interface AlertQueueProps {
  alerts: AlertItem[];
  onSelectEntity: (entityId: string) => void;
  onUpdateAlertStatus: (alertId: string, status: string, analyst?: string, notes?: string) => void;
}

export const AlertQueue: React.FC<AlertQueueProps> = ({
  alerts,
  onSelectEntity,
  onUpdateAlertStatus,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [attackFilter, setAttackFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [analystInput, setAnalystInput] = useState('Analyst Sarah');

  // Filtered Alerts
  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.entity_id.toLowerCase().includes(search.toLowerCase()) ||
      a.attack_type.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
    const matchesAttack = attackFilter === 'ALL' || a.attack_type === attackFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesPriority && matchesAttack && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Controls & Filters Bar */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800">
        
        {/* Search Input */}
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Alert ID, Entity ID, or Attack Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical (80-100)</option>
            <option value="High">High (60-79)</option>
            <option value="Medium">Medium (40-59)</option>
            <option value="Low">Low (0-39)</option>
          </select>
        </div>

        {/* Attack Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Attack Type:</span>
          <select
            value={attackFilter}
            onChange={(e) => setAttackFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Attack Types</option>
            <option value="Brute Force">Brute Force</option>
            <option value="Impossible Travel">Impossible Travel</option>
            <option value="Credential Stuffing">Credential Stuffing</option>
            <option value="Lateral Movement">Lateral Movement</option>
            <option value="Device Spoofing">Device Spoofing</option>
            <option value="Low-and-Slow Exfiltration">Low-and-Slow Exfil</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="False Positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Main Alert Table */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Alert ID</th>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Entity</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Attack Type</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Analyst</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No alerts match the selected search & filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-800/40 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedAlert(alert);
                      setNotesInput(alert.notes || '');
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{alert.id}</td>
                    <td className="py-3.5 px-4 text-slate-400">{alert.timestamp.replace('T', ' ').slice(0, 19)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEntity(alert.entity_id);
                        }}
                        className="font-mono font-medium text-white hover:text-blue-400 hover:underline"
                      >
                        {alert.entity_id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{alert.risk_score}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-100">{alert.attack_type}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        alert.priority === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        alert.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        alert.priority === 'Medium' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${
                        alert.status === 'Resolved' ? 'bg-emerald-900/60 text-emerald-300' :
                        alert.status === 'False Positive' ? 'bg-slate-800 text-slate-400' :
                        alert.status === 'In Progress' ? 'bg-blue-900/60 text-blue-300' :
                        'bg-rose-900/60 text-rose-300'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{alert.assigned_analyst}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                          setNotesInput(alert.notes || '');
                        }}
                        className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-600/30"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyst Investigation Workflow Drawer / Modal */}
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
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Risk Breakdown & Explainability Card */}
            <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">5-Factor Risk Score:</span>
                <span className="font-mono text-lg font-bold text-rose-400">{selectedAlert.risk_score} / 100</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-300">Actionable Detection Reasons:</p>
                <ul className="mt-1 space-y-1 text-xs text-slate-300">
                  {selectedAlert.reasons.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300">AI Recommended Mitigation Actions:</p>
                <ul className="mt-1 space-y-1 text-xs text-slate-300">
                  {selectedAlert.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Analyst Workflow Controls */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">Assign SOC Analyst:</label>
              <input
                type="text"
                value={analystInput}
                onChange={(e) => setAnalystInput(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
              />

              <label className="block text-xs font-medium text-slate-300">Investigation Notes & Root Cause Analysis:</label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Enter SOC incident response notes..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectEntity(selectedAlert.entity_id);
                  setSelectedAlert(null);
                }}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium text-blue-400 border border-slate-700 hover:bg-slate-700"
              >
                View Entity Baseline Timeline →
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onUpdateAlertStatus(selectedAlert.id, 'False Positive', analystInput, notesInput);
                    setSelectedAlert(null);
                  }}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
                >
                  Mark False Positive
                </button>
                <button
                  onClick={() => {
                    onUpdateAlertStatus(selectedAlert.id, 'Resolved', analystInput, notesInput);
                    setSelectedAlert(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md"
                >
                  Resolve Incident
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
