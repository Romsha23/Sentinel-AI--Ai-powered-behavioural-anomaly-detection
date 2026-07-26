'use client';

import React, { useState } from 'react';
import { Shield, Plus, X, CheckCircle } from 'lucide-react';

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ isOpen, onClose }) => {
  const [policyName, setPolicyName] = useState('');
  const [category, setCategory] = useState('Data Security');
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [action, setAction] = useState('Alert & Quarantine');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#220e3f] border border-purple-500/40 p-6 space-y-5 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-purple-300 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Add Security Policy</h3>
            <p className="text-xs text-purple-200/70">Create custom behavioral anomaly detection rules</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-pink-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Policy Created Successfully!</h4>
            <p className="text-xs text-purple-200/80">Policy rules have been deployed to the live AI engine.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">Policy Name</label>
              <input
                type="text"
                required
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="e.g., Block High Volume USB Exfiltration"
                className="w-full rounded-xl bg-[#2b134d] border border-purple-500/30 px-4 py-2.5 text-xs text-white placeholder-purple-300/40 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#2b134d] border border-purple-500/30 px-3 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="Data Security">Data Security</option>
                  <option value="Shadow IT">Shadow IT</option>
                  <option value="User Behaviour">User Behaviour</option>
                  <option value="Device Compliance">Device Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">Automated Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full rounded-xl bg-[#2b134d] border border-purple-500/30 px-3 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="Alert & Quarantine">Alert & Quarantine</option>
                  <option value="Log & Notify SOC">Log & Notify SOC</option>
                  <option value="Require MFA Challenge">Require MFA Challenge</option>
                  <option value="Terminate Session">Terminate Session</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-purple-200 mb-1.5">
                <span>Anomaly Risk Threshold Score</span>
                <span className="text-pink-400 font-mono font-bold">{riskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-pink-500 bg-purple-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-purple-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-lg hover:shadow-pink-500/25 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Save Policy</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
