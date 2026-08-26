import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { karnatakaLocations, searchLocations } from '../data/karnatakaLocations';
import { malenaduFleetCategories } from '../data/busRoutesData';
import { MapPin, Calendar, Users, Bus, ArrowRightLeft, Search } from 'lucide-react';

export default function BookingSearchCard() {
  const { language, t, searchQuery, setSearchQuery, setCurrentView, effectiveDevice } = useBooking();
  
  const [fromInput, setFromInput] = useState(searchQuery.from?.name || '');
  const [toInput, setToInput] = useState(searchQuery.to?.name || '');
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromContainerRef = useRef(null);
  const toContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromContainerRef.current && !fromContainerRef.current.contains(e.target)) {
        setShowFromDropdown(false);
      }
      if (toContainerRef.current && !toContainerRef.current.contains(e.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getRelativeDateStr = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (searchQuery.from) {
      setFromInput(language === 'kn' ? (searchQuery.from.nameKn || searchQuery.from.name) : searchQuery.from.name);
    }
    if (searchQuery.to) {
      setToInput(language === 'kn' ? (searchQuery.to.nameKn || searchQuery.to.name) : searchQuery.to.name);
    }
  }, [language, searchQuery.from, searchQuery.to]);

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromInput(val);
    if (val.trim().length >= 1) {
      setFromSuggestions(searchLocations(val, 15));
      setShowFromDropdown(true);
    } else {
      setShowFromDropdown(false);
    }
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToInput(val);
    if (val.trim().length >= 1) {
      setToSuggestions(searchLocations(val, 15));
      setShowToDropdown(true);
    } else {
      setShowToDropdown(false);
    }
  };

  const selectFromLocation = (loc) => {
    setSearchQuery(prev => ({ ...prev, from: loc }));
    setFromInput(language === 'kn' ? loc.nameKn : loc.name);
    setShowFromDropdown(false);
  };

  const selectToLocation = (loc) => {
    setSearchQuery(prev => ({ ...prev, to: loc }));
    setToInput(language === 'kn' ? loc.nameKn : loc.name);
    setShowToDropdown(false);
  };

  const handleSwap = () => {
    const tempFrom = searchQuery.from;
    const tempTo = searchQuery.to;
    setSearchQuery(prev => ({ ...prev, from: tempTo, to: tempFrom }));
    setFromInput(tempTo ? (language === 'kn' ? tempTo.nameKn : tempTo.name) : '');
    setToInput(tempFrom ? (language === 'kn' ? tempFrom.nameKn : tempFrom.name) : '');
  };

  const [validationError, setValidationError] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!fromInput.trim() || !toInput.trim()) {
      setValidationError('Please select both Departure and Destination locations before searching.');
      return;
    }
    if (fromInput.trim().toLowerCase() === toInput.trim().toLowerCase()) {
      setValidationError('Departure (From) and Destination (To) locations cannot be the same place.');
      return;
    }
    if (!searchQuery.journeyDate) {
      setValidationError('Please select a valid journey date.');
      return;
    }

    setValidationError('');
    setCurrentView('search-results');
    setTimeout(() => {
      const resultsElem = document.getElementById('search-results-section');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const isMobile = effectiveDevice === 'mobile';
  const isTablet = effectiveDevice === 'tablet';

  return (
    <div className={`w-full max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-emerald-600 dark:border-emerald-500 transition-all duration-300 relative z-20 text-slate-900 dark:text-white ${
      isMobile ? 'p-3.5 sm:p-5 border-2 shadow-lg' : isTablet ? 'p-6' : 'p-8'
    }`}>
      
      {/* Main Search Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-4 sm:space-y-6">
        {validationError && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black flex items-center space-x-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Location Row (Adapted for Mobile vs Tablet vs Desktop) */}
        <div className={isMobile ? "space-y-3 relative" : "grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center"}>
          
          {/* FROM LOCATION input */}
          <div className={isMobile ? "relative" : "lg:col-span-5 relative"} ref={fromContainerRef}>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              {t.search.from}
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-[#0B4F37] dark:text-emerald-400" />
              <input
                type="text"
                value={fromInput}
                onChange={handleFromChange}
                onFocus={() => {
                  setFromSuggestions(searchLocations(fromInput || '', 12));
                  setShowFromDropdown(true);
                  setShowToDropdown(false);
                }}
                placeholder="[ Departure City / Town ]"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-300/90 dark:border-slate-700 hover:border-[#0B4F37] dark:hover:border-emerald-500 focus:border-[#0B4F37] rounded-2xl text-slate-900 dark:text-slate-100 font-extrabold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showFromDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-emerald-500/40 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50">
                {fromSuggestions.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => selectFromLocation(loc)}
                    className="px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#0B4F37] dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {language === 'kn' ? loc.nameKn : loc.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {loc.district} District
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SWAP BUTTON */}
          <div className={isMobile ? "flex justify-center py-0.5" : "lg:col-span-2 flex justify-center pt-2 lg:pt-5"}>
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-[#0B4F37] dark:text-emerald-300 border-2 border-[#0B4F37]/50 hover:border-amber-400 shadow-md hover:rotate-180 transition-all duration-300 cursor-pointer"
              title={t.search.swap}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* TO LOCATION input */}
          <div className={isMobile ? "relative" : "lg:col-span-5 relative"} ref={toContainerRef}>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              {t.search.to}
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-[#0B4F37] dark:text-emerald-400" />
              <input
                type="text"
                value={toInput}
                onChange={handleToChange}
                onFocus={() => {
                  setToSuggestions(searchLocations(toInput || '', 12));
                  setShowToDropdown(true);
                  setShowFromDropdown(false);
                }}
                placeholder="[ Destination City / Town ]"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-300/90 dark:border-slate-700 hover:border-[#0B4F37] dark:hover:border-emerald-500 focus:border-[#0B4F37] rounded-2xl text-slate-900 dark:text-slate-100 font-extrabold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showToDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-emerald-500/40 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50">
                {toSuggestions.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => selectToLocation(loc)}
                    className="px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#0B4F37] dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {language === 'kn' ? loc.nameKn : loc.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {loc.district} District
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Date Selector & Filters */}
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.search.journeyDate}
            </label>

            {/* Quick Date Selector Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full shrink-0">
              <button
                type="button"
                onClick={() => setSearchQuery(prev => ({ ...prev, journeyDate: getRelativeDateStr(0) }))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                  searchQuery.journeyDate === getRelativeDateStr(0)
                    ? 'bg-[#0B4F37] text-white border-emerald-700 shadow-md font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                TODAY
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery(prev => ({ ...prev, journeyDate: getRelativeDateStr(1) }))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                  searchQuery.journeyDate === getRelativeDateStr(1)
                    ? 'bg-[#0B4F37] text-white border-emerald-700 shadow-md font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                TOMORROW
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery(prev => ({ ...prev, journeyDate: getRelativeDateStr(2) }))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                  searchQuery.journeyDate === getRelativeDateStr(2)
                    ? 'bg-[#0B4F37] text-white border-emerald-700 shadow-md font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                +2 DAYS
              </button>
            </div>
          </div>

          <div className={isMobile ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"}>
            
            {/* Journey Date */}
            <div>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3.5 top-3.5 text-[#0B4F37] dark:text-emerald-400" />
                <input
                  type="date"
                  value={searchQuery.journeyDate}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, journeyDate: e.target.value }))}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-300/90 dark:border-slate-700 hover:border-emerald-500 rounded-2xl text-slate-900 dark:text-slate-100 font-extrabold focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <div className="relative">
                <Users className="w-5 h-5 absolute left-3.5 top-3.5 text-[#0B4F37] dark:text-emerald-400" />
                <select
                  value={searchQuery.passengers}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, passengers: Number(e.target.value) }))}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-300/90 dark:border-slate-700 hover:border-emerald-500 rounded-2xl text-slate-900 dark:text-slate-100 font-extrabold focus:outline-none text-sm appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {language === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : (num === 1 ? 'Passenger' : 'Passengers')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bus Type */}
            <div>
              <div className="relative">
                <Bus className="w-5 h-5 absolute left-3.5 top-3.5 text-[#0B4F37] dark:text-emerald-400" />
                <select
                  value={searchQuery.busType}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, busType: e.target.value }))}
                  className="w-full pl-11 pr-3 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-300/90 dark:border-slate-700 hover:border-emerald-500 rounded-2xl text-slate-900 dark:text-slate-100 font-extrabold focus:outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="all">🚌 {language === 'kn' ? 'ಎಲ್ಲಾ ಬಸ್‌ಗಳು' : 'All Malenadu Fleet'}</option>
                  {malenaduFleetCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.logo} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#047857] hover:opacity-95 text-amber-300 font-black text-lg sm:text-xl shadow-xl flex items-center justify-center space-x-3 transition-all cursor-pointer tracking-wider uppercase border-2 border-amber-400 ${
              isMobile ? 'py-3.5 text-base' : ''
            }`}
          >
            <Search className="w-6 h-6 text-amber-300" />
            <span>{t.search.searchBtn}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
