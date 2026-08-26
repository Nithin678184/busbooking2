import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Activity, ShieldCheck, Gauge } from 'lucide-react';

export default function LiveTracking() {
  const { t, activeTicket, userBookings } = useBooking();
  const ticket = activeTicket || userBookings[0];

  const [progress, setProgress] = useState(45); // 0 to 100%
  const [speed, setSpeed] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 10 : prev + 2));
      setSpeed(Math.floor(62 + Math.random() * 15));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl mb-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Live GPS Telemetry Connected</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {t.tracking.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            Bus: <span className="font-black text-blue-600 dark:text-blue-400">{ticket?.busName || 'KSRTC Ambaari Utsav'}</span> ({ticket?.busNo || 'KA-01-F-9988'})
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700">
          <div className="text-center">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase block">Speed</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Gauge className="w-4 h-4" />
              <span>{speed} km/h</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="text-center">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase block">ETA</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              1h 45m
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Simulation Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Interactive SVG Karnataka Highway Route Visualizer */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          {/* Highway Path SVG */}
          <svg className="w-full h-full p-8" viewBox="0 0 600 200">
            <path
              d="M 50 100 Q 200 30, 350 120 T 550 80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 50 100 Q 200 30, 350 120 T 550 80"
              fill="none"
              stroke="#00C896"
              strokeWidth="4"
              strokeDasharray="8 8"
              className="animate-pulse"
            />

            {/* Start Node */}
            <circle cx="50" cy="100" r="10" fill="#0F4C81" />
            <text x="50" y="130" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">
              {ticket?.from?.split(' ')[0] || 'Bengaluru'}
            </text>

            {/* Halt Node */}
            <circle cx="350" cy="120" r="8" fill="#2196F3" />
            <text x="350" y="150" fill="#94a3b8" fontSize="10" textAnchor="middle">
              Hassan Bypass
            </text>

            {/* End Node */}
            <circle cx="550" cy="80" r="10" fill="#00C896" />
            <text x="550" y="110" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">
              {ticket?.to?.split(' ')[0] || 'Mangaluru'}
            </text>

            {/* Moving Bus Marker */}
            <g transform={`translate(${50 + (progress / 100) * 480}, ${100 - Math.sin((progress / 100) * Math.PI) * 40})`}>
              <circle r="16" fill="#00C896" opacity="0.3" className="animate-ping" />
              <circle r="12" fill="#00C896" />
              <text x="0" y="4" fill="#ffffff" fontSize="10" textAnchor="middle">🚌</text>
            </g>
          </svg>

          {/* Overlay Status Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-emerald-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>On Time • NH-75 Highway</span>
          </div>

        </div>

        {/* Route Progress Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase mb-1">{t.tracking.currentStop}</p>
            <p className="font-black text-slate-900 dark:text-slate-100 text-sm">Hassan Toll Plaza</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold mt-1">Departed 5 mins ago</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase mb-1">{t.tracking.nextStop}</p>
            <p className="font-black text-slate-900 dark:text-slate-100 text-sm">Sakleshpur Bus Depot</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 font-extrabold mt-1">ETA in 28 mins</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase mb-1">{t.tracking.traffic}</p>
            <p className="font-black text-emerald-700 dark:text-emerald-400 text-sm flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.tracking.smooth}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">Optimal 65-75 km/h cruise</p>
          </div>
        </div>

      </div>

    </div>
  );
}
