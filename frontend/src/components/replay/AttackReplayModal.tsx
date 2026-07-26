'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, ShieldAlert, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface ReplayStep {
  step: number;
  timestamp: string;
  title: string;
  entity_id: string;
  action: string;
  resource: string;
  risk_score: number;
  priority: string;
  color: string;
  reasons: string[];
  recommendations: string[];
}

interface AttackReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttackReplayModal: React.FC<AttackReplayModalProps> = ({ isOpen, onClose }) => {
  const [steps, setSteps] = useState<ReplayStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    apiClient
      .get(API_ENDPOINTS.replay)
      .then((res) => {
        setSteps(res.data);
      })
      .catch((err) => {
        console.error('Failed to load replay scenario steps:', err);
      });
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps]);

  if (!isOpen || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700 p-6 space-y-6 cyber-glow-blue">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 p-2 text-amber-400">
              <Play className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">REPLAY ATTACK SIMULATOR</h2>
              <p className="text-xs text-slate-400">Step-by-step SOC incident playback & 5-Factor Risk Score evolution</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            ✕
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between px-2">
          {steps.map((st, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  idx === currentStepIndex
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 scale-110'
                    : idx < currentStepIndex
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {st.step}
              </div>
              <span className="mt-1 text-[10px] text-slate-400 font-mono hidden sm:inline">{st.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Active Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-slate-400">{currentStep.timestamp} • Step {currentStep.step} of {steps.length}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentStep.title}</h3>
                <p className="text-xs font-mono text-blue-400 mt-0.5">Target Entity: {currentStep.entity_id}</p>
              </div>

              {/* Score Gauge */}
              <div className="text-right">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-rose-400">
                  {currentStep.risk_score} <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <span
                  className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{ backgroundColor: `${currentStep.color}30`, color: currentStep.color, border: `1px solid ${currentStep.color}60` }}
                >
                  {currentStep.priority} Risk
                </span>
              </div>
            </div>

            {/* Event Description */}
            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-900 text-xs text-slate-200">
              <span className="font-semibold text-slate-400">Recorded Action: </span>
              {currentStep.action}
            </div>

            {/* Reasons & Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-rose-950/20 p-3 border border-rose-900/30 space-y-1">
                <p className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Detection Trigger Reasons:</span>
                </p>
                <ul className="space-y-1 text-slate-300">
                  {currentStep.reasons.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-900/30 space-y-1">
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>AI Mitigation Action:</span>
                </p>
                <ul className="space-y-1 text-slate-300">
                  {currentStep.recommendations.map((rec, i) => (
                    <li key={i}>✓ {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Scenario'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700"
            >
              <span>Next Step</span>
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
