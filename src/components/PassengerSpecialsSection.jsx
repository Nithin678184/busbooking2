import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Gift, ShieldCheck, HeartHandshake, Zap, Copy, CheckCircle2, Sparkles, Tag, Coffee, RefreshCw, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PassengerSpecialsSection() {
  const { setCurrentView, walletBalance, setWalletBalance } = useBooking();
  const [copiedCode, setCopiedCode] = useState('');
  const [claimedBonus, setClaimedBonus] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleClaimBonus = () => {
    if (!claimedBonus) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      setWalletBalance(prev => prev + 100);
      setClaimedBonus(true);
    }
  };

  const specials = [
    {
      icon: Tag,
      title: "MALENADU50 Promo Code",
      badge: "₹150 Instant Off",
      badgeBg: "bg-blue-600",
      description: "Flat ₹150 discount on all luxury Volvo, Airavat & Sleeper bus tickets across Karnataka.",
      code: "MALENADU50"
    },
    {
      icon: Sparkles,
      title: "KARNATAKA200 Welcome Offer",
      badge: "₹200 Instant Off",
      badgeBg: "bg-emerald-600",
      description: "Special savings voucher for first-time Malenadu Travelers. Auto-valid on checkout.",
      code: "KARNATAKA200"
    },
    {
      icon: HeartHandshake,
      title: "Senior Citizen Privilege",
      badge: "15% Auto Savings",
      badgeBg: "bg-purple-600",
      description: "Passengers aged 60+ receive 15% instant discount auto-calculated on seat selection.",
      code: null
    },
    {
      icon: ShieldCheck,
      title: "Free Travel Insurance & Telemetry",
      badge: "₹5 Lakh Cover",
      badgeBg: "bg-teal-600",
      description: "Complementary full travel insurance and live GPS tracking shareable with family.",
      code: null
    },
    {
      icon: Coffee,
      title: "Complimentary Refreshment Kit",
      badge: "Free Onboard",
      badgeBg: "bg-amber-600",
      description: "Clean packaged drinking water bottle & snacks provided on all long-distance sleeper buses.",
      code: null
    },
    {
      icon: RefreshCw,
      title: "Zero Cancellation Fee Guarantee",
      badge: "100% Flexi Refund",
      badgeBg: "bg-rose-600",
      description: "Cancel or reschedule your ticket up to 4 hours before departure with zero penalty.",
      code: null
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-900/40 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
      
      {/* Decorative Light Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-emerald-400/20 border border-amber-400/40 text-xs font-black text-amber-300 mb-3 shadow-md">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>EXCLUSIVE PASSENGER SPECIAL PRIVILEGES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Special Comforts & Offers for Every{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Malenadu Traveler
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-semibold mt-3">
            We prioritize your journey with verified luxury fleet, instant wallet cashback, free travel insurance, and zero cancellation stress.
          </p>
        </div>

        {/* Highlight Gift Banner Box */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F4C81] via-[#1A5488] to-[#00C896] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-white/20">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              🎁 Instant Passenger Welcome Gift
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Claim ₹100 E-Wallet Travel Bonus Today
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              Your wallet balance can be used directly during ticket payment. Instant ₹100 credit added on one click!
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleClaimBonus}
              disabled={claimedBonus}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl ${
                claimedBonus
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 shadow-amber-400/30'
              }`}
            >
              {claimedBonus ? '✓ ₹100 Added to E-Wallet' : '🎁 Claim ₹100 E-Wallet Gift'}
            </button>
            <div className="text-xs font-black text-emerald-200">
              Current Balance: <span className="text-white text-sm font-mono">₹{walletBalance}</span>
            </div>
          </div>
        </div>

        {/* Grid of 6 Special Passenger Perks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specials.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-black shadow-md ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-black text-lg text-slate-900 dark:text-slate-100 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {item.code ? (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                      {item.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(item.code)}
                      className="px-3.5 py-1.5 rounded-xl border border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center space-x-1 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                    >
                      {copiedCode === item.code ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
                    <button
                      onClick={() => { setCurrentView('search-results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Book Ticket Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
