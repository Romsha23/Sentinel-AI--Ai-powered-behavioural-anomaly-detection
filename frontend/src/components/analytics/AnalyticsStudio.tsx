'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { BarChart3, Cpu, CheckCircle2, Award, Grid3x3 } from 'lucide-react';
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

      {/* PR Curve + Confusion Matrix Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Precision-Recall Curve */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-white">Precision-Recall Curve (Imbalanced Class Performance)</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AUC-PR reflects model performance under class imbalance — more informative than ROC for rare attack detection.
          </p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.pr_curve || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="recall"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Recall', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  domain={[0, 1]}
                  label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: 11 }}
                  formatter={(v: any) => [v.toFixed(3), '']}
                  labelFormatter={(l) => `Recall: ${l}`}
                />
                <ReferenceLine
                  y={0.5}
                  stroke="#475569"
                  strokeDasharray="4 4"
                  label={{ value: 'Random', position: 'right', fill: '#475569', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 3 }}
                  name="Precision"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Grid3x3 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-semibold tracking-wide text-white">Confusion Matrix (Isolation Forest Primary Model)</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Rows = Actual class &nbsp;|&nbsp; Columns = Predicted class &nbsp;|&nbsp; Total = 10,000 test samples
          </p>
          {analytics?.confusion_matrix ? (() => {
            const [[tn, fp], [fn, tp]] = analytics.confusion_matrix;
            const total = tn + fp + fn + tp;
            const cells = [
              { label: 'True Negative', value: tn, sub: 'Correct Normal', bg: 'bg-emerald-950/60 border-emerald-800/50', text: 'text-emerald-300' },
              { label: 'False Positive', value: fp, sub: 'Normal → Attack', bg: 'bg-amber-950/60 border-amber-800/50', text: 'text-amber-300' },
              { label: 'False Negative', value: fn, sub: 'Attack → Normal', bg: 'bg-rose-950/60 border-rose-800/50', text: 'text-rose-300' },
              { label: 'True Positive', value: tp, sub: 'Correct Attack', bg: 'bg-blue-950/60 border-blue-800/50', text: 'text-blue-300' },
            ];
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {cells.map((c, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${c.bg} space-y-1`}>
                      <div className={`font-mono text-2xl font-extrabold ${c.text}`}>{c.value.toLocaleString()}</div>
                      <div className="text-[11px] font-semibold text-slate-200">{c.label}</div>
                      <div className="text-[10px] text-slate-400">{c.sub}</div>
                      <div className={`text-[10px] font-mono ${c.text}`}>{((c.value / total) * 100).toFixed(2)}%</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Total samples: <span className="font-mono text-white">{total.toLocaleString()}</span></span>
                  <span>Accuracy: <span className="font-mono text-emerald-400">{(((tn + tp) / total) * 100).toFixed(1)}%</span></span>
                  <span>F1: <span className="font-mono text-purple-400">{((2 * tp) / (2 * tp + fp + fn)).toFixed(3)}</span></span>
                </div>
              </div>
            );
          })() : (
            <div className="text-center text-slate-500 text-xs py-8">No confusion matrix data available</div>
          )}
        </div>

      </div>
    </div>
  );
};
