import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Bus, Navigation, ShieldCheck, RefreshCw } from 'lucide-react';

export default function VRLFeatureBar() {
  const { language } = useBooking();

  const features = [
    {
      icon: Bus,
      title: language === 'kn' ? '೫೦೦+ ಐಷಾರಾಮಿ ಮಲೆನಾಡು ಬಸ್‌ಗಳು' : '500+ Luxury Malenadu Fleet',
      desc: language === 'kn' ? 'ಐಷಾರಾಮಿ ಎಸಿ ಸ್ಲೀಪರ್ & ಎಕ್ಸಿಕ್ಯೂಟಿವ್ ಕೋಚ್‌ಗಳು' : 'AC Sleeper & Executive Coaches'
    },
    {
      icon: Navigation,
      title: language === 'kn' ? '೨೪x೭ ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್' : '24x7 Live GPS Bus Tracking',
      desc: language === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ತತ್ಕ್ಷಣದ ಬಸ್ ಲೊಕೇಶನ್ ಲಿಂಕ್' : 'Real-time live bus tracking link via SMS & WhatsApp'
    },
    {
      icon: ShieldCheck,
      title: language === 'kn' ? 'ಉಚಿತ ಪ್ರಯಾಣ ವಿಮೆ' : 'Free Travel Insurance',
      desc: language === 'kn' ? 'ಪ್ರತಿ ಟಿಕೆಟ್ ಜೊತೆಗೆ ₹೫ ಲಕ್ಷ ಪೂರ್ಣ ರಕ್ಷಣೆ' : 'Complementary ₹5 Lakh insurance cover per passenger'
    },
    {
      icon: RefreshCw,
      title: language === 'kn' ? '೧೦೦% ಫ್ಲೆಕ್ಸಿ ರದ್ಧತಿ' : '100% Flexi Cancellation',
      desc: language === 'kn' ? '೨೪ ಗಂಟೆಗಳ ಮೊದಲು ಶೂನ್ಯ ದಂಡದ ಮರುಪಾವತಿ' : 'Zero penalty refund up to 24h before departure'
    }
  ];

  return (
    <section className="bg-slate-100 dark:bg-slate-950 border-y-2 border-emerald-500/50 py-8 relative overflow-hidden text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex items-center space-x-4 shadow-md group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B4F37] to-[#059669] flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

