'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { BarChart3, Cpu, CheckCircle2, Award, Info, AlertTriangle } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export const AnalyticsStudio: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.analytics)
      .then((res) => {
        setAnalytics(res.data);
      })
      .catch((err) => {
        console.error('Failed to load ML analytics:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading ML benchmark metrics...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Model Rationale Card */}
      <div className="glass-panel rounded-2xl border border-blue-500/30 p-5 bg-gradient-to-r from-blue-950/40 to-slate-900">
        <div className="flex items-start space-x-3">
          <Award className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Selected Architecture: {analytics?.selected_model}</h3>
              <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                BENCHMARK WINNER
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analytics?.selected_rationale}
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Model Comparison Table */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold tracking-wide text-white">Head-to-Head Multi-Model Evaluation Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Model Name</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Accuracy</th>
                <th className="py-3 px-4 font-semibold">Precision</th>
                <th className="py-3 px-4 font-semibold">Recall</th>
                <th className="py-3 px-4 font-semibold">F1 Score</th>
                <th className="py-3 px-4 font-semibold">ROC-AUC</th>
                <th className="py-3 px-4 font-semibold">False Positives</th>
                <th className="py-3 px-4 font-semibold">False Negatives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {analytics?.comparison_matrix?.map((m: any, idx: number) => {
                const isSelected = m.model_name.includes('Selected');

                return (
                  <tr key={idx} className={isSelected ? 'bg-blue-950/30 border-l-4 border-l-blue-500 font-medium' : 'hover:bg-slate-800/40'}>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                      <span>{m.model_name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{m.status}</td>
                    <td className="py-3 px-4 font-mono">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400">{m.precision.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-400">{m.recall.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-400">{m.f1_score.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{m.roc_auc.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{m.false_positives}</td>
                    <td className="py-3 px-4 font-mono text-rose-400">{m.false_negatives}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Curves & Feature Importance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ROC Curve */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-white">ROC Curve (Receiver Operating Characteristic)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.roc_curve || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" stroke="#64748b" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#64748b" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-white">Feature Importance Weights (XGBoost SHAP)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.feature_importance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="feature" type="category" stroke="#64748b" width={120} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
