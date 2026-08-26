import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Bus, Globe, Sun, Moon, User, Compass, Ticket, Menu, X, PhoneCall, ShieldCheck, LogIn, LogOut, ChevronDown, Home, Search
} from 'lucide-react';

export default function Navbar() {
  const { 
    language, setLanguage, t, darkMode, setDarkMode, 
    currentView, setCurrentView, openAuthModal, 
    userRole, currentUser, logout, effectiveDevice, deviceMode 
  } = useBooking();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Bus, mobileIcon: Home },
    { id: 'search-results', label: t.nav.bookTicket, icon: Ticket, mobileIcon: Search },
    { id: 'tourism', label: t.nav.destinations, icon: Compass, mobileIcon: Compass },
    { id: 'my-bookings', label: t.nav.myBookings, icon: Ticket, mobileIcon: Ticket },
    { id: 'help', label: t.nav.help, icon: PhoneCall, mobileIcon: PhoneCall },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#0B4F37] via-[#0F4C81] to-[#0B4F37] text-white border-b-2 border-amber-400 shadow-xl sticky top-0 z-50">
        <div className="w-full max-w-[1500px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4 overflow-hidden">
            
            {/* Brand Logo & Name */}
            <div 
              className="flex items-center space-x-1.5 sm:space-x-2.5 cursor-pointer group shrink min-w-0"
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0 border-2 border-amber-400 flex items-center justify-center">
                <img 
                  src="/malenadu_circle_logo.jpg" 
                  alt="Malenadu Travels Logo" 
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform block"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-[#0B4F37] rounded-lg flex items-center justify-center hidden">
                  <Bus className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span className="font-black text-xs xs:text-sm sm:text-xl xl:text-2xl tracking-tight text-white font-display leading-none drop-shadow-sm truncate">
                  {language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್' : 'MALENADU TRAVELS'}
                </span>
                <span className="text-[7px] xs:text-[8px] sm:text-[10px] text-amber-300 font-black tracking-wider uppercase mt-0.5 sm:mt-1 leading-none truncate">
                  {effectiveDevice === 'mobile' ? 'KARNATAKA FLEET' : (language === 'kn' ? 'ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್' : 'MALENADU TRAVELS PRIVATE LIMITED')}
                </span>
              </div>
            </div>

            {/* Desktop / Tablet Center Navigation Links */}
            {userRole === 'admin' ? (
              <div className="hidden md:flex items-center space-x-2 bg-emerald-950/90 h-10 px-4 rounded-xl border-2 border-amber-400 text-amber-300 text-xs font-black shadow-lg">
                <ShieldCheck className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Malenadu Fleet Operator Control Center</span>
              </div>
            ) : (
              effectiveDevice !== 'mobile' && (
                <nav className="hidden md:flex items-center bg-emerald-950/70 p-1 rounded-xl border border-emerald-400/30 backdrop-blur-md shadow-inner mx-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = currentView === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => { setCurrentView(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer h-9 shrink-0 ${
                          isActive 
                            ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                            : 'text-white hover:text-amber-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-950' : 'text-amber-300'}`} />
                        <span className="whitespace-nowrap">{link.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )
            )}

            {/* Right Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
                className="flex items-center space-x-1 px-1.5 sm:px-3 h-8 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer font-black text-[11px] sm:text-xs border border-white/20 shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20 flex items-center justify-center shrink-0"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
              </button>

              {userRole === 'admin' ? (
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-1.5 h-8 sm:h-10 px-2.5 sm:px-4 rounded-xl bg-black hover:bg-slate-900 text-white text-[11px] sm:text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer border border-amber-400 shrink-0"
                >
                  <LogOut className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Logout Admin</span>
                </button>
              ) : currentUser ? (
                <div className="relative shrink-0" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 h-8 sm:h-10 px-2.5 sm:px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black shadow-md hover:scale-105 transition-all cursor-pointer shrink-0"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-slate-950" />
                    </div>
                    <span className="whitespace-nowrap max-w-[60px] sm:max-w-none truncate">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border-2 border-emerald-600 shadow-2xl p-3 space-y-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-black text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => { setCurrentView('my-bookings'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-emerald-600" />
                        <span>{t.nav.myBookings}</span>
                      </button>

                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-black text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{language === 'kn' ? 'ನಿರ್ಗಮಿಸಿ (ಸೈನ್ ಔಟ್)' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-1 sm:space-x-1.5 h-8 sm:h-10 px-2.5 sm:px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer border border-white/40 justify-center shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'kn' ? 'ಲಾಗಿನ್' : 'Login'}</span>
                </button>
              )}

              {/* Mobile Drawer Trigger Toggle (For Tablet/Fallback) */}
              {effectiveDevice !== 'mobile' && (
                <div className="flex md:hidden items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-xl text-white hover:bg-emerald-800/60"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Tablet Fallback Menu */}
        {mobileMenuOpen && effectiveDevice !== 'mobile' && (
          <div className="md:hidden border-t border-emerald-800 bg-[#0B4F37] px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-300 shadow-2xl text-white">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-sm font-black transition-all ${
                    isActive 
                      ? 'bg-amber-400 text-slate-950 shadow-md' 
                      : 'text-white hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-amber-300" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM APP NAVIGATION DOCK (Shown ONLY in Mobile UI view) */}
      {effectiveDevice === 'mobile' && userRole !== 'admin' && (
        <nav className={`fixed bottom-0 z-50 bg-[#0B4F37]/95 dark:bg-slate-950/95 border-t-2 border-amber-400 backdrop-blur-xl px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.3)] ${
          deviceMode === 'mobile' 
            ? 'left-1/2 -translate-x-1/2 w-full max-w-[440px] rounded-b-3xl' 
            : 'left-0 right-0'
        }`}>
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navLinks.map((link) => {
              const Icon = link.mobileIcon || link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 scale-105 shadow-lg font-black'
                      : 'text-white/80 hover:text-amber-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-slate-950' : 'text-amber-300'}`} />
                  <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5 tracking-tight whitespace-nowrap">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
