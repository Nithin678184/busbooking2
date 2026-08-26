import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Star, Activity, ChevronDown, ChevronUp, MapPin, CheckCircle2 } from 'lucide-react';

export default function BusCard({ bus }) {
  const { t, setSelectedBus, setCurrentView } = useBooking();
  const [showDetails, setShowDetails] = useState(false);

  const handleSelectBus = () => {
    setSelectedBus(bus);
    setCurrentView('seat-selection');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-4 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      
      {/* Top Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-xl shadow-inner border border-blue-500/20">
            {bus.operatorLogo}
          </span>
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>{bus.operatorName}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border border-slate-300 dark:border-slate-700">
                {bus.busNumber}
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {bus.busType}
            </p>
          </div>
        </div>

        {/* Rating & Live GPS Badges */}
        <div className="flex items-center space-x-2">
          {bus.isEv && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-black flex items-center space-x-1">
              <span>⚡ Electric</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-[#00C896] border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.busCard.liveTracking}</span>
          </span>
          <div className="flex items-center space-x-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 text-xs font-black text-amber-700 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{bus.rating}</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">({bus.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Main Bus Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Departure, Duration, Arrival */}
        <div className="md:col-span-7 flex items-center justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {bus.departureTime}
            </p>
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              {bus.boardingPoints[0]?.name.split(' ')[0]}
            </p>
          </div>

          <div className="flex-1 px-4 text-center">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 block mb-1">
              {bus.duration}
            </span>
            <div className="relative flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] rounded-full" />
              <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 absolute left-0" />
              <div className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 absolute right-0" />
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider block mt-1">
              Direct Highway Route
            </span>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {bus.arrivalTime}
            </p>
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              {bus.droppingPoints[0]?.name.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="md:col-span-5 flex items-center justify-between md:justify-end md:space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 line-through font-semibold">₹{bus.originalPrice}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                SAVE ₹{bus.originalPrice - bus.price}
              </span>
            </div>
            <p className="text-2xl font-black text-[#0F4C81] dark:text-blue-400">
              ₹{bus.price}
            </p>
            <p className="text-[11px] font-black text-amber-700 dark:text-amber-400">
              {bus.seatsLeft} {t.busCard.seatsLeft}
            </p>
          </div>

          <button
            onClick={handleSelectBus}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
          >
            {t.busCard.bookNow}
          </button>
        </div>

      </div>

      {/* Amenities & Details Drawer Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {bus.amenities.map((item, i) => (
            <span key={i} className="flex items-center space-x-1 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-extrabold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{item}</span>
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 font-black text-blue-700 dark:text-blue-400 hover:underline shrink-0 ml-2"
        >
          <span>Boarding & Dropping Points</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Boarding & Dropping Details Drawer */}
      {showDetails && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <p className="font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Boarding Points ({bus.boardingPoints.length})</span>
            </p>
            <ul className="space-y-1.5">
              {bus.boardingPoints.map((bp, i) => (
                <li key={i} className="flex justify-between text-slate-800 dark:text-slate-200 font-semibold">
                  <span>{bp.name}</span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-400">{bp.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dropping Points ({bus.droppingPoints.length})</span>
            </p>
            <ul className="space-y-1.5">
              {bus.droppingPoints.map((dp, i) => (
                <li key={i} className="flex justify-between text-slate-800 dark:text-slate-200 font-semibold">
                  <span>{dp.name}</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{dp.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
