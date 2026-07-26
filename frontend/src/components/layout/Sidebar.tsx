'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Eye,
  UserCheck,
  MapPin,
  ShieldAlert,
  Sliders,
  Laptop,
  Crown,
  Search,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGoPro: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGoPro,
  searchQuery,
  setSearchQuery,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-security', label: 'Data Security', icon: ShieldCheck },
    { id: 'shadow-it', label: 'Shadow IT', icon: Eye },
    { id: 'user-behaviour', label: 'User Behaviour', icon: UserCheck },
  ];

  const manageItems = [
    { id: 'destination', label: 'Destination', icon: MapPin },
    { id: 'protection', label: 'Protection', icon: ShieldAlert },
    { id: 'data-classification', label: 'Data Classification', icon: Sliders },
    { id: 'devices', label: 'Devices', icon: Laptop },
  ];

  return (
    <aside className="w-64 flex-shrink-0 min-h-screen bg-[#14052b]/95 border-r border-purple-500/20 p-5 flex flex-col justify-between backdrop-blur-xl">
      <div className="space-y-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white font-serif tracking-widest">
              SMARTNET
            </h1>
            <p className="text-[10px] tracking-widest text-purple-300 font-mono">SENTINEL AI SOC</p>
          </div>
        </div>

        {/* Sidebar Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-purple-300/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search......"
            className="w-full rounded-xl bg-[#28114b]/80 border border-purple-500/20 pl-10 pr-4 py-2 text-xs text-white placeholder-purple-300/50 focus:border-fuchsia-500 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* Menu Section */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-purple-300/70 tracking-wider uppercase px-3 mb-2">
            Menu
          </p>
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/90 to-purple-800/80 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40'
                    : 'text-purple-200/70 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-pink-400' : 'text-purple-300/60'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Manage Section */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-purple-300/70 tracking-wider uppercase px-3 mb-2">
            Manage
          </p>
          {manageItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/90 to-purple-800/80 text-white border border-purple-400/40 shadow-lg shadow-purple-900/40'
                    : 'text-purple-200/70 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-pink-400' : 'text-purple-300/60'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Go Pro Bottom Card */}
      <div className="relative mt-6 rounded-2xl bg-gradient-to-br from-purple-900/80 via-purple-950/90 to-indigo-950 border border-purple-400/30 p-4 space-y-3 shadow-xl overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none"></div>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-pink-500 text-white">
            <Crown className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">Go Pro</h3>
        </div>
        <p className="text-[11px] text-purple-200/70 leading-snug">
          Stay connected with your team & unlock advanced threat detection
        </p>
        <button
          onClick={onOpenGoPro}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white text-xs font-semibold shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-[1.02]"
        >
          <span>Upgrade Now</span>
        </button>
      </div>
    </aside>
  );
};
