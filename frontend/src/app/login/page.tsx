'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Zap, Lock, TreePine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ParticleCanvas } from '@/components/common/ParticleCanvas';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sentinel.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('Authentication failed. Check credentials or try one-click demo sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDemo = () => {
    setEmail('admin@sentinel.ai');
    setPassword('admin123');
    login('admin@sentinel.ai', 'admin123');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#091224] text-slate-100 font-sans overflow-hidden selection:bg-sky-500 selection:text-white">
      {/* Constellation Node Canvas Background */}
      <ParticleCanvas />

      {/* Floating Status Badge 1: Top Left */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <span className="font-bold text-white">Autonomous SOC Engine</span>
        <span className="flex items-center space-x-1 text-sky-400 font-sans text-[11px]">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>100% Operational</span>
        </span>
      </div>

      {/* Floating Status Badge 2: Top Right */}
      <div className="absolute top-6 right-6 z-10 hidden sm:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <Zap className="h-4 w-4 text-sky-400" />
        <div>
          <div className="font-bold text-white leading-tight">Stream Ingestion</div>
          <div className="text-[10px] text-sky-200/80">1,420 Events/sec (0.8ms)</div>
        </div>
      </div>

      {/* Floating Status Badge 3: Bottom Left */}
      <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <div className="p-1.5 rounded-xl bg-blue-900/50 border border-sky-500/30 text-sky-300">
          <Lock className="h-4 w-4" />
        </div>
        <div>
          <div className="font-bold text-white leading-tight">AES-256 Encrypted</div>
          <div className="text-[10px] text-sky-300/70">SOC 2 Type II Certified</div>
        </div>
      </div>

      {/* Floating Status Badge 4: Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <div className="p-1.5 rounded-xl bg-blue-900/50 border border-sky-500/30 text-sky-400">
          <TreePine className="h-4 w-4" />
        </div>
        <div>
          <div className="font-bold text-white leading-tight">Isolation Forest</div>
          <div className="text-[10px] text-sky-300">5,000 Active Trees</div>
        </div>
      </div>

      {/* Main Login Card with Sentinel AI Branding */}
      <div className="relative z-20 w-full max-w-md mx-4 rounded-3xl bg-[#14243e]/90 border border-sky-500/40 p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-sky-700 text-white shadow-lg shadow-sky-500/30">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider text-white font-serif">
              Sentinel <span className="text-sky-400 font-sans text-xl">AI</span>
            </h1>
            <p className="text-[10px] tracking-widest text-sky-200/70 mt-1 uppercase font-mono">
              AUTONOMOUS BEHAVIORAL THREAT SOC
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-sky-950/80 border border-sky-500/40 p-3 text-xs text-sky-300">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5">
              Analyst Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sentinel.ai"
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-3 text-xs text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5">
              SOC Security Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-3 text-xs text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 text-white font-extrabold text-xs shadow-xl hover:shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to SOC Command Center'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* One-Click Demo Credentials Pill */}
        <div
          onClick={handleOneClickDemo}
          className="cursor-pointer rounded-2xl bg-[#1a3052]/90 border border-sky-500/30 hover:border-sky-400/60 p-3.5 space-y-1.5 transition-all group"
        >
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
              <Zap className="h-3.5 w-3.5" />
              <span>DEMO CREDENTIALS</span>
            </div>
            <div className="text-sky-200 font-bold group-hover:text-white group-hover:underline">
              One-Click Sign In
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-sky-300/70 pt-0.5 font-mono">
            <span>Email: <strong className="text-white">admin@sentinel.ai</strong></span>
            <span>Pass: <strong className="text-white">admin123</strong></span>
          </div>
        </div>

        <p className="text-center text-xs text-sky-300/70">
          Need SOC Access?{' '}
          <Link href="/register" className="text-sky-400 hover:underline font-bold">
            Register Analyst Profile
          </Link>
        </p>
      </div>
    </div>
  );
}
