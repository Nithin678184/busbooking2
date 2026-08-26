import React from 'react';
import { useBooking } from '../context/BookingContext';
import BookingSearchCard from './BookingSearchCard';
import { ShieldCheck, Bus } from 'lucide-react';

export default function HeroSection() {
  const { language, t } = useBooking();

  return (
    <section className="relative overflow-hidden py-12 lg:py-16 bg-gradient-to-r from-[#0B4F37] via-[#0F4C81] to-[#0A192F] dark:from-[#05261A] dark:via-[#0B4F37] dark:to-[#05101A] text-white transition-colors duration-300 shadow-2xl">
      
      {/* Ambient Radial Lights in Emerald Green and Gold */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,79,55,0.45),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,139,22,0.3),transparent_50%)] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Malenadu Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          
          {/* Left Column: Headline, Tagline & Stats */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
            
            {/* Malenadu Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-600/30 backdrop-blur-md border border-amber-400/50 text-[10px] sm:text-xs font-black text-amber-300 shadow-lg max-w-full">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="truncate">MALENADU TRAVELS – SAFE & COMFORTABLE JOURNEY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-display">
              {language === 'kn' ? (
                <span>
                  ಕರ್ನಾಟಕದ ಅಧಿಕೃತ{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    ಮಲೆನಾಡು ಬಸ್ ಸೇವೆ
                  </span>
                </span>
              ) : (
                <span>
                  Get Set To Travel With{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    Malenadu Travels
                  </span>
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-slate-100 font-semibold leading-relaxed max-w-xl">
              Confirm your seat in minutes — safe, smooth, and stress-free bus booking across all 31 districts of Karnataka and neighboring states.
            </p>

            {/* Malenadu Style Stats Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
              <div className="bg-white/10 dark:bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
                <p className="text-lg sm:text-xl font-black text-amber-300">500+</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider">Luxury Fleet</p>
              </div>
              <div className="bg-white/10 dark:bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
                <p className="text-lg sm:text-xl font-black text-amber-300">31</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider">Districts</p>
              </div>
              <div className="bg-white/10 dark:bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
                <p className="text-lg sm:text-xl font-black text-amber-300">100%</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider">Punctual</p>
              </div>
              <div className="bg-white/10 dark:bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
                <p className="text-lg sm:text-xl font-black text-amber-300">4.9 ★</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-200 uppercase tracking-wider">Customer Rating</p>
              </div>
            </div>

          </div>

          {/* Right Column: Luxury Volvo Bus Showcase */}
          <div className="lg:col-span-6 relative flex justify-end">
            <div className="relative w-full max-w-2xl group">
              
              {/* Bus Shadow Accent */}
              <div className="absolute -bottom-4 right-0 w-full h-8 bg-black/50 rounded-full blur-xl transform scale-x-105" />

              {/* Real Volvo Bus Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-slate-950 transform group-hover:scale-[1.01] transition-transform duration-500">
                <img
                  src="/malenadu_user_bus.jpg"
                  alt="Malenadu Travels Bus"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>
          </div>

        </div>

        {/* Embedded Malenadu Booking Search Widget */}
        <div className="mt-6">
          <BookingSearchCard />
        </div>

      </div>
    </section>
  );
}

