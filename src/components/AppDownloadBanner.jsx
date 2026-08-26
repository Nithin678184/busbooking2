import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Smartphone, QrCode, ShieldCheck, Navigation, Ticket, Sparkles } from 'lucide-react';

export default function AppDownloadBanner() {
  const { language } = useBooking();

  return (
    <section className="py-12 bg-gradient-to-r from-[#0B4F37] via-[#0F4C81] to-[#0A192F] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-slate-900/90 rounded-3xl p-8 sm:p-10 border-4 border-emerald-500/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text & Features */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-600/30 backdrop-blur-md border border-amber-400/50 text-xs font-black text-amber-300">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL MALENADU MOBILE APP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ತತ್ಕ್ಷಣದ ಟಿಕೆಟ್‌ಗಳು & ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್'
                : 'Get Set To Travel With Malenadu Mobile App'}
            </h2>

            <p className="text-sm text-slate-200 font-semibold leading-relaxed">
              Experience easy and fast bus booking online. Confirm your seat in minutes — safe, smooth, and stress-free directly on your smartphone!
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified E-Boarding Pass</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live GPS Bus Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1-Click Wallet Refunds</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Flat 15% OFF App Coupons</span>
              </div>
            </div>
          </div>

          {/* Right QR Code & Download Badges */}
          <div className="shrink-0 bg-slate-950 p-6 rounded-3xl border-2 border-amber-400 text-center space-y-4 shadow-xl">
            <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-inner border-2 border-emerald-600">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://www.malenadutravels.com/app-download" 
                alt="Malenadu App QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-xs font-black text-amber-300 flex items-center justify-center space-x-1">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Scan to Download Malenadu App</span>
            </p>

            <div className="flex items-center justify-center space-x-2 pt-1">
              <div className="px-4 py-2 rounded-xl bg-emerald-800 border border-amber-400 text-white font-black text-[11px] flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-900 transition-colors">
                <span>Google Play</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-800 border border-amber-400 text-white font-black text-[11px] flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-900 transition-colors">
                <span>App Store</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

