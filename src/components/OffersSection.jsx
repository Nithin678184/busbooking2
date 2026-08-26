import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Copy, Check, Sparkles, Percent } from 'lucide-react';

export default function OffersSection() {
  const { language, setAppliedPromoCode, appliedPromoCode, setCurrentView } = useBooking();
  const [copiedCode, setCopiedCode] = useState(null);

  const offersEn = [
    {
      code: "MALENADU15",
      title: "Malenadu Official Web Discount",
      discount: "Flat 15% OFF",
      desc: "Valid on all Malenadu AC Sleeper & Luxury bus tickets online.",
      validity: "Valid till 31st Dec 2026",
      bg: "from-[#0B4F37] via-[#059669] to-[#047857]"
    },
    {
      code: "KARNATAKA200",
      title: "Western Ghats Monsoon Deal",
      discount: "Flat ₹200 OFF",
      desc: "Book trips to Coorg, Agumbe, Jog Falls, or Chikkamagaluru.",
      validity: "Weekend Trips Special",
      bg: "from-[#0D47A1] via-[#1565C0] to-[#0A192F]"
    },
    {
      code: "STUDENT10",
      title: "Karnataka Student Special",
      discount: "10% Instant Cashback",
      desc: "For college & university students carrying valid Student ID.",
      validity: "All Season Active",
      bg: "from-[#F57F17] via-[#E65100] to-[#BF360C]"
    },
    {
      code: "SENIOR15",
      title: "Senior Citizen Dignity Pass",
      discount: "15% Instant Discount",
      desc: "For travelers aged 60 and above across all 31 districts.",
      validity: "Always Available",
      bg: "from-[#059669] via-[#0B4F37] to-[#0A192F]"
    }
  ];

  const offersKn = [
    {
      code: "MALENADU15",
      title: "ಮಲೆನಾಡು ಆನ್‌ಲೈನ್ ಅಧಿಕೃತ ರಿಯಾಯಿತಿ",
      discount: "ನೇರ 15% ರಿಯಾಯಿತಿ",
      desc: "ಎಲ್ಲಾ ಮಲೆನಾಡು ಎಸಿ ಸ್ಲೀಪರ್ ಮತ್ತು ಐಷಾರಾಮಿ ಬಸ್‌ಗಳ ಆನ್‌ಲೈನ್ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ.",
      validity: "೩೧ ಡಿಸೆಂಬರ್ ೨೦೨೬ ರವರೆಗೆ ಮಾನ್ಯ",
      bg: "from-[#0B4F37] via-[#059669] to-[#047857]"
    },
    {
      code: "KARNATAKA200",
      title: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪ್ರವಾಸಿ ರಿಯಾಯಿತಿ",
      discount: "ನೇರ ₹೨೦೦ ರಿಯಾಯಿತಿ",
      desc: "ಕುಶಾಲನಗರ, ಆಗುಂಬೆ, ಜೋಗ ಜಲಪಾತ ಅಥವಾ ಚಿಕ್ಕಮಗಳೂರು ಪ್ರಯಾಣಗಳಿಗೆ ರಿಯಾಯಿತಿ.",
      validity: "ವಾರಾಂತ್ಯದ ವಿಶೇಶ ಪ್ರವಾಸ",
      bg: "from-[#0D47A1] via-[#1565C0] to-[#0A192F]"
    },
    {
      code: "STUDENT10",
      title: "ಕರ್ನಾಟಕ ವಿದ್ಯಾರ್ಥಿ ಕೊಡುಗೆ",
      discount: "10% ತತ್ಕ್ಷಣದ ರಿಯಾಯಿತಿ",
      desc: "ಮಾನ್ಯ ವಿದ್ಯಾರ್ಥಿ ಗುರುತಿನ ಚೀಟಿ ಹೊಂದಿರುವ ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ.",
      validity: "ವರ್ಷವಿಡೀ ಲಭ್ಯ",
      bg: "from-[#F57F17] via-[#E65100] to-[#BF360C]"
    },
    {
      code: "SENIOR15",
      title: "ಹಿರಿಯ ನಾಗರಿಕರ ಗೌರವ ಪಾಸ್",
      discount: "15% ತತ್ಕ್ಷಣದ ರಿಯಾಯಿತಿ",
      desc: "೬೦ ವರ್ಷ ಮೀರಿದ ಹಿರಿಯ ಪ್ರಯಾಣಿಕರಿಗೆ ೩೧ ಜಿಲ್ಲೆಗಳಾದ್ಯಂತ ಅನ್ವಯಿಸುತ್ತದೆ.",
      validity: "ಸದಾ ಲಭ್ಯ",
      bg: "from-[#059669] via-[#0B4F37] to-[#0A192F]"
    }
  ];

  const offers = language === 'kn' ? offersKn : offersEn;

  const handleApplyOffer = (code) => {
    try {
      navigator.clipboard.writeText(code);
    } catch {
      console.log('Copied');
    }
    setCopiedCode(code);
    setAppliedPromoCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MALENADU TRAVELS EXCLUSIVE PROMO DEALS</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {language === 'kn' ? 'ವಿಶೇಷ ಕೊಡುಗೆಗಳು & ಪ್ರೋಮೋ ಕೋಡ್‌ಗಳು' : 'Save Flat 15% On Every Malenadu Booking'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
            Apply these discount vouchers at checkout for instant price reductions on your Malenadu seat fare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-gradient-to-r ${off.bg} text-white shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden hover:scale-[1.01] transition-all border-2 border-white/20`}
            >
              <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4 pointer-events-none">
                <Percent className="w-48 h-48 text-amber-300" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-300 text-xs font-black inline-block mb-3 shadow-md">
                  {off.discount}
                </span>
                <h3 className="text-xl font-black text-white">{off.title}</h3>
                <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">{off.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-[11px] font-bold text-white/80">{off.validity}</span>
                
                <button
                  onClick={() => handleApplyOffer(off.code)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer border border-amber-200"
                >
                  {copiedCode === off.code || appliedPromoCode === off.code ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                  <span>{appliedPromoCode === off.code ? 'APPLIED ✓' : (copiedCode === off.code ? 'COPIED!' : off.code)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

