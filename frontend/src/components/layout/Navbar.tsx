'use client';

import React from 'react';
import { Shield, Activity, Bell, BarChart3, Database, Play, Download, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReplay: () => void;
  onOpenUpload: () => void;
  onDownloadReport: () => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReplay,
  onOpenUpload,
  onDownloadReport,
  isStreaming,
  setIsStreaming,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Alert Queue', icon: Bell },
    { id: 'analytics', label: 'ML Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070A13]/90 backdrop-blur-md light:bg-white/90 light:border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              <span className="text-lg font-bold tracking-tight text-white light:text-slate-900">SENTINEL AI</span>
              <span className="rounded-md bg-blue-950 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-800 light:bg-blue-100 light:text-blue-700 light:border-blue-200">SOC v2.0</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex space-x-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800 light:bg-slate-100 light:border-slate-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenReplay}
            className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-rose-500 transition-all border border-amber-400/30"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Replay</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="hidden lg:flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 hover:bg-slate-700 light:bg-slate-200 light:text-slate-800 light:border-slate-300"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Generator</span>
          </button>

          <button
            onClick={onDownloadReport}
            className="hidden lg:flex items-center space-x-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono border transition-all ${
              isStreaming
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 light:bg-slate-100'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span className="hidden sm:inline">{isStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-slate-300 border border-slate-800 hover:border-slate-700 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            title="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden sm:flex items-center space-x-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 border border-slate-800 light:bg-slate-100 light:text-slate-700 light:border-slate-300">
            <User className="h-3.5 w-3.5 text-blue-400" />
            <span>{user?.username || 'User'}</span>
            <span className="text-slate-500">({user?.role})</span>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-800 light:bg-slate-100 light:border-slate-300"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex justify-around border-t border-slate-800 px-2 py-1.5 light:border-slate-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center px-2 py-1 text-[10px] ${
              activeTab === id ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Mobile action bar — Replay / Generator / Export */}
      <div className="md:hidden flex items-center justify-between border-t border-slate-800/60 px-3 py-1.5 bg-[#070A13]/80 light:bg-white/80 light:border-slate-200">
        <button
          onClick={onOpenReplay}
          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white border border-amber-400/30"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Replay</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-200 border border-slate-700 light:bg-slate-200 light:text-slate-800"
        >
          <Database className="h-3 w-3" />
          <span>Generator</span>
        </button>

        <button
          onClick={onDownloadReport}
          className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-[11px] font-medium text-emerald-400"
        >
          <Download className="h-3 w-3" />
          <span>PDF Export</span>
        </button>
      </div>
    </header>
  );
};
