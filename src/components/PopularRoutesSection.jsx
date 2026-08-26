import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Bus, ArrowRight, Clock, MapPin } from 'lucide-react';

export default function PopularRoutesSection() {
  const { language, handleQuickBookRoute } = useBooking();

  const routes = [
    {
      fromId: 'blr',
      toId: 'mys',
      fromName: 'Bengaluru',
      toName: 'Mysuru',
      fromKn: 'ಬೆಂಗಳೂರು',
      toKn: 'ಮೈಸೂರು',
      busesCount: '48 Daily Buses',
      duration: '3h 15m',
      startingPrice: 350,
      badge: 'Most Popular'
    },
    {
      fromId: 'blr',
      toId: 'mng',
      fromName: 'Bengaluru',
      toName: 'Mangaluru',
      fromKn: 'ಬೆಂಗಳೂರು',
      toKn: 'ಮಂಗಳೂರು',
      busesCount: '32 Daily Buses',
      duration: '6h 45m',
      startingPrice: 650,
      badge: 'Coastal Express'
    },
    {
      fromId: 'blr',
      toId: 'smg',
      fromName: 'Bengaluru',
      toName: 'Shivamogga',
      fromKn: 'ಬೆಂಗಳೂರು',
      toKn: 'ಶಿವಮೊಗ್ಗ',
      busesCount: '24 Daily Buses',
      duration: '5h 30m',
      startingPrice: 550,
      badge: 'Malenadu Superfast'
    },
    {
      fromId: 'blr',
      toId: 'mdk',
      fromName: 'Bengaluru',
      toName: 'Madikeri (Coorg)',
      fromKn: 'ಬೆಂಗಳೂರು',
      toKn: 'ಮಡಿಕೇರಿ (ಕೊಡಗು)',
      busesCount: '18 Daily Buses',
      duration: '5h 45m',
      startingPrice: 600,
      badge: 'Hill Station Sleeper'
    },
    {
      fromId: 'hub',
      toId: 'bel',
      fromName: 'Hubballi',
      toName: 'Belagavi',
      fromKn: 'ಹುಬ್ಬಳ್ಳಿ',
      toKn: 'ಬೆಳಗಾವಿ',
      busesCount: '28 Daily Buses',
      duration: '2h 15m',
      startingPrice: 320,
      badge: 'North Karnataka Line'
    },
    {
      fromId: 'blr',
      toId: 'gkr',
      fromName: 'Bengaluru',
      toName: 'Gokarna',
      fromKn: 'ಬೆಂಗಳೂರು',
      toKn: 'ಗೋಕರ್ಣ',
      busesCount: '14 Daily Buses',
      duration: '8h 30m',
      startingPrice: 850,
      badge: 'Beach Special'
    }
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>MALENADU TRAVELS TOP BUS ROUTES</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {language === 'kn' ? 'ಪ್ರಮುಖ ಬಸ್ ಮಾರ್ಗಗಳು & ನಿಯಮಿತ ಸೇವೆಗಳು' : 'Popular Bus Routes Across Karnataka'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold max-w-md">
            Instant online booking for AC Sleeper, Non-AC Sleeper, and Executive coaches running daily.
          </p>
        </div>

        {/* Grid of Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((rt, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Badge & Fare Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase">
                    {rt.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Starts From</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{rt.startingPrice}</span>
                  </div>
                </div>

                {/* Route Name */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#0B4F37] dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {language === 'kn' ? rt.fromKn : rt.fromName} → {language === 'kn' ? rt.toKn : rt.toName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-3 mt-0.5">
                      <span>{rt.busesCount}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{rt.duration}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Book Action Button */}
              <button
                onClick={() => handleQuickBookRoute(rt.fromId, rt.toId)}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#047857] hover:opacity-95 text-amber-300 font-black text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center space-x-2 transition-all cursor-pointer group-hover:scale-[1.02] uppercase tracking-wider"
              >
                <span>{language === 'kn' ? 'ಬಸ್ ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ' : 'Book Bus Ticket'}</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

