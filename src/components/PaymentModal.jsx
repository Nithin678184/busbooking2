import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import confetti from 'canvas-confetti';
import { QrCode, CreditCard, Landmark, ArrowLeft, Tag, ShieldCheck, Lock, Check } from 'lucide-react';

export default function PaymentModal() {
  const { t, language, selectedBus, selectedSeats = [], passengerInfo = {}, setActiveTicket, setUserBookings, setCurrentView, adminQrCodes, currentUser, appliedPromoCode } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const activeQr = (adminQrCodes && adminQrCodes.find(q => q.isActive)) || adminQrCodes?.[0];

  const basePrice = (selectedSeats || []).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  const seniorDiscount = passengerInfo?.isSenior ? Math.round(basePrice * 0.15) : 0;
  const finalPayable = Math.max(0, basePrice - seniorDiscount - discountAmount);

  // Auto-apply promo code if selected from OffersSection or Context
  useEffect(() => {
    const promoToUse = appliedPromoCode || couponCode;
    if (promoToUse && basePrice > 0) {
      setCouponCode(promoToUse);
      applyCouponCode(promoToUse, basePrice);
    }
  }, [appliedPromoCode, basePrice]);

  const applyCouponCode = (codeToApply, currentBasePrice) => {
    const cleanCode = (codeToApply || '').trim().toUpperCase();
    const price = currentBasePrice || basePrice;
    setPaymentError('');

    if (cleanCode === 'MALENADU15') {
      const disc = Math.round(price * 0.15);
      setDiscountAmount(disc);
      setAppliedCoupon(`MALENADU15 (Flat 15% OFF - Saved ₹${disc})`);
    } else if (cleanCode === 'KARNATAKA200') {
      const disc = Math.min(200, price);
      setDiscountAmount(disc);
      setAppliedCoupon(`KARNATAKA200 (Flat ₹200 OFF)`);
    } else if (cleanCode === 'STUDENT10') {
      const disc = Math.round(price * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon(`STUDENT10 (10% Student Discount - Saved ₹${disc})`);
    } else if (cleanCode === 'SENIOR15') {
      const disc = Math.round(price * 0.15);
      setDiscountAmount(disc);
      setAppliedCoupon(`SENIOR15 (15% Senior Pass Discount - Saved ₹${disc})`);
    } else if (cleanCode === 'MALENADU50') {
      const disc = Math.min(150, price);
      setDiscountAmount(disc);
      setAppliedCoupon(`MALENADU50 (₹150 OFF)`);
    } else if (cleanCode) {
      setDiscountAmount(0);
      setAppliedCoupon('');
      setPaymentError('Invalid coupon code. Available deals: MALENADU15, KARNATAKA200, STUDENT10, SENIOR15');
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCouponCode(couponCode, basePrice);
  };

  const handlePayNow = () => {
    setPaymentError('');

    // Pre-fill card details automatically if card tab is selected
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\D/g, '').length < 16) {
        setCardNumber('4532 8921 7843 8921');
      }
      if (!expiryDate) {
        setExpiryDate('08/28');
      }
      if (!cvv) {
        setCvv('123');
      }
    }

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      console.log('Confetti triggered');
    }

    const pnr = `MAL-KN-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const now = Date.now();
    const autoApproveAt = now + 10 * 60 * 1000; // 10 minutes auto approve countdown

    const finalName = (passengerInfo?.name || currentUser?.name || 'Ravi Kumar').trim();
    const finalMobile = (passengerInfo?.mobile || currentUser?.mobile || '9845012345').trim();
    const finalEmail = (passengerInfo?.email || currentUser?.email || 'ravi5@gmail.com').trim();

    const newTicket = {
      pnr,
      bookingId,
      busId: selectedBus ? selectedBus.id : 'bus_1',
      busName: selectedBus ? (selectedBus.operatorName || selectedBus.name) : 'Malenadu Express',
      busNo: selectedBus ? selectedBus.busNumber : 'KA-01-MN-7777',
      from: selectedBus ? (selectedBus.fromCity || selectedBus.boardingPoints?.[0]?.name || 'Bengaluru') : 'Bengaluru (Bangalore)',
      to: selectedBus ? (selectedBus.toCity || selectedBus.droppingPoints?.[0]?.name || 'Shivamogga') : 'Shivamogga (Shimoga)',
      journeyDate: selectedBus?.travelDate || new Date().toISOString().split('T')[0],
      departureTime: selectedBus ? selectedBus.departureTime : '21:30',
      arrivalTime: selectedBus ? (selectedBus.arrivalTime || '05:30') : '05:30',
      seats: (selectedSeats && selectedSeats.length > 0) ? selectedSeats.map(s => s.id || s) : ['L4'],
      passengerName: finalName,
      mobile: finalMobile,
      email: finalEmail,
      userMobile: currentUser?.mobile || finalMobile,
      userEmail: currentUser?.email || finalEmail,
      amountPaid: finalPayable > 0 ? finalPayable : 1100,
      createdAt: now,
      autoApproveAt,
      status: 'Pending Admin Approval'
    };

    setActiveTicket(newTicket);
    setUserBookings(prev => [newTicket, ...(prev || [])]);

    setCurrentView('ticket-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedBus) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {language === 'kn' ? 'ಯಾವುದೇ ಬಸ್ ಆಯ್ಕೆಯಾಗಿಲ್ಲ' : 'No Bus Selected'}
        </h3>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {language === 'kn' ? 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು ಬಸ್ ಮತ್ತು ಆಸನಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Please select a bus route and preferred seats before proceeding to payment.'}
        </p>
        <button
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-6 py-3 bg-[#0B4F37] text-white rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          {language === 'kn' ? 'ಬಸ್ ಹುಡುಕಾಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Go to Bus Search'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('passenger-details')}
          className="flex items-center space-x-2 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Passenger Details</span>
        </button>

        <h2 className="font-black text-2xl text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.payment.title}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Payment Methods Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black flex items-center space-x-2">
              <span>⚠️</span>
              <span>{paymentError}</span>
            </div>
          )}

          {/* Method Selection Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'upi', label: language === 'kn' ? 'ಯುಪಿಐ / ಕ್ಯೂಆರ್' : 'UPI / QR', icon: QrCode },
              { id: 'card', label: language === 'kn' ? 'ಕಾರ್ಡ್‌ಗಳು' : 'Cards', icon: CreditCard },
              { id: 'netbanking', label: language === 'kn' ? 'ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್' : 'NetBanking', icon: Landmark }
            ].map(m => {
              const Icon = m.icon;
              const isSel = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    isSel 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                      : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* UPI Payment Container */}
          {paymentMethod === 'upi' && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-emerald-500/50 text-center space-y-4 shadow-md">
              <div className="flex items-center justify-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  📷 {language === 'kn' ? 'ಅಡ್ಮಿನ್ ವೈಯಕ್ತಿಕ ಪಾವತಿ ಕ್ಯೂಆರ್ ಕೋಡ್' : 'Admin Personal Payment QR Code'}
                </span>
              </div>

              <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                {language === 'kn' 
                  ? 'ಗೂಗಲ್ ಪೇ, ಫೋನ್ ಪೇ, ಪೇಟಿಎಂ ಅಥವಾ ಯಾವುದೇ ಯುಪಿಐ ಆ್ಯಪ್ ಮೂಲಕ ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಪಾವತಿಸಿ' 
                  : "Scan Admin's Uploaded Personal QR Code with Google Pay, PhonePe, Paytm, or any UPI app to pay"
                }
              </p>
              
              {/* Admin Configured Personal QR Code Graphic */}
              <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-500 flex flex-col items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <img 
                  src={activeQr ? activeQr.qrImageUrl : 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=malenadutravels@upi'} 
                  alt="Admin Personal Payment QR"
                  className="w-40 h-40 object-contain rounded-lg"
                />
                <span className="text-[11px] font-mono font-black text-emerald-700 tracking-wider mt-1 truncate max-w-[190px]">
                  {activeQr ? activeQr.upiId : 'malenadutravels@upi'}
                </span>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                <p>{language === 'kn' ? 'ವರ್ತಕರು / ಮಾಲೀಕರು:' : 'Merchant / Owner:'} <span className="font-mono font-black text-slate-900 dark:text-slate-100">{activeQr ? (language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್' : activeQr.merchantName) : (language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್' : 'Malenadu Travels Pvt Ltd')}</span></p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{language === 'kn' ? '✓ ಪಾವತಿಯ ನಂತರ ತತ್ಕ್ಷಣದ ಸ್ವಯಂಚಾಲಿತ ಟಿಕೆಟ್ ಖಾತರಿ' : '✓ Instant Automated Ticket Confirmation Upon Payment'}</p>
              </div>
            </div>
          )}

          {/* Card Payment Container */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength="19"
                  placeholder="4532 8921 7843 8921"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength="5"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    CVV Code
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength="4"
                    placeholder="•••"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code (e.g. MALENADU50)"
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-black uppercase outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-black"
              >
                {t.payment.apply}
              </button>
            </form>
            {appliedCoupon && (
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Coupon Applied: {appliedCoupon}</span>
              </p>
            )}
          </div>

          <button
            onClick={handlePayNow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] hover:opacity-95 text-white font-black text-lg shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01]"
          >
            {t.payment.payNow} • ₹{finalPayable}
          </button>
        </div>

        {/* Amount Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              {language === 'kn' ? 'ಪಾವತಿಯ ವಿವರಗಳು' : 'Payment Breakdown'}
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">{language === 'kn' ? 'ಮೂಲ ಆಸನಗಳ ದರ' : 'Base Seats Fare'}</span>
                <span className="font-black text-slate-900 dark:text-slate-100">₹{basePrice}</span>
              </div>
              {seniorDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-black">
                  <span>{language === 'kn' ? 'ಹಿರಿಯ ನಾಗರಿಕರ ರಿಯಾಯಿತಿ' : 'Senior Citizen Discount'}</span>
                  <span>- ₹{seniorDiscount}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-blue-600 font-black">
                  <span>{language === 'kn' ? 'ಕೂಪನ್ ರಿಯಾಯಿತಿ' : 'Coupon Discount'}</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">{language === 'kn' ? 'ವಿಮೆ ಮತ್ತು ತೆರಿಗೆಗಳು' : 'Insurance & Taxes'}</span>
                <span className="font-black text-emerald-600">{language === 'kn' ? 'ಉಚಿತ' : 'FREE'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
              <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-slate-100">
                <span>{language === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ' : 'Total Payable'}</span>
                <span className="text-[#00C896]">₹{finalPayable}</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{language === 'kn' ? '೨೫೬-ಬಿಟ್ ಎಸ್‌ಎಸ್‌ಎಲ್ ಬ್ಯಾಂಕ್ ಸುರಕ್ಷಿತ ವಹಿವಾಟು' : '256-Bit SSL Encrypted & Bank Guaranteed Transaction'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
