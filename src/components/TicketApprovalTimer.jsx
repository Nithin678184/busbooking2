import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ShieldCheck, Zap, XCircle } from 'lucide-react';

export default function TicketApprovalTimer({ autoApproveAt, status, className = "" }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!autoApproveAt || (status !== 'Pending Admin Approval' && status !== 'Pending Approval')) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, autoApproveAt - Date.now());
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [autoApproveAt, status]);

  if (status === 'Confirmed (Admin Approved)' || status === 'Confirmed') {
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Confirmed (Admin Approved)</span>
      </span>
    );
  }

  if (status === 'Confirmed (Auto-Approved)') {
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800 ${className}`}>
        <Zap className="w-3.5 h-3.5 text-teal-500 fill-teal-400" />
        <span>Confirmed (Auto-Approved ⚡)</span>
      </span>
    );
  }

  if (status === 'Cancelled by Admin' || status === 'Cancelled') {
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-red-500" />
        <span>Rejected / Cancelled by Admin</span>
      </span>
    );
  }

  // Pending Admin Approval state
  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-2 border-amber-400/60 shadow-sm animate-pulse ${className}`}>
      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        Pending Admin Approval • Auto-Approves in: <strong className="font-mono text-xs font-black text-amber-950 dark:text-amber-100 bg-amber-200 dark:bg-amber-900/90 px-1.5 py-0.5 rounded">{formattedMinutes}m {formattedSeconds}s</strong>
      </span>
    </div>
  );
}
