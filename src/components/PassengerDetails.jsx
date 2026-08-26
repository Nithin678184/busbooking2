import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  User, Phone, Mail, Tag, CheckCircle2, ArrowLeft, Ticket, 
  X, Bus, MapPin, Calendar, AlertCircle, ShieldCheck, ShieldAlert, Lock, LogIn
} from 'lucide-react';

export default function PassengerDetails() {
  const { 
    t, 
    language, 
    passengerInfo = {}, 
    setPassengerInfo, 
    setCurrentView, 
    selectedSeats = [], 
    selectedBus = null, 
    searchQuery = {}, 
    currentUser = null, 
    appliedPromoCode = '', 
    setAppliedPromoCode,
    openAuthModal
  } = useBooking();

  const [formError, setFormError] = useState('');
  const [inputCoupon, setInputCoupon] = useState(appliedPromoCode || '');
  const [couponError, setCouponError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedLabel, setAppliedLabel] = useState('');

  // Safe data extraction to guarantee zero blank screens
  const safeSeats = Array.isArray(selectedSeats) ? selectedSeats : [];

  const seatLabelsList = safeSeats.map(s => {
    if (!s) return '';
    if (typeof s === 'string' || typeof s === 'number') return String(s);
    return String(s.label || s.id || '');
  }).filter(Boolean);

  const farePerSeat = selectedBus?.price || (typeof safeSeats[0] === 'object' ? safeSeats[0]?.price : 0) || 750;

  const baseFare = safeSeats.reduce((acc, curr) => {
    if (!curr) return acc;
    if (typeof curr === 'object' && typeof curr.price === 'number') {
      return acc + curr.price;
    }
    return acc + farePerSeat;
  }, 0);

  const fromCityName = selectedBus?.fromCity || searchQuery?.from?.name || 'Bengaluru';
  const toCityName = selectedBus?.toCity || searchQuery?.to?.name || 'Shivamogga';
  const boardingPointName = selectedBus?.boardingPoints?.[0]?.name || `${fromCityName} Malenadu Terminal`;
  const boardingPointTime = selectedBus?.boardingPoints?.[0]?.time || selectedBus?.departureTime || '21:30';
  const droppingPointName = selectedBus?.droppingPoints?.[0]?.name || `${toCityName} Main Depot`;
  const droppingPointTime = selectedBus?.droppingPoints?.[0]?.time || selectedBus?.arrivalTime || '05:30';
  const journeyDateFormatted = selectedBus?.travelDate || searchQuery?.journeyDate || new Date().toISOString().split('T')[0];
  const departureTime = selectedBus?.departureTime || '21:30';

  // Auto-fill passenger details with user profile or sensible defaults so booking never blocks
  useEffect(() => {
    if (setPassengerInfo) {
      setPassengerInfo(prev => ({
        name: prev?.name || currentUser?.name || 'Ravi Kumar',
        age: prev?.age || '28',
        gender: prev?.gender || 'male',
        mobile: prev?.mobile || currentUser?.mobile || '9845012345',
        email: prev?.email || currentUser?.email || 'ravi5@gmail.com',
        emergencyMobile: prev?.emergencyMobile || ''
      }));
    }
  }, [currentUser, setPassengerInfo]);

  // Helper to validate and calculate coupon discount
  const applyCoupon = (codeToApply) => {
    const code = (codeToApply || '').trim().toUpperCase();
    setCouponError('');

    if (!code) {
      setAppliedDiscount(0);
      setAppliedLabel('');
      if (setAppliedPromoCode) setAppliedPromoCode('');
      return;
    }

    if (code === 'MALENADU15') {
      const disc = Math.round(baseFare * 0.15);
      setAppliedDiscount(disc);
      setAppliedLabel(`MALENADU15 (Flat 15% OFF - Saved ₹${disc})`);
      if (setAppliedPromoCode) setAppliedPromoCode('MALENADU15');
    } else if (code === 'KARNATAKA200') {
      const disc = Math.min(200, baseFare);
      setAppliedDiscount(disc);
      setAppliedLabel(`KARNATAKA200 (Flat ₹200 OFF)`);
      if (setAppliedPromoCode) setAppliedPromoCode('KARNATAKA200');
    } else if (code === 'STUDENT10') {
      const disc = Math.round(baseFare * 0.10);
      setAppliedDiscount(disc);
      setAppliedLabel(`STUDENT10 (10% Student Special Discount - Saved ₹${disc})`);
      if (setAppliedPromoCode) setAppliedPromoCode('STUDENT10');
    } else if (code === 'SENIOR15') {
      const disc = Math.round(baseFare * 0.15);
      setAppliedDiscount(disc);
      setAppliedLabel(`SENIOR15 (15% Senior Citizen Pass - Saved ₹${disc})`);
      if (setAppliedPromoCode) setAppliedPromoCode('SENIOR15');
    } else if (code === 'MALENADU50') {
      const disc = Math.min(150, baseFare);
      setAppliedDiscount(disc);
      setAppliedLabel(`MALENADU50 (₹150 OFF)`);
      if (setAppliedPromoCode) setAppliedPromoCode('MALENADU50');
    } else {
      setAppliedDiscount(0);
      setAppliedLabel('');
      setCouponError('Invalid coupon code. Try MALENADU15, KARNATAKA200, STUDENT10, or SENIOR15.');
    }
  };

  // Sync applied promo code from context on load
  useEffect(() => {
    if (appliedPromoCode && baseFare > 0) {
      setInputCoupon(appliedPromoCode);
      applyCoupon(appliedPromoCode);
    }
  }, [appliedPromoCode, baseFare]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormError('');
    if (setPassengerInfo) {
      setPassengerInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    applyCoupon(inputCoupon);
  };

  const removeCoupon = () => {
    setInputCoupon('');
    setAppliedDiscount(0);
    setAppliedLabel('');
    setCouponError('');
    if (setAppliedPromoCode) setAppliedPromoCode('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = (passengerInfo?.name || '').trim();
    const finalAge = (passengerInfo?.age || '').trim();
    const finalMobile = (passengerInfo?.mobile || '').trim();
    const finalEmail = (passengerInfo?.email || '').trim();
    const emergency = (passengerInfo?.emergencyMobile || '').trim();

    // Validation 1: Passenger Name
    if (!finalName || finalName.length < 2) {
      setFormError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಪ್ರಯಾಣಿಕರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ ೨ ಅಕ್ಷರಗಳು).' : 'Please enter a valid passenger name (minimum 2 characters).');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Validation 2: Age
    const numAge = Number(finalAge);
    if (!finalAge || isNaN(numAge) || numAge < 1 || numAge > 120) {
      setFormError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ (೧-೧೨೦ ವರ್ಷಗಳು).' : 'Please enter a valid age between 1 and 120.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Validation 3: Mobile Number
    const cleanMobile = finalMobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setFormError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ೧೦-ಅಂಕಿಗಳ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit Indian mobile number (e.g. 9845012345).');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Validation 4: Email Format
    if (finalEmail && !/^\S+@\S+\.\S+$/.test(finalEmail)) {
      setFormError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (e.g. user@gmail.com).' : 'Please enter a valid email address (e.g. user@gmail.com).');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (setPassengerInfo) {
      setPassengerInfo(prev => ({
        ...prev,
        name: finalName,
        age: finalAge,
        mobile: finalMobile,
        email: finalEmail,
        emergencyMobile: emergency
      }));
    }

    setFormError('');
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalPayable = Math.max(0, baseFare - appliedDiscount);

  // Require login before allowing passenger details input
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <Lock className="w-10 h-10 text-[#00C896]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              {language === 'kn' ? 'ಖಾತೆ ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ' : 'Sign In Required To Book Ticket'}
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {language === 'kn'
                ? 'ಟಿಕೆಟ್ ಬುಕಿಂಗ್ ಪೂರ್ಣಗೊಳಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ.'
                : 'Please sign in or register a free account to enter passenger details and confirm your bus booking.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal && openAuthModal('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] text-white font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-5 h-5 text-emerald-300" />
              <span>{language === 'kn' ? 'ಲಾಗಿನ್ / ನೋಂದಾಯಿಸಿ' : 'Login / Register Account'}</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {language === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If session expired or refreshed without selecting seats/bus, show proper session expired banner instead of blank page
  if (!selectedBus || safeSeats.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
            {language === 'kn' ? 'ನಿಮ್ಮ ಬುಕಿಂಗ್ ಸೆಷನ್ ಅವಧಿ ಮುಗಿದಿದೆ' : 'Your booking session has expired.'}
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {language === 'kn' 
              ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬಸ್ ಮತ್ತು ಆಸನಗಳನ್ನು ಮತ್ತೆ ಆಯ್ಕೆ ಮಾಡಿ.' 
              : 'Please select your bus and seats again.'
            }
          </p>
        </div>
        <button
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-6 py-3.5 bg-[#0B4F37] hover:bg-[#073625] text-amber-300 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer inline-flex items-center space-x-2"
        >
          <Bus className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಬಸ್ ಮತ್ತು ಆಸನ ಆಯ್ಕೆಗೆ ತೆರಳಿ' : 'Select Bus & Seats Again'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => { setCurrentView('seat-selection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 cursor-pointer shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಆಸನ ಆಯ್ಕೆಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Seat Selection'}</span>
        </button>

        <h2 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100 font-display">
          {t?.passenger?.title || (language === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'Passenger Information')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Left Section: Trip Summary & Passenger Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Trip Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Bus className="w-5 h-5 text-[#0B4F37] dark:text-emerald-400" />
                <span>{selectedBus?.operatorName || 'Malenadu Express'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300">
                  {selectedBus?.busType || 'AC Sleeper Volvo'}
                </span>
              </h3>
              <span className="text-xs font-mono font-black text-slate-500">
                {selectedBus?.busNumber || 'KA-01-MN-7777'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> {language === 'kn' ? 'ಮಾರ್ಗ' : 'Route'}
                </span>
                <p className="font-black text-slate-900 dark:text-white text-sm">
                  {fromCityName} ➔ {toCityName}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" /> {language === 'kn' ? 'ಪ್ರಯಾಣ ದಿನಾಂಕ' : 'Date & Time'}
                </span>
                <p className="font-black text-slate-900 dark:text-white text-sm">
                  {journeyDateFormatted} • <span className="text-emerald-600 dark:text-emerald-400">{departureTime}</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-amber-500" /> {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಸೀಟುಗಳು' : 'Seats'}
                </span>
                <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {seatLabelsList.join(', ')} ({seatLabelsList.length})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold pt-2">
              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  📍 {language === 'kn' ? 'ಬೋರ್ಡಿಂಗ್ ಪಾಯಿಂಟ್ (ನಿಲ್ದಾಣ)' : 'Boarding Point'}
                </span>
                <p className="font-black text-slate-900 dark:text-white">{boardingPointName}</p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">{boardingPointTime}</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 block mb-0.5">
                  📍 {language === 'kn' ? 'ಡ್ರಾಪಿಂಗ್ ಪಾಯಿಂಟ್ (ಗಮ್ಯಸ್ಥಾನ)' : 'Dropping Point'}
                </span>
                <p className="font-black text-slate-900 dark:text-white">{droppingPointName}</p>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold">{droppingPointTime}</span>
              </div>
            </div>
          </div>

          {/* 2. Passenger Details Form Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{t?.passenger?.primaryPassenger || (language === 'kn' ? 'ಮುಖ್ಯ ಪ್ರಯಾಣಿಕರ ವಿವರಗಳು' : 'Primary Passenger Details')}</span>
                </h3>
              </div>

              {/* Passenger Name, Age, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{t?.passenger?.fullName || (language === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಪೂರ್ಣ ಹೆಸರು' : 'Passenger Full Name')} *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={passengerInfo.name || ''}
                    onChange={handleInputChange}
                    placeholder={language === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name (as per ID)'}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'kn' ? 'ವಯಸ್ಸು' : 'Age'} *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={passengerInfo.age || ''}
                    onChange={handleInputChange}
                    placeholder="28"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'kn' ? 'ಲಿಂಗ' : 'Gender'}
                  </label>
                  <select
                    name="gender"
                    value={passengerInfo.gender || 'male'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="male">{language === 'kn' ? 'ಪುರುಷ' : 'Male'}</option>
                    <option value="female">{language === 'kn' ? 'ಮಹಿಳೆ' : 'Female'}</option>
                    <option value="other">{language === 'kn' ? 'ಇತರೆ' : 'Other'}</option>
                  </select>
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={passengerInfo.mobile || ''}
                    onChange={handleInputChange}
                    placeholder="9845012345"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>{language === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'} *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={passengerInfo.email || ''}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Emergency Mobile */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'kn' ? 'ತುರ್ತು ಸಂಪರ್ಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Emergency Contact Mobile'}</span>
                </label>
                <input
                  type="tel"
                  name="emergencyMobile"
                  value={passengerInfo.emergencyMobile || ''}
                  onChange={handleInputChange}
                  placeholder={language === 'kn' ? 'ತುರ್ತು ಸಂಪರ್ಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Emergency contact mobile number'}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400 font-mono"
                />
              </div>

              {/* 🎟️ APPLY COUPON CODE & PROMO DEALS FEATURE BOX */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'kn' ? 'ಕೂಪನ್ ಕೋಡ್ ಮತ್ತು ಆಫರ್ ಅನ್ವಯಿಸಿ' : 'Apply Coupon Code & Promo Deals'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                    {language === 'kn' ? 'ತತ್ಕ್ಷಣದ ರಿಯಾಯಿತಿ' : 'Instant Discount'}
                  </span>
                </div>

                {/* Coupon Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder={language === 'kn' ? 'ಕೂಪನ್ ಕೋಡ್ (ಉದಾ. MALENADU15)' : 'Enter Coupon Code (e.g. MALENADU15)'}
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-black uppercase text-white outline-none placeholder:text-slate-400 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleCouponSubmit}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black cursor-pointer shadow-md transition-all shrink-0"
                  >
                    {language === 'kn' ? 'ಕೋಡ್ ಅನ್ವಯಿಸಿ' : 'Apply Code'}
                  </button>
                </div>

                {/* Applied Notice */}
                {appliedLabel && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{appliedLabel}</span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-slate-400 hover:text-white font-bold ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs text-red-400 font-black pt-1">⚠️ {couponError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] hover:opacity-95 text-white font-black text-base shadow-xl transition-all cursor-pointer hover:scale-[1.01]"
              >
                <span>{language === 'kn' ? 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ' : 'PROCEED TO PAYMENT'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Section: Trip Fare & Seat Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24 space-y-4">
            
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between font-display">
              <span>{language === 'kn' ? 'ಪ್ರಯಾಣದ ದರ ಸಾರಾಂಶ' : 'Trip Fare Summary'}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200">
                {seatLabelsList.length} {language === 'kn' ? 'ಆಸನಗಳು' : 'Seat(s)'}
              </span>
            </h3>

            {/* Selected Seats Badges */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">
                {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಸೀಟ್‌ಗಳು' : 'Selected Seat Numbers'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {seatLabelsList.map((label, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded-lg bg-[#0B4F37] text-white font-black text-xs shadow-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs font-semibold pt-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'kn' ? 'ಪ್ರತಿ ಆಸನದ ದರ' : 'Fare Per Seat'}</span>
                <span className="font-black text-slate-900 dark:text-slate-100">₹{farePerSeat}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'kn' ? 'ಮೂಲ ದರ' : 'Base Seat Fare'} ({seatLabelsList.length} × ₹{farePerSeat})</span>
                <span className="font-black text-slate-900 dark:text-slate-100">₹{baseFare}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-black">
                  <span>{language === 'kn' ? 'ಕೂಪನ್ ರಿಯಾಯಿತಿ' : 'Coupon Discount'}</span>
                  <span>- ₹{appliedDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'kn' ? 'ತೆರಿಗೆ ಮತ್ತು ಸೇವಾ ಶುಲ್ಕ' : 'Taxes & Operator Fee'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{language === 'kn' ? '₹೦ (ಉಚಿತ)' : '₹0 (Included)'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-slate-100">
                <span>{language === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ' : 'Total Payable'}</span>
                <span className="text-[#0F4C81] dark:text-emerald-400 font-display">
                  ₹{finalPayable}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{language === 'kn' ? '೨೫೬-ಬಿಟ್ ಎಸ್‌ಎಸ್‌ಎಲ್ ಬ್ಯಾಂಕ್ ಸುರಕ್ಷಿತ ವಹಿವಾಟು' : '256-Bit SSL Encrypted Booking'}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
