'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, UserPlus, AlertCircle, Zap, Lock, TreePine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ParticleCanvas } from '@/components/common/ParticleCanvas';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password, role);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Username or email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#091224] text-slate-100 font-sans overflow-hidden selection:bg-sky-500 selection:text-white">
      <ParticleCanvas />

      {/* Floating Status Badges */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <span className="font-bold text-white">Autonomous SOC Engine</span>
        <span className="flex items-center space-x-1 text-sky-400 font-sans text-[11px]">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>100% Operational</span>
        </span>
      </div>

      <div className="absolute top-6 right-6 z-10 hidden sm:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#14243e]/80 border border-sky-500/30 backdrop-blur-xl shadow-xl text-xs">
        <Zap className="h-4 w-4 text-sky-400" />
        <div>
          <div className="font-bold text-white leading-tight">Stream Ingestion</div>
          <div className="text-[10px] text-sky-200/80">1,420 Events/sec (0.8ms)</div>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-md mx-4 rounded-3xl bg-[#14243e]/90 border border-sky-500/40 p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-sky-700 text-white shadow-lg shadow-sky-500/30">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white font-serif">
            Sentinel <span className="text-sky-400 font-sans text-xl">AI</span>
          </h1>
          <p className="text-xs text-sky-200/70">Create Analyst Credentials for Sentinel AI SOC</p>
        </div>

        {error && (
          <div className="rounded-xl bg-sky-950/80 border border-sky-500/40 p-3 text-xs text-sky-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5 font-sans">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. analyst_john"
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-2.5 text-xs text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5 font-sans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="analyst@sentinel.ai"
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-2.5 text-xs text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5 font-sans">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-2.5 text-xs text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5 font-sans">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl bg-[#1a3052] border border-sky-500/30 px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
            >
              <option value="Security Analyst">Security Analyst</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 text-white font-extrabold text-xs shadow-xl hover:shadow-sky-500/25 transition-all font-sans"
          >
            <UserPlus className="h-4 w-4" />
            <span>{loading ? 'Creating account...' : 'Register Profile'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-sky-300/70 font-sans">
          Already registered?{' '}
          <Link href="/login" className="text-sky-400 hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
