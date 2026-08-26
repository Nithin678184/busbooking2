import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { checkIsSleeperBus, formatJourneyDate } from '../data/busRoutesData';
import { ArrowLeft, Check, Lock, Info, Bus, User, Heart, Calendar } from 'lucide-react';

export default function SeatSelector() {
  const { language, selectedBus, selectedSeats, setSelectedSeats, setCurrentView, userBookings, searchQuery, currentUser, openAuthModal } = useBooking();

  // Automatically determine Fleet Category based on selected bus type
  const activeBusCategory = useMemo(() => {
    if (!selectedBus) return 'sarige';
    const isSleeper = checkIsSleeperBus(selectedBus);
    if (isSleeper) return 'sleeper';
    
    const bType = (selectedBus.busType || selectedBus.operatorName || '').toLowerCase();
    if (bType.includes('airavat')) return 'airavat';
    if (bType.includes('rajahamsa')) return 'rajahamsa';
    return 'sarige';
  }, [selectedBus]);

  // Filter filterType ('all' | 'available' | 'ladies')
  const [filterType, setFilterType] = useState('all');

  // Compute booked seats dynamically from stored bookings
  const bookedSeatIds = useMemo(() => {
    if (!userBookings || !selectedBus) return [];
    const list = [];
    userBookings.forEach(b => {
      const matchId = b.busId && selectedBus.id && String(b.busId) === String(selectedBus.id);
      const matchNo = b.busNo && selectedBus.busNumber && String(b.busNo).trim().toLowerCase() === String(selectedBus.busNumber).trim().toLowerCase();
      const isActive = b.status !== 'Cancelled' && b.status !== 'Cancelled by Admin';
      if ((matchId || matchNo) && isActive && Array.isArray(b.seats)) {
        b.seats.forEach(s => {
          const val = typeof s === 'object' ? (s.id || s.label || s.number || s.seatNo) : s;
          if (val !== undefined && val !== null) {
            list.push(String(val));
          }
        });
      }
    });
    return list;
  }, [userBookings, selectedBus]);

  // Generate Seat Data according to exact user specifications
  const currentSeatData = useMemo(() => {
    const basePrice = selectedBus?.price || 750;

    // A. SLEEPER BUS (Volvo Multi-Axle / Night Queen Sleeper)
    // Structure strictly matching user image (16 Lower Berths + 16 Upper Berths)
    if (activeBusCategory === 'sleeper') {
      // Lower Berth (1 to 16)
      // Top Double: (1,2), (6,5), (7,8), (12,11), (13,14)
      // Bottom Single: 3, 4, 9, 10, 15
      // Rear: 16
      const demoBookedLower = ['1', '2', '3', '4', '5', '6', '9', '16'];
      const demoBookedUpper = ['32'];

      const lowerBerths = [
        { id: '1', label: '1', top: true, pair: 1, isBooked: bookedSeatIds.includes('1') || demoBookedLower.includes('1') },
        { id: '2', label: '2', top: true, pair: 1, isBooked: bookedSeatIds.includes('2') || demoBookedLower.includes('2') },
        { id: '6', label: '6', top: true, pair: 2, isBooked: bookedSeatIds.includes('6') || demoBookedLower.includes('6') },
        { id: '5', label: '5', top: true, pair: 2, isBooked: bookedSeatIds.includes('5') || demoBookedLower.includes('5') },
        { id: '7', label: '7', top: true, pair: 3, isBooked: bookedSeatIds.includes('7') },
        { id: '8', label: '8', top: true, pair: 3, isBooked: bookedSeatIds.includes('8') },
        { id: '12', label: '12', top: true, pair: 4, isBooked: bookedSeatIds.includes('12') },
        { id: '11', label: '11', top: true, pair: 4, isBooked: bookedSeatIds.includes('11') },
        { id: '13', label: '13', top: true, pair: 5, isBooked: bookedSeatIds.includes('13') },
        { id: '14', label: '14', top: true, pair: 5, isBooked: bookedSeatIds.includes('14') },

        { id: '3', label: '3', bottom: true, isBooked: bookedSeatIds.includes('3') || demoBookedLower.includes('3') },
        { id: '4', label: '4', bottom: true, isBooked: bookedSeatIds.includes('4') || demoBookedLower.includes('4') },
        { id: '9', label: '9', bottom: true, isBooked: bookedSeatIds.includes('9') || demoBookedLower.includes('9') },
        { id: '10', label: '10', bottom: true, isBooked: bookedSeatIds.includes('10') },
        { id: '15', label: '15', bottom: true, isBooked: bookedSeatIds.includes('15') },

        { id: '16', label: '16', rear: true, isBooked: bookedSeatIds.includes('16') || demoBookedLower.includes('16') }
      ].map(b => ({ ...b, price: basePrice, type: 'sleeper', deck: 'lower' }));

      // Upper Berth (17 to 32)
      // Top Double: (17,18), (22,21), (23,24), (28,27), (29,30)
      // Bottom Single: 19, 20, 25, 26, 31
      // Rear: 32
      const upperBerths = [
        { id: '17', label: '17', top: true, pair: 1, isBooked: bookedSeatIds.includes('17') },
        { id: '18', label: '18', top: true, pair: 1, isBooked: bookedSeatIds.includes('18') },
        { id: '22', label: '22', top: true, pair: 2, isBooked: bookedSeatIds.includes('22') },
        { id: '21', label: '21', top: true, pair: 2, isBooked: bookedSeatIds.includes('21') },
        { id: '23', label: '23', top: true, pair: 3, isBooked: bookedSeatIds.includes('23') },
        { id: '24', label: '24', top: true, pair: 3, isBooked: bookedSeatIds.includes('24') },
        { id: '28', label: '28', top: true, pair: 4, isBooked: bookedSeatIds.includes('28') },
        { id: '27', label: '27', top: true, pair: 4, isBooked: bookedSeatIds.includes('27') },
        { id: '29', label: '29', top: true, pair: 5, isBooked: bookedSeatIds.includes('29') },
        { id: '30', label: '30', top: true, pair: 5, isBooked: bookedSeatIds.includes('30') },

        { id: '19', label: '19', bottom: true, isBooked: bookedSeatIds.includes('19') },
        { id: '20', label: '20', bottom: true, isBooked: bookedSeatIds.includes('20') },
        { id: '25', label: '25', bottom: true, isBooked: bookedSeatIds.includes('25') },
        { id: '26', label: '26', bottom: true, isBooked: bookedSeatIds.includes('26') },
        { id: '31', label: '31', bottom: true, isBooked: bookedSeatIds.includes('31') },

        { id: '32', label: '32', rear: true, isBooked: bookedSeatIds.includes('32') || demoBookedUpper.includes('32') }
      ].map(b => ({ ...b, price: basePrice + 100, type: 'sleeper', deck: 'upper' }));

      return { type: 'sleeper', lowerBerths, upperBerths, totalSeats: 32 };
    }

    // B. SEATER / SEMI-SLEEPER BUSES (Sarige, Airavat, Rajahamsa)
    // 3 + 2 Seating layout (3 Left | Aisle | 2 Right)
    // Last Row: 6 seats across the back
    // Total: 46 Seats
    // Ladies Reserved: First 7 seats (Seats 1, 2, 3, 4, 5, 6, 7)
    const seats = [];
    const regularRows = [];

    // Rows 1 to 8: 5 seats per row (3 Left, 2 Right) = 40 seats
    for (let r = 0; r < 8; r++) {
      const leftSeats = [];
      const rightSeats = [];

      // Left 3 seats
      for (let c = 1; c <= 3; c++) {
        const sNum = r * 5 + c;
        const id = `${sNum}`;
        const isLadies = sNum <= 7;
        const isBooked = bookedSeatIds.includes(id) || (sNum % 9 === 0);
        leftSeats.push({ id, label: id, price: basePrice, isBooked, isLadies, isWindow: c === 1 });
      }

      // Right 2 seats
      for (let c = 4; c <= 5; c++) {
        const sNum = r * 5 + c;
        const id = `${sNum}`;
        const isLadies = sNum <= 7;
        const isBooked = bookedSeatIds.includes(id) || (sNum % 11 === 0);
        rightSeats.push({ id, label: id, price: basePrice, isBooked, isLadies, isWindow: c === 5 });
      }

      regularRows.push({ leftSeats, rightSeats });
      seats.push(...leftSeats, ...rightSeats);
    }

    // Row 9 (Last Row): 6 seats across the back (Seats 41, 42, 43, 44, 45, 46)
    const lastRowSeats = [];
    for (let sNum = 41; sNum <= 46; sNum++) {
      const id = `${sNum}`;
      const isBooked = bookedSeatIds.includes(id);
      lastRowSeats.push({ id, label: id, price: basePrice, isBooked, isLadies: false, isWindow: sNum === 41 || sNum === 46 });
    }
    seats.push(...lastRowSeats);

    return { type: 'seater', regularRows, lastRowSeats, totalSeats: 46 };
  }, [activeBusCategory, selectedBus?.price, bookedSeatIds]);

  const toggleSeatSelection = (seat) => {
    if (seat.isBooked) return;
    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 30) {
        alert(language === 'kn' ? 'ನೀವು ಗರಿಷ್ಠ ೩೦ ಆಸನಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು.' : 'Maximum 30 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, item) => sum + item.price, 0);

  const isSeatDimmedByFilter = (seat) => {
    if (filterType === 'available' && seat.isBooked) return true;
    if (filterType === 'ladies' && !seat.isLadies) return true;
    return false;
  };

  if (!selectedBus) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">No Bus Route Selected</h3>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">Please select a bus route to choose your preferred seats.</p>
        <button 
          onClick={() => setCurrentView('search-results')}
          className="mt-6 px-6 py-3 bg-[#0B4F37] text-white rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          Back to Bus Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-900 dark:text-white">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setCurrentView('search-results')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-[#0F4C81] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಬಸ್‌ಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Buses'}</span>
        </button>

        <div className="text-left sm:text-right">
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100 flex items-center sm:justify-end space-x-2 font-display">
            <span>{language === 'kn' ? 'ಅಧಿಕೃತ ಮಲೆನಾಡು ಆಸನ ಬುಕಿಂಗ್ ವಿಂಡೋ' : 'Official Malenadu Seat Booking Window'}</span>
          </h2>
          <p className="text-xs font-black text-slate-600 dark:text-slate-400 mt-1">
            {selectedBus.operatorName} • <span className="font-mono text-emerald-600 dark:text-emerald-400">{selectedBus.busNumber}</span>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Fleet Category Tabs & Seat Map */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Dedicated Bus Info & Filter Header */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Bus className="w-5 h-5 text-[#0B4F37] dark:text-emerald-400" />
                <span>{selectedBus.operatorName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300">
                  {activeBusCategory === 'sleeper' 
                    ? `${currentSeatData.lowerBerths.filter(b => !b.isBooked).length + currentSeatData.upperBerths.filter(b => !b.isBooked).length} ${language === 'kn' ? 'ಬರ್ತ್‌ಗಳು ಲಭ್ಯ' : 'Berths Available'}` 
                    : `${currentSeatData.regularRows.reduce((acc, r) => acc + r.leftSeats.filter(s=>!s.isBooked).length + r.rightSeats.filter(s=>!s.isBooked).length, 0) + currentSeatData.lastRowSeats.filter(s=>!s.isBooked).length} ${language === 'kn' ? 'ಆಸನಗಳು ಲಭ್ಯ' : 'Seats Available'}`}
                </span>
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span>Vehicle Reg: <span className="font-mono text-emerald-600 dark:text-emerald-400">{selectedBus.busNumber}</span> • {selectedBus.busType}</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center gap-1 border border-emerald-300">
                  <Calendar className="w-3 h-3" /> {formatJourneyDate(searchQuery.journeyDate)}
                </span>
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 text-xs overflow-x-auto max-w-full pb-1 sm:pb-0 shrink-0">
              <span className="font-extrabold text-slate-500 shrink-0">{language === 'kn' ? 'ಫಿಲ್ಟರ್:' : 'Filter:'}</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full font-black border transition-all cursor-pointer shrink-0 ${
                  filterType === 'all' 
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81]' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'kn' ? 'ಎಲ್ಲಾ ಆಸನಗಳು' : 'All Seats'}
              </button>
              <button
                onClick={() => setFilterType('available')}
                className={`px-3 py-1 rounded-full font-black border transition-all cursor-pointer shrink-0 ${
                  filterType === 'available' 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'kn' ? 'ಲಭ್ಯವಿರುವ ಸೀಟುಗಳು ಮಾತ್ರ' : 'Available Only'}
              </button>
              {activeBusCategory !== 'sleeper' && (
                <button
                  onClick={() => setFilterType('ladies')}
                  className={`px-3 py-1 rounded-full font-black border transition-all cursor-pointer shrink-0 ${
                    filterType === 'ladies' 
                      ? 'bg-pink-600 text-white border-pink-600' 
                      : 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-300'
                  }`}
                >
                  💖 Ladies Reserved (First 7 Seats)
                </button>
              )}
            </div>
          </div>

          {/* SEAT MAP CONTAINER */}
          {currentSeatData.type === 'sleeper' ? (
            /* ========================================================================= */
            /* SLEEPER BUS LAYOUT (MATCHING USER UPLOADED SCREENSHOT EXACTLY)             */
            /* ========================================================================= */
            <div className="space-y-6">
              
              {/* LOWER BERTH DECK (16 Berths) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                    Lower Berth ({currentSeatData.lowerBerths.filter(b => !b.isBooked).length} Available)
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-x-auto">
                  {/* Driver Steering Icon */}
                  <div className="absolute left-4 top-4 text-xl" title="Driver Cabin">
                    ☸️
                  </div>

                  <div className="pl-12 min-w-[550px] space-y-6">
                    {/* Top Group: Double Berths Pairs */}
                    <div className="flex items-center space-x-3">
                      {[
                        [currentSeatData.lowerBerths[0], currentSeatData.lowerBerths[1]],
                        [currentSeatData.lowerBerths[2], currentSeatData.lowerBerths[3]],
                        [currentSeatData.lowerBerths[4], currentSeatData.lowerBerths[5]],
                        [currentSeatData.lowerBerths[6], currentSeatData.lowerBerths[7]],
                        [currentSeatData.lowerBerths[8], currentSeatData.lowerBerths[9]]
                      ].map((pair, pIdx) => (
                        <div key={pIdx} className="flex flex-col gap-1.5">
                          {pair.map(berth => {
                            const isSelected = selectedSeats.some(s => s.id === berth.id);
                            const isDimmed = isSeatDimmedByFilter(berth);
                            return (
                              <button
                                key={berth.id}
                                disabled={berth.isBooked}
                                onClick={() => toggleSeatSelection(berth)}
                                className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                                  berth.isBooked
                                    ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                                } ${isDimmed ? 'opacity-20' : ''}`}
                              >
                                <span>{berth.label}</span>
                                {!berth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Middle Aisle Walkway */}
                    <div className="h-6 flex items-center justify-between px-2 text-[10px] font-black uppercase text-slate-400">
                      <span>AISLE WALKWAY</span>
                      {/* Rear Berth 16 placed right of aisle */}
                      {(() => {
                        const rearBerth = currentSeatData.lowerBerths[15];
                        const isSelected = selectedSeats.some(s => s.id === rearBerth.id);
                        return (
                          <button
                            disabled={rearBerth.isBooked}
                            onClick={() => toggleSeatSelection(rearBerth)}
                            className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                              rearBerth.isBooked
                                ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                            }`}
                          >
                            <span>{rearBerth.label}</span>
                            {!rearBerth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                          </button>
                        );
                      })()}
                    </div>

                    {/* Bottom Group: Single Berths */}
                    <div className="flex items-center space-x-3">
                      {[
                        currentSeatData.lowerBerths[10],
                        currentSeatData.lowerBerths[11],
                        currentSeatData.lowerBerths[12],
                        currentSeatData.lowerBerths[13],
                        currentSeatData.lowerBerths[14]
                      ].map(berth => {
                        const isSelected = selectedSeats.some(s => s.id === berth.id);
                        const isDimmed = isSeatDimmedByFilter(berth);
                        return (
                          <button
                            key={berth.id}
                            disabled={berth.isBooked}
                            onClick={() => toggleSeatSelection(berth)}
                            className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                              berth.isBooked
                                ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                            } ${isDimmed ? 'opacity-20' : ''}`}
                          >
                            <span>{berth.label}</span>
                            {!berth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* UPPER BERTH DECK (16 Berths) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                    Upper Berth ({currentSeatData.upperBerths.filter(b => !b.isBooked).length} Available)
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-x-auto">
                  <div className="pl-12 min-w-[550px] space-y-6">
                    {/* Top Group: Double Berths Pairs */}
                    <div className="flex items-center space-x-3">
                      {[
                        [currentSeatData.upperBerths[0], currentSeatData.upperBerths[1]],
                        [currentSeatData.upperBerths[2], currentSeatData.upperBerths[3]],
                        [currentSeatData.upperBerths[4], currentSeatData.upperBerths[5]],
                        [currentSeatData.upperBerths[6], currentSeatData.upperBerths[7]],
                        [currentSeatData.upperBerths[8], currentSeatData.upperBerths[9]]
                      ].map((pair, pIdx) => (
                        <div key={pIdx} className="flex flex-col gap-1.5">
                          {pair.map(berth => {
                            const isSelected = selectedSeats.some(s => s.id === berth.id);
                            const isDimmed = isSeatDimmedByFilter(berth);
                            return (
                              <button
                                key={berth.id}
                                disabled={berth.isBooked}
                                onClick={() => toggleSeatSelection(berth)}
                                className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                                  berth.isBooked
                                    ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                                } ${isDimmed ? 'opacity-20' : ''}`}
                              >
                                <span>{berth.label}</span>
                                {!berth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Middle Aisle Walkway */}
                    <div className="h-6 flex items-center justify-between px-2 text-[10px] font-black uppercase text-slate-400">
                      <span>AISLE WALKWAY</span>
                      {/* Rear Berth 32 placed right of aisle */}
                      {(() => {
                        const rearBerth = currentSeatData.upperBerths[15];
                        const isSelected = selectedSeats.some(s => s.id === rearBerth.id);
                        return (
                          <button
                            disabled={rearBerth.isBooked}
                            onClick={() => toggleSeatSelection(rearBerth)}
                            className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                              rearBerth.isBooked
                                ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                            }`}
                          >
                            <span>{rearBerth.label}</span>
                            {!rearBerth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                          </button>
                        );
                      })()}
                    </div>

                    {/* Bottom Group: Single Berths */}
                    <div className="flex items-center space-x-3">
                      {[
                        currentSeatData.upperBerths[10],
                        currentSeatData.upperBerths[11],
                        currentSeatData.upperBerths[12],
                        currentSeatData.upperBerths[13],
                        currentSeatData.upperBerths[14]
                      ].map(berth => {
                        const isSelected = selectedSeats.some(s => s.id === berth.id);
                        const isDimmed = isSeatDimmedByFilter(berth);
                        return (
                          <button
                            key={berth.id}
                            disabled={berth.isBooked}
                            onClick={() => toggleSeatSelection(berth)}
                            className={`w-20 h-10 rounded-lg font-mono font-bold text-sm flex items-center justify-center relative transition-all border-2 cursor-pointer ${
                              berth.isBooked
                                ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-50'
                            } ${isDimmed ? 'opacity-20' : ''}`}
                          >
                            <span>{berth.label}</span>
                            {!berth.isBooked && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-600 rounded-r-sm" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* 3+2 SEATER LAYOUT (SARIGE / AIRAVAT / RAJAHAMSA - 46 SEATS)               */
            /* ========================================================================= */
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              
              {/* Bus Container Outline */}
              <div className="max-w-2xl mx-auto border-4 border-slate-400 dark:border-slate-700 rounded-3xl p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 shadow-2xl overflow-x-auto">
                
                {/* Driver Cabin Header */}
                <div className="flex justify-between items-center pb-4 border-b-2 border-dashed border-slate-300 dark:border-slate-800 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                      FRONT DRIVER CABIN
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xl" title="Driver Cabin">
                    ☸️
                  </div>
                </div>

                {/* Seats Column Labels */}
                <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase text-slate-500 text-center mb-3">
                  <div className="col-span-6">Left Side (3 Seats)</div>
                  <div className="col-span-2">Aisle</div>
                  <div className="col-span-4">Right Side (2 Seats)</div>
                </div>

                {/* Rows 1 to 8 (3 + 2 Seating) */}
                <div className="space-y-3">
                  {currentSeatData.regularRows.map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-12 gap-2 items-center">
                      
                      {/* Left Group: 3 Seats */}
                      <div className="col-span-6 grid grid-cols-3 gap-2">
                        {row.leftSeats.map(seat => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          const isDimmed = isSeatDimmedByFilter(seat);
                          return (
                            <button
                              key={seat.id}
                              disabled={seat.isBooked}
                              onClick={() => toggleSeatSelection(seat)}
                              className={`h-12 rounded-xl border-2 flex flex-col items-center justify-center p-1 relative transition-all cursor-pointer ${
                                seat.isBooked
                                  ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#0B4F37] border-emerald-500 text-white shadow-lg'
                                  : seat.isLadies
                                  ? 'bg-pink-100 dark:bg-pink-950/80 border-pink-400 text-pink-900 dark:text-pink-200 hover:bg-pink-200'
                                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-900 dark:text-white'
                              } ${isDimmed ? 'opacity-20' : ''}`}
                            >
                              <span className="text-xs font-black font-mono">{seat.label}</span>
                              {seat.isLadies && <span className="text-[9px] text-pink-600 dark:text-pink-400 font-black">💖 Ladies</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Center Aisle */}
                      <div className="col-span-2 flex justify-center">
                        <div className="w-1 h-8 bg-slate-300 dark:bg-slate-800 rounded-full" />
                      </div>

                      {/* Right Group: 2 Seats */}
                      <div className="col-span-4 grid grid-cols-2 gap-2">
                        {row.rightSeats.map(seat => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          const isDimmed = isSeatDimmedByFilter(seat);
                          return (
                            <button
                              key={seat.id}
                              disabled={seat.isBooked}
                              onClick={() => toggleSeatSelection(seat)}
                              className={`h-12 rounded-xl border-2 flex flex-col items-center justify-center p-1 relative transition-all cursor-pointer ${
                                seat.isBooked
                                  ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#0B4F37] border-emerald-500 text-white shadow-lg'
                                  : seat.isLadies
                                  ? 'bg-pink-100 dark:bg-pink-950/80 border-pink-400 text-pink-900 dark:text-pink-200 hover:bg-pink-200'
                                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-900 dark:text-white'
                              } ${isDimmed ? 'opacity-20' : ''}`}
                            >
                              <span className="text-xs font-black font-mono">{seat.label}</span>
                              {seat.isLadies && <span className="text-[9px] text-pink-600 dark:text-pink-400 font-black">💖 Ladies</span>}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>

                {/* LAST ROW: 6 SEATS CONTINUOUS ACROSS THE BACK */}
                <div className="mt-5 pt-4 border-t-2 border-slate-300 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-500 text-center mb-2">Back Row (6 Seats Across)</p>
                  <div className="grid grid-cols-6 gap-2">
                    {currentSeatData.lastRowSeats.map(seat => {
                      const isSelected = selectedSeats.some(s => s.id === seat.id);
                      const isDimmed = isSeatDimmedByFilter(seat);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isBooked}
                          onClick={() => toggleSeatSelection(seat)}
                          className={`h-12 rounded-xl border-2 flex flex-col items-center justify-center p-1 relative transition-all cursor-pointer ${
                            seat.isBooked
                              ? 'bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#0B4F37] border-emerald-500 text-white shadow-lg'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-900 dark:text-white'
                          } ${isDimmed ? 'opacity-20' : ''}`}
                        >
                          <span className="text-xs font-black font-mono">{seat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Seat Legend */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-5 text-xs font-black">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-md border-2 border-emerald-600 bg-white dark:bg-slate-900" />
              <span>Available Seat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-md bg-[#0B4F37] text-white flex items-center justify-center text-[10px]">✓</div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-md bg-slate-300 text-slate-700 flex items-center justify-center text-[9px]"><Lock className="w-2.5 h-2.5" /></div>
              <span>Booked</span>
            </div>
            {activeBusCategory !== 'sleeper' && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-md bg-pink-100 border border-pink-500 flex items-center justify-center text-[10px]">💖</div>
                <span className="text-pink-600">Ladies Reserved (First 7 Seats)</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Booking Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl sticky top-24">
            
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <span>{language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಆಸನಗಳು' : 'Selected Seats'} ({selectedSeats.length})</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200">
                {language === 'kn' ? 'ಒಟ್ಟು' : 'Total'}: ₹{totalPrice}
              </span>
            </h3>

            {/* Selected Seats Badges */}
            <div className="mb-6">
              {selectedSeats.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 text-xs font-bold">
                  {language === 'kn' ? 'ಆಸನ ಆಯ್ಕೆ ಮಾಡಲು ಬಸ್ ವಿನ್ಯಾಸದಲ್ಲಿರುವ ಲಭ್ಯವಿರುವ ಸೀಟ್ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click any available seat on the bus layout to select'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                  {selectedSeats.map(seat => (
                    <div 
                      key={seat.id}
                      className="px-3 py-1.5 rounded-xl bg-[#0B4F37] text-white font-black text-xs flex items-center space-x-2 shadow-sm"
                    >
                      <span>{language === 'kn' ? 'ಆಸನ' : 'Seat'} {seat.label || seat.id}</span>
                      <span className="opacity-90">₹{seat.price}</span>
                      <button
                        onClick={() => toggleSeatSelection(seat)}
                        className="text-emerald-200 hover:text-white ml-1 cursor-pointer font-bold"
                        title="Remove seat"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculation Summary */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'kn' ? 'ಮೂಲ ದರ' : 'Base Fare'} ({selectedSeats.length} × ₹{selectedBus.price})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'kn' ? 'ತೆರಿಗೆ ಮತ್ತು ಸೇವಾ ಶುಲ್ಕ' : 'Taxes & Operator Fee'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{language === 'kn' ? '₹೦ (ಉಚಿತ)' : '₹0 (Included)'}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>{language === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ' : 'Total Amount Payable'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{totalPrice}</span>
              </div>
            </div>

            {/* Proceed to Details Button */}
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => {
                if (selectedSeats.length > 0) {
                  if (!currentUser) {
                    if (openAuthModal) openAuthModal('login');
                    return;
                  }
                  setCurrentView('passenger-details');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer ${
                selectedSeats.length > 0
                  ? 'bg-[#0B4F37] hover:bg-[#073625] text-amber-300 shadow-emerald-900/20 hover:scale-[1.02]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{language === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ವಿವರಗಳಿಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Passenger Info'}</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
