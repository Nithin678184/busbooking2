import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { getBusesForRoute, calculateBusSeatDetails, formatJourneyDate, calculateDuration } from '../data/busRoutesData';
import { 
  Bus, ArrowUpDown, Star, ChevronRight, Calendar, Sparkles, MapPin, CheckCircle2, ShieldCheck, Filter
} from 'lucide-react';
import SeatSelector from './SeatSelector';

export default function BusSearchResults() {
  const { 
    language, t, searchQuery, customAdminBuses, setSelectedBus, 
    setSelectedSeats, setCurrentView, userBookings, currentUser, openAuthModal, effectiveDevice 
  } = useBooking();
  
  // Filters & Active Bus selection for Master-Detail (Tablet Mode)
  const [filterType, setFilterType] = useState('all'); 
  const [sortBy, setSortBy] = useState('price-low');   
  const [activeTabletBus, setActiveTabletBus] = useState(null);

  const availableBuses = getBusesForRoute(searchQuery.from, searchQuery.to, searchQuery.journeyDate, customAdminBuses);

  const filteredBuses = availableBuses.filter(bus => {
    if (filterType === 'ac') return bus.isAc;
    if (filterType === 'sleeper') return bus.isSleeper;
    if (filterType === 'seater') return !bus.isSleeper;
    return true;
  });

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Set default active tablet bus if none selected
  React.useEffect(() => {
    if (sortedBuses.length > 0 && !activeTabletBus) {
      setActiveTabletBus(sortedBuses[0]);
    }
  }, [sortedBuses, activeTabletBus]);

  const handleSelectSeats = (bus) => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal('login');
      return;
    }
    setSelectedBus(bus);
    setSelectedSeats([]);
    setCurrentView('seat-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fromDisplayName = language === 'kn' ? (searchQuery.from?.nameKn || searchQuery.from?.name) : searchQuery.from?.name;
  const toDisplayName = language === 'kn' ? (searchQuery.to?.nameKn || searchQuery.to?.name) : searchQuery.to?.name;

  const isMobile = effectiveDevice === 'mobile';
  const isTablet = effectiveDevice === 'tablet';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-[#0F4C81] via-[#1A5488] to-[#0D3B66] text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-300 uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4 text-emerald-400" />
            <span>{t.results.title}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black flex items-center space-x-2 sm:space-x-3">
            <span>{fromDisplayName}</span>
            <span className="text-emerald-400">➔</span>
            <span>{toDisplayName}</span>
          </h1>
          <p className="text-xs text-amber-300 font-black mt-1 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              {formatJourneyDate(searchQuery.journeyDate)}
            </span>
            <span>• {sortedBuses.length} {language === 'kn' ? 'ಬಸ್‌ಗಳು' : 'Buses Found'}</span>
          </p>
        </div>

        <button 
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-black text-white transition-all cursor-pointer shrink-0"
        >
          {t.results.modifySearch}
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-[#0F4C81] to-[#2196F3] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All ({availableBuses.length})
          </button>

          <button
            onClick={() => setFilterType('ac')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              filterType === 'ac'
                ? 'bg-gradient-to-r from-[#0F4C81] to-[#2196F3] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            AC Sleeper
          </button>

          <button
            onClick={() => setFilterType('sleeper')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              filterType === 'sleeper'
                ? 'bg-gradient-to-r from-[#0F4C81] to-[#2196F3] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Non-AC
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="departure">Departure Time</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

      </div>

      {/* TABLET MASTER-DETAIL SPLIT VIEW (When effectiveDevice === 'tablet') */}
      {isTablet && sortedBuses.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          
          {/* Master Panel (Left 40% Width) */}
          <div className="col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Available Buses ({sortedBuses.length})</h3>
            {sortedBuses.map((bus) => {
              const seatsInfo = calculateBusSeatDetails(bus, userBookings);
              const isSelected = activeTabletBus?.id === bus.id;
              return (
                <div
                  key={bus.id}
                  onClick={() => setActiveTabletBus(bus)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{bus.operatorLogo}</span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                      ★ {bus.rating}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">{bus.operatorName}</h4>
                  <p className="text-[11px] font-bold text-slate-500">{bus.busType}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{bus.departureTime}</span>
                      <span className="text-[10px] text-slate-400 mx-1">➔</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{bus.arrivalTime}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{bus.price}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Preview Panel (Right 70% Width) */}
          <div className="col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-5 sticky top-24">
            {activeTabletBus ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{activeTabletBus.operatorLogo}</span>
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white">{activeTabletBus.operatorName}</h3>
                      <p className="text-xs font-bold text-slate-500">{activeTabletBus.busType} • {activeTabletBus.busNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{activeTabletBus.price}</span>
                    <p className="text-[10px] font-bold text-amber-500">Includes all taxes</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{activeTabletBus.departureTime}</p>
                    <p className="text-xs font-bold text-slate-500">{fromDisplayName}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400">{calculateDuration(activeTabletBus.departureTime, activeTabletBus.arrivalTime)}</span>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full my-1" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase">Direct Bus</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{activeTabletBus.arrivalTime}</p>
                    <p className="text-xs font-bold text-slate-500">{toDisplayName}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Included Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeTabletBus.amenities.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => handleSelectSeats(activeTabletBus)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#D48B16] text-amber-300 font-black text-base shadow-xl flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider border-2 border-amber-400"
                  >
                    <span>Select Seats & Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold">Select a bus on the left to inspect details</div>
            )}
          </div>

        </div>
      ) : sortedBuses.length > 0 ? (
        /* STANDARD MOBILE & DESKTOP BUS CARDS LIST */
        <div className="space-y-4 sm:space-y-6">
          {sortedBuses.map((bus) => {
            const seatsInfo = calculateBusSeatDetails(bus, userBookings);
            return (
              <div
                key={bus.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden hover:border-emerald-500/50 transition-all p-4 sm:p-6"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{bus.operatorLogo}</span>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{bus.operatorName}</span>
                      </h3>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {bus.busType} • {bus.busNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-xs font-black text-amber-700 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{bus.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Timing & Fare */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  <div className="sm:col-span-8 flex items-center justify-between">
                    <div>
                      <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{bus.departureTime}</p>
                      <p className="text-xs font-bold text-slate-500 truncate max-w-[100px]">{fromDisplayName}</p>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <p className="text-[10px] font-bold text-slate-400">{calculateDuration(bus.departureTime, bus.arrivalTime)}</p>
                      <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 my-1" />
                      <span className="text-[9px] font-black text-emerald-600">Direct</span>
                    </div>

                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{bus.arrivalTime}</p>
                      <p className="text-xs font-bold text-slate-500 truncate max-w-[100px]">{toDisplayName}</p>
                    </div>
                  </div>

                  {/* Price CTA */}
                  <div className="sm:col-span-4 flex items-center justify-between sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4 gap-3">
                    <div>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">₹{bus.price}</span>
                      <p className="text-[10px] font-black text-emerald-600">
                        {seatsInfo.availableCount} Seats Available
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectSeats(bus)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#D48B16] text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{t.results.selectSeats}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Amenities */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {bus.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 max-w-lg mx-auto space-y-4">
          <Bus className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{t.results.noBuses}</h3>
          <p className="text-xs text-slate-500 font-semibold">{t.results.addBusHint}</p>
        </div>
      )}

    </div>
  );
}
