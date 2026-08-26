import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Lock, X, AlertCircle, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminSecretModal({ isOpen, onClose }) {
  const { loginAdmin } = useBooking();
  const [adminCode, setAdminCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAdminCode(digitsOnly);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (adminCode === '2525252525') {
      setSuccessMsg('Secret Code Verified! Accessing Fleet Management Portal...');
      setTimeout(() => {
        loginAdmin('Malenadu Fleet Admin', 'admin@malenadutravels.com');
        setAdminCode('');
        setSuccessMsg('');
        onClose();
      }, 500);
    } else {
      setErrorMsg('Invalid Secret Number. Please enter the correct passcode.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl max-w-md w-full border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20 p-6 sm:p-7 relative overflow-hidden my-auto max-h-[90vh] text-white animate-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/40">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white leading-tight flex items-center gap-1.5">
                Secret Admin Portal
              </h3>
              <p className="text-[11px] font-extrabold text-emerald-400">
                Restricted Access
              </p>
            </div>
          </div>

          <button
            onClick={() => { setErrorMsg(''); setAdminCode(''); onClose(); }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Note */}
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-xs font-bold text-emerald-200 leading-relaxed flex items-start space-x-2.5">
          <KeyRound className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span>Enter the secret admin passcode number to unlock Fleet Management Dashboard.</span>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-black flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Secret Number Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
              Admin Secret Number
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
              <input
                type="password"
                inputMode="numeric"
                value={adminCode}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="Enter number"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-sm font-black tracking-widest text-emerald-400 outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-semibold"
                autoFocus
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Unlock Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
