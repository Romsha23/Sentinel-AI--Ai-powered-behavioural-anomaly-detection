'use client';

import React from 'react';
import { Shield, Activity, Bell, BarChart3, Database, Play, Download, User, LogOut, Sun, Moon, Search } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/20 bg-[#14052b]/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30">
            <Shield className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-wider text-white font-serif">SENTINEL AI</span>
              <span className="rounded-md bg-purple-950/80 px-2 py-0.5 text-[10px] font-semibold text-pink-300 border border-purple-500/40">
                SOC v2.0
              </span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex space-x-1 rounded-xl bg-[#220e3f]/80 p-1 border border-purple-500/20">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                  : 'text-purple-200/70 hover:text-white hover:bg-purple-900/40'
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
            className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] transition-all border border-pink-400/40"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Replay</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="hidden lg:flex items-center space-x-1.5 rounded-xl bg-[#28114b] px-3 py-1.5 text-xs font-medium text-purple-200 border border-purple-500/30 hover:bg-[#341661] hover:text-white transition-all"
          >
            <Database className="h-3.5 w-3.5 text-purple-300" />
            <span>Generator</span>
          </button>

          <button
            onClick={onDownloadReport}
            className="hidden lg:flex items-center space-x-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 px-3 py-1.5 text-xs font-medium text-pink-300 hover:bg-purple-900/70 hover:text-white transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center space-x-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono border transition-all ${
              isStreaming
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400'
                : 'bg-[#220e3f] border-purple-500/30 text-purple-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-purple-600'}`}></span>
            <span className="hidden sm:inline">{isStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-xl bg-[#28114b] px-2.5 py-1.5 text-purple-200 border border-purple-500/30 hover:text-white transition-colors"
            title="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-[#28114b] px-2.5 py-1.5 text-xs font-mono text-purple-200 border border-purple-500/30">
            <User className="h-3.5 w-3.5 text-pink-400" />
            <span className="font-bold text-white">{user?.username || 'User'}</span>
            <span className="text-purple-300/60">({user?.role})</span>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-[#28114b] px-2.5 py-1.5 text-purple-300 border border-purple-500/30 hover:text-pink-400 hover:border-pink-500/40 transition-all"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex justify-around border-t border-purple-500/20 px-2 py-1.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center px-2 py-1 text-[10px] ${
              activeTab === id ? 'text-pink-400 font-bold' : 'text-purple-300/70'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
