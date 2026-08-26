import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import MovingTickerBanner from './components/MovingTickerBanner';
import HeroSection from './components/HeroSection';
import OffersSection from './components/OffersSection';
import BusSearchResults from './components/BusSearchResults';
import SeatSelector from './components/SeatSelector';
import PassengerDetails from './components/PassengerDetails';
import PaymentModal from './components/PaymentModal';
import TicketConfirmation from './components/TicketConfirmation';
import TourismSection from './components/TourismSection';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AdminSecretModal from './components/AdminSecretModal';
import FloatingChatWidget from './components/FloatingChatWidget';

function MainContent() {
  const { currentView, userRole, isLoginModalOpen, setIsLoginModalOpen, isAdminSecretModalOpen, setIsAdminSecretModalOpen } = useBooking();

  if (userRole === 'admin') {
    return (
      <main className="min-h-screen relative p-4 sm:p-6 lg:p-8">
        <AdminDashboard />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Dynamic Colorful Ambient Lighting Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/20 to-amber-500/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-amber-400/20 blur-[140px]" />
        <div className="absolute top-2/3 -left-40 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-tr from-emerald-700/15 to-teal-500/15 blur-[130px]" />
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <AdminSecretModal isOpen={isAdminSecretModalOpen} onClose={() => setIsAdminSecretModalOpen(false)} />

      <div className="relative z-10">
        {(currentView === 'home' || currentView === 'search-results') && (
          <>
            <HeroSection />
            {currentView === 'search-results' && (
              <div id="search-results-section">
                <BusSearchResults />
              </div>
            )}
            <OffersSection />
            <TourismSection />
            <HelpCenter />
          </>
        )}
        {currentView === 'seat-selection' && <SeatSelector />}
        {currentView === 'passenger-details' && <PassengerDetails />}
        {currentView === 'payment' && <PaymentModal />}
        {currentView === 'ticket-confirmation' && <TicketConfirmation />}
        {currentView === 'tourism' && <TourismSection />}
        {currentView === 'my-bookings' && <UserDashboard />}
        {currentView === 'help' && <HelpCenter />}
        {currentView === 'admin' && <AdminDashboard />}
      </div>
    </main>
  );
}

function AppContent() {
  const { userRole, deviceMode } = useBooking();

  // Container styling for simulated device frame when manually toggled
  const getDeviceFrameClass = () => {
    if (deviceMode === 'mobile') return 'max-w-[440px] mx-auto shadow-2xl border-x-4 border-amber-400/60 my-2 rounded-3xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-950 relative min-h-screen';
    if (deviceMode === 'tablet') return 'max-w-[850px] mx-auto shadow-2xl border-x-4 border-amber-400/60 my-2 rounded-3xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-950 relative min-h-screen';
    return 'w-full bg-slate-50 dark:bg-slate-950';
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 bg-slate-950">
      <div className={getDeviceFrameClass()}>
        <Navbar />
        {userRole !== 'admin' && <MovingTickerBanner />}
        <MainContent />
        {userRole !== 'admin' && <Footer />}
        <FloatingChatWidget />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
