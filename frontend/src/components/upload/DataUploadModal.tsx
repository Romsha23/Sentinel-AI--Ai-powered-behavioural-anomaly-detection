'use client';

import React, { useState } from 'react';
import { Database, Upload, RefreshCw, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
  onDownloadReport: () => void;
}

export const DataUploadModal: React.FC<DataUploadModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  onDownloadReport,
}) => {
  const [numRecords, setNumRecords] = useState(10000);
  const [attackRatio, setAttackRatio] = useState(0.02);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMsg('Generating synthetic logs & training Isolation Forest models...');
    try {
      const res = await apiClient.post(API_ENDPOINTS.generateData, {
        num_records: numRecords,
        attack_ratio: attackRatio,
      });
      setStatusMsg(res.data.message);
      onRefreshData();
    } catch (err: any) {
      setStatusMsg('Failed to generate dataset.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setIsGenerating(true);
    setStatusMsg(`Uploading and analyzing ${file.name}...`);
    try {
      const res = await apiClient.post(API_ENDPOINTS.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatusMsg(res.data.message);
      onRefreshData();
    } catch (err) {
      setStatusMsg('CSV Upload failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">SYNTHETIC DATA GENERATOR & CSV STUDIO</h2>
              <p className="text-xs text-slate-400">Configure parameters for 100,000+ log event benchmark engine</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            ✕
          </button>
        </div>

        {/* Generator Controls */}
        <div className="space-y-4 rounded-xl bg-slate-900/80 p-4 border border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Target Record Count:</span>
              <span className="font-mono text-blue-400">{numRecords.toLocaleString()} Logs</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={5000}
              value={numRecords}
              onChange={(e) => setNumRecords(Number(e.target.value))}
              className="w-full mt-2 accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Injected Cyber Attack Ratio:</span>
              <span className="font-mono text-rose-400">{(attackRatio * 100).toFixed(1)}% Attacks</span>
            </div>
            <input
              type="range"
              min={0.005}
              max={0.05}
              step={0.005}
              value={attackRatio}
              onChange={(e) => setAttackRatio(Number(e.target.value))}
              className="w-full mt-2 accent-rose-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating & Training...' : 'Generate Synthetic Dataset & Train Models'}</span>
          </button>
        </div>

        {/* CSV File Upload Section */}
        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2 text-center">
          <p className="text-xs font-semibold text-slate-300">Or Upload External Log CSV</p>
          <label className="cursor-pointer inline-flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 border border-slate-700 hover:bg-slate-700">
            <Upload className="h-4 w-4 text-blue-400" />
            <span>Select CSV File</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* PDF Export Section */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">Export SOC Analysis Report:</span>
          <button
            onClick={onDownloadReport}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Threat Report</span>
          </button>
        </div>

        {/* Status Message Display */}
        {statusMsg && (
          <div className="rounded-xl bg-blue-950/60 p-3 border border-blue-800 text-xs text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

      </div>
    </div>
  );
};
