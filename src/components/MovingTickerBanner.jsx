import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Bus, Sparkles, Navigation, ShieldCheck, MapPin } from 'lucide-react';

export default function MovingTickerBanner() {
  const { language } = useBooking();

  const titleItemsEn = [
    { icon: Sparkles, text: "Malenadu Travels – Connecting Every Corner of Karnataka" },
    { icon: Bus, text: "Luxury Volvo Multi-Axle, Airavat & AC Sleeper Express Buses" },
    { icon: MapPin, text: "Daily Express Routes: Bengaluru • Mysuru • Mangaluru • Shivamogga • Madikeri • Hubballi • Belagavi" },
    { icon: ShieldCheck, text: "24x7 Live GPS Telemetry & Instant Verified E-Tickets" },
    { icon: Navigation, text: "Safe, Comfortable & On-Time Journey Across All 31 Districts" },
  ];

  const titleItemsKn = [
    { icon: Sparkles, text: "ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ – ಕರ್ನಾಟಕದ ಪ್ರತಿ ಮೂಲೆಯನ್ನೂ ಸಂಪರ್ಕಿಸುತ್ತದೆ" },
    { icon: Bus, text: "ಐಷಾರಾಮಿ ವೋಲ್ವೋ ಮಲ್ಟಿ-ಆಕ್ಸಲ್ ಮತ್ತು ಸ್ಲೀಪರ್ ಕೋಚ್ ಬಸ್‌ಗಳು" },
    { icon: MapPin, text: "ದೈನಂದಿನ ಮಾರ್ಗಗಳು: ಬೆಂಗಳೂರು • ಮೈಸೂರು • ಮಂಗಳೂರು • ಶಿವಮೊಗ್ಗ • ಮಡಿಕೇರಿ • ಹುಬ್ಬಳ್ಳಿ" },
    { icon: ShieldCheck, text: "೨೪x೭ ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ತತ್ಕ್ಷಣದ ಇ-ಟಿಕೆಟ್" },
    { icon: Navigation, text: "೩೧ ಜಿಲ್ಲೆಗಳಾದ್ಯಂತ ಸುರಕ್ಷಿತ ಮತ್ತು ಸುಖಕರ ಪ್ರಯಾಣ" },
  ];

  const titleItems = language === 'kn' ? titleItemsKn : titleItemsEn;

  return (
    <div className="bg-gradient-to-r from-[#021810] via-[#0B4F37] to-[#05291C] text-white border-b border-emerald-500/30 shadow-md relative overflow-hidden py-2 px-3 z-40 print:hidden">
      
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#D48B16_15%,transparent_60%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Left Live Indicator Badge */}
        <div className="flex items-center space-x-2 shrink-0 bg-amber-500/20 dark:bg-amber-950/80 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-black text-amber-300 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="tracking-wider uppercase text-[11px]">
            {language === 'kn' ? 'ಲೈವ್ ಸುದ್ದಿ' : 'LIVE UPDATES'}
          </span>
        </div>

        {/* Center Moving Title Marquee */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="animate-marquee flex items-center space-x-12 whitespace-nowrap text-xs font-extrabold tracking-wide text-slate-100">
            {/* Duplicated list for continuous seamless infinite loop */}
            {[...titleItems, ...titleItems].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center space-x-2.5 py-0.5 hover:text-emerald-300 transition-colors">
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
