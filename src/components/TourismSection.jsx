import React from 'react';
import { useBooking } from '../context/BookingContext';
import { karnatakaTourismData } from '../data/tourismData';
import { Compass, Star, Bus, ArrowRight } from 'lucide-react';

export default function TourismSection() {
  const { language, t, handleQuickBookRoute } = useBooking();

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-12 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'kn' ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪ್ರವಾಸೋದ್ಯಮ' : 'Malenadu Karnataka Tourism Packages'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
            {t.tourism.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-semibold leading-relaxed">
            {t.tourism.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {karnatakaTourismData.map((spot) => (
            <div
              key={spot.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Image Box */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-xs font-black text-amber-400 flex items-center space-x-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{spot.rating}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                    {spot.district} {language === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {language === 'kn' ? spot.nameKn : spot.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold italic mb-3">
                    "{language === 'kn' ? (spot.taglineKn || spot.tagline) : spot.tagline}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(language === 'kn' ? (spot.highlightsKn || spot.highlights) : spot.highlights).map((h, i) => (
                      <span key={i} className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book Bus Button */}
                <button
                  onClick={() => handleQuickBookRoute('blr', spot.busDestinationId)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#047857] hover:opacity-95 text-amber-300 font-black text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center space-x-2 transition-all cursor-pointer group-hover:scale-[1.02] uppercase tracking-wider"
                >
                  <Bus className="w-4 h-4 text-amber-300" />
                  <span>{t.tourism.bookBus}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-amber-300" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

