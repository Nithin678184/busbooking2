import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Bus, Phone, Mail, MapPin, Heart, ShieldCheck, CreditCard } from 'lucide-react';

export default function Footer() {
  const { language, t, setCurrentView, openAdminSecretModal, effectiveDevice } = useBooking();

  return (
    <footer className={`bg-slate-950 text-white pt-12 sm:pt-16 border-t-4 border-[#0B4F37] transition-colors duration-300 ${
      effectiveDevice === 'mobile' ? 'pb-28' : 'pb-12'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Top Malenadu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-0.5 shadow-md overflow-hidden shrink-0 border-2 border-amber-400">
                <img
                  src="/malenadu_circle_logo.jpg"
                  alt="Malenadu Travels Circular Logo"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="font-black text-2xl tracking-tight text-white font-display">
                {language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್' : 'MALENADU TRAVELS'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-semibold leading-relaxed max-w-md">
              {language === 'kn' 
                ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಖಾಸಗಿ ಐಷಾರಾಮಿ ಬಸ್ ಸಂಸ್ಥೆಯಾಗಿದ್ದು, ೩೧ ಜಿಲ್ಲೆಗಳಾದ್ಯಂತ ಸುರಕ್ಷಿತ, ಸುಗಮ ಮತ್ತು ಸರಿಯಾದ ಸಮಯದ ಬಸ್ ಸೇವೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ.'
                : "Malenadu Travels Private Limited is Karnataka's premier private luxury bus operator, offering safe, smooth, and punctual bus service across all 31 districts of Karnataka and national highways."
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li>
                <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('search-results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
                  {t.nav.bookTicket}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('tourism'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
                  {t.nav.destinations}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
                  {t.nav.help}
                </button>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="space-y-3">
            <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider">{t.footer.contactInfo}</h4>
            <div className="space-y-2 text-xs font-bold text-slate-300">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>8310593251</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@malenadutravels.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಹೆಡ್ ಆಫೀಸ್, ಶಿವಮೊಗ್ಗ' : 'Malenadu Travels Head Office, Shivamogga, Karnataka'}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <p>{language === 'kn' ? '© ೨೦೨೬ ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' : '© 2026 Malenadu Travels Private Limited. All Rights Reserved.'}</p>

          {/* Secret Admin Button at the End of the Website */}
          <button
            type="button"
            onClick={openAdminSecretModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 text-[11px] font-black border border-emerald-700 transition-all cursor-pointer group shadow-sm"
            title="Secret Fleet Admin Portal Access"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
            <span>{language === 'kn' ? '🔐 ರಹಸ್ಯ ಅಡ್ಮಿನ್ ಪೋರ್ಟಲ್' : '🔐 Secret Admin Portal'}</span>
          </button>

          <div className="flex items-center space-x-1">
            <span>{language === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರತಿ ಮೂಲೆಯನ್ನೂ ಸಂಪರ್ಕಿಸುತ್ತದೆ' : 'Connecting Every Corner Of Karnataka'}</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
