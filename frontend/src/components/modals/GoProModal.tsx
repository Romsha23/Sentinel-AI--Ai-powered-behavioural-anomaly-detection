'use client';

import React from 'react';
import { Crown, Check, X, Sparkles } from 'lucide-react';

interface GoProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoProModal: React.FC<GoProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#2d1252] via-[#220e3f] to-[#160829] border border-purple-400/40 p-7 space-y-6 text-white shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-purple-300 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/25 mb-1">
            <Crown className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Upgrade to SMARTNET Pro</h2>
          <p className="text-xs text-purple-200/70 max-w-md mx-auto">
            Stay connected with your team, automate endpoint security mitigation, and unlock real-time enterprise AI behavioral analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl bg-[#28114c]/90 border border-purple-500/30 p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Standard Plan</span>
            <div className="text-xl font-extrabold">Free</div>
            <ul className="text-xs text-purple-200/70 space-y-2">
              <li className="flex items-center space-x-2">
                <Check className="h-3.5 w-3.5 text-purple-400" />
                <span>Basic anomaly detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-3.5 w-3.5 text-purple-400" />
                <span>Max 50 endpoint devices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-3.5 w-3.5 text-purple-400" />
                <span>Manual policy configuration</span>
              </li>
            </ul>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-b from-[#3b176d] to-[#2a1052] border-2 border-pink-500 p-5 space-y-3 shadow-xl">
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-pink-500 text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full text-white shadow-md">
              Recommended
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">Pro Enterprise</span>
            <div className="text-2xl font-extrabold text-white">
              $49 <span className="text-xs text-purple-300 font-normal">/ month</span>
            </div>
            <ul className="text-xs text-purple-100 space-y-2">
              <li className="flex items-center space-x-2">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>Unlimited team members & devices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>Automated AI isolation & response</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>24/7 Priority SOC Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              alert('Pro Enterprise subscription activated!');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-sm shadow-xl hover:scale-[1.01] transition-all"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
