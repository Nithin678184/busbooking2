import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Smartphone, Tablet, Monitor, Zap } from 'lucide-react';

export default function DeviceModeBar() {
  const { deviceMode, setDeviceMode, effectiveDevice, screenDevice } = useBooking();

  const modes = [
    { id: 'auto', label: 'Auto Detect', icon: Zap, badge: screenDevice.toUpperCase() },
    { id: 'mobile', label: 'Mobile UI', icon: Smartphone, badge: '📱 Phone' },
    { id: 'tablet', label: 'Tablet UI', icon: Tablet, badge: '🍿 Pad' },
    { id: 'desktop', label: 'Desktop UI', icon: Monitor, badge: '🖥️ Wide' },
  ];

  return (
    <div className="bg-slate-900 border-b border-amber-400/40 text-white text-xs py-1.5 px-3 z-[60] relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Indicator */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
            UI Mode Preview
          </span>
          <span className="text-slate-300 font-semibold hidden sm:inline text-[11px]">
            Active Experience: <strong className="text-amber-300 capitalize">{effectiveDevice} Interface</strong> {deviceMode === 'auto' && `(Auto: ${screenDevice})`}
          </span>
        </div>

        {/* Device Mode Switcher Buttons */}
        <div className="flex items-center space-x-1.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = deviceMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setDeviceMode(m.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-black transition-all text-[11px] cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
                title={`Switch layout to ${m.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-300'}`} />
                <span className="hidden xs:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
