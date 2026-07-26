'use client';

import React, { useState } from 'react';
import { User, Mail, Shield, Lock, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export function UserProfilePanel() {
  const { user, refreshProfile } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await apiClient.put(API_ENDPOINTS.updateProfile, { email });
      await refreshProfile();
      setMessage('Profile updated successfully');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await apiClient.put(API_ENDPOINTS.updatePassword, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password changed successfully');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/40">
            <User className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">User Profile</h2>
            <p className="text-xs text-slate-400">Manage your account settings</p>
          </div>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-800 px-4 py-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-rose-950/50 border border-rose-800 px-4 py-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <User className="h-3.5 w-3.5" /> Username
            </label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <Shield className="h-3.5 w-3.5" /> Role
            </label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {user.created_at && (
          <p className="text-xs text-slate-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
        )}

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-400" />
          Change Password
        </h3>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-none"
          />
        </div>
        <button
          onClick={handleChangePassword}
          disabled={saving || !currentPassword || !newPassword}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
