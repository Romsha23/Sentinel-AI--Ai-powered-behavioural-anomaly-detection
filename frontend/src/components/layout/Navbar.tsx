'use client';

import React from 'react';
import { Shield, Activity, Bell, BarChart3, Database, Play, Download, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReplay: () => void;
  onOpenUpload: () => void;
  onDownloadReport: () => void;
  userRole: string;
  setUserRole: (role: string) => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReplay,
  onOpenUpload,
  onDownloadReport,
  userRole,
  setUserRole,
  isStreaming,
  setIsStreaming,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070A13]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 cyber-glow-blue">
            <Shield className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">SENTINEL AI</span>
              <span className="rounded-md bg-blue-950 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-800">SOC v2.0</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Alert Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>ML Analytics</span>
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3">
          
          {/* Replay Simulation Button */}
          <button
            onClick={onOpenReplay}
            className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-rose-500 transition-all border border-amber-400/30"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>▶ Replay Attack</span>
          </button>

          {/* Data Studio & Upload */}
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Generator Studio</span>
          </button>

          {/* Download PDF Report */}
          <button
            onClick={onDownloadReport}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </button>

          {/* Live Stream Toggle */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono border transition-all ${
              isStreaming
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Live WebSocket Event Stream"
          >
            <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>{isStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Role Switcher */}
          <button
            onClick={() => setUserRole(userRole === 'Security Analyst' ? 'Admin' : 'Security Analyst')}
            className="flex items-center space-x-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 border border-slate-800 hover:border-slate-700"
          >
            <UserCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>{userRole}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
