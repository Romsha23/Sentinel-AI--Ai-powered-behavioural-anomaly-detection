'use client';

import React, { useState } from 'react';
import { Mail, ChevronRight, MoreVertical, CheckCircle, BellRing, ShieldAlert } from 'lucide-react';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const EnvironmentSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Activate Email notifications for risky events to be performed.',
      enabled: true,
    },
    {
      id: 'push',
      title: 'Real-time Alert Triggers',
      description: 'Instant WebSocket pushes on critical anomaly detection scores.',
      enabled: true,
    },
    {
      id: 'mitigation',
      title: 'Automated Defense Policy',
      description: 'Auto-isolate suspicious host tokens upon high-risk detection.',
      enabled: false,
    },
  ]);

  const [activeModal, setActiveModal] = useState<SettingItem | null>(null);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-4 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white">Environment Settings</h3>
        <button className="text-purple-300/60 hover:text-white transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {settings.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl bg-[#2a134e]/90 border border-purple-500/20 hover:border-purple-400/50 p-3.5 transition-all shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300 border border-purple-500/30 mt-0.5">
                  {item.id === 'email' ? (
                    <Mail className="h-4 w-4" />
                  ) : item.id === 'push' ? (
                    <BellRing className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-purple-200/70 mt-0.5 leading-tight">
                    {item.description}
                  </p>
                  <button
                    onClick={() => setActiveModal(item)}
                    className="mt-2 text-[10px] font-semibold text-purple-300 hover:text-white flex items-center space-x-1 underline underline-offset-2"
                  >
                    <span>Read More</span>
                    <ChevronRight className="h-3 w-3 inline" />
                  </button>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => toggleSetting(item.id)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.enabled ? 'bg-pink-500' : 'bg-purple-900/80'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Read More */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#220e3f] border border-purple-500/40 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-pink-400" />
              <h3 className="text-base font-bold">{activeModal.title}</h3>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Configuring this setting adjusts automatic notification triggers in Sentinel SOC AI.
              When enabled, anomalous user behavior or risky network access triggers instant alerts
              to designated security operations channels.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
