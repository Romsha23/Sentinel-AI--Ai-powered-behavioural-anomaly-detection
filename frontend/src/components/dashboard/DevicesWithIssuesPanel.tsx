'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronRight, Laptop, ShieldAlert } from 'lucide-react';

const SAMPLE_ISSUES = [
  {
    id: 1,
    title: 'What are quick Safetica NXT?',
    answer: 'Safetica NXT provides instant data loss prevention (DLP) insights and automated threat responses for endpoint devices across corporate networks.',
  },
  {
    id: 2,
    title: 'Sustaining company dynamism?',
    answer: 'Ensures uninterrupted employee productivity while enforcing zero-trust data access policies and detecting anomalous exfiltration signals.',
  },
  {
    id: 3,
    title: 'What are quick Safetica NXT?',
    answer: 'Quick endpoint auditing enables seamless monitoring of external device attachments, unauthorized app execution, and cloud transfers.',
  },
];

export const DevicesWithIssuesPanel: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<typeof SAMPLE_ISSUES[0] | null>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-[#220e3f]/80 backdrop-blur-xl border border-purple-500/20 p-5 space-y-4 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white flex items-center space-x-2">
          <Laptop className="h-4 w-4 text-pink-400" />
          <span>Devices with Issues</span>
        </h3>
      </div>

      <div className="space-y-2.5">
        {SAMPLE_ISSUES.map((issue) => (
          <button
            key={issue.id}
            onClick={() => setSelectedIssue(issue)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2b134d]/90 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#34185c] text-left transition-all shadow-md group"
          >
            <span className="text-xs text-purple-100 font-medium group-hover:text-pink-300 transition-colors truncate">
              {issue.title}
            </span>
            <ChevronRight className="h-4 w-4 text-purple-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="pt-1 text-center">
        <button
          onClick={() => setIsViewAllOpen(true)}
          className="px-6 py-2 rounded-xl bg-[#2c134f] border border-purple-500/30 hover:border-pink-500/50 text-xs font-semibold text-purple-200 hover:text-white transition-all shadow-md"
        >
          View all
        </button>
      </div>

      {/* Answer Modal */}
      {(selectedIssue || isViewAllOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#220e3f] border border-purple-500/40 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-pink-400" />
              <h3 className="text-sm font-bold">
                {selectedIssue ? selectedIssue.title : 'All Devices & Issue Diagnostics'}
              </h3>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {selectedIssue
                ? selectedIssue.answer
                : '14 Endpoint devices currently flag policy violations including unencrypted USB usage, shadow cloud uploads, and outdated security patches.'}
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setSelectedIssue(null);
                  setIsViewAllOpen(false);
                }}
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
