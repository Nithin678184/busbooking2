import React from 'react';
import { useBooking } from '../context/BookingContext';
import TicketApprovalTimer from './TicketApprovalTimer';
import { User, Ticket, Wallet, Calendar, MapPin, Bus, Clock, ShieldCheck, LogIn, Lock } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, userBookings, walletBalance, openAuthModal, setCurrentView, setActiveTicket, cancelUserTicket, language } = useBooking();

  // If user is NOT logged in, show Login Required Prompt
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20 shadow-inner">
            <Lock className="w-10 h-10 text-[#00C896]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Sign In Required
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Please sign in to your Malenadu Travels account to view your confirmed ticket bookings, wallet balance, and journey history.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] text-white font-black text-sm shadow-xl shadow-blue-500/25 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5 text-emerald-300" />
              <span>Login / Register Account</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings belonging strictly to the currently logged-in user account
  const displayBookings = React.useMemo(() => {
    if (!currentUser || !userBookings) return [];
    const userMobile = (currentUser.mobile || '').replace(/\D/g, '');
    const userEmail = (currentUser.email || '').toLowerCase().trim();

    return userBookings.filter(b => {
      const bMobile = (b.mobile || b.userMobile || '').replace(/\D/g, '');
      const bEmail = (b.email || b.userEmail || '').toLowerCase().trim();
      
      const mobileMatch = Boolean(userMobile && bMobile && bMobile === userMobile);
      const emailMatch = Boolean(userEmail && bEmail && bEmail === userEmail);
      
      return mobileMatch || emailMatch;
    });
  }, [userBookings, currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile & Wallet Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#0B4F37] via-[#059669] to-[#047857] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-2xl text-white shadow-md">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{currentUser.name}</h1>
            <p className="text-xs text-slate-200 font-semibold mt-1">
              {currentUser.mobile} • {currentUser.email}
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
              Verified Traveler
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>My Ticket Bookings ({displayBookings.length})</span>
        </h2>
      </div>

      {/* Bookings List */}
      {displayBookings.length > 0 ? (
        <div className="space-y-4">
          {displayBookings.map((booking, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center space-x-2 gap-y-1">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">PNR: {booking.pnr}</span>
                  <TicketApprovalTimer autoApproveAt={booking.autoApproveAt} status={booking.status} />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">{booking.busName}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {booking.from} ➔ {booking.to} • {booking.journeyDate} ({booking.departureTime})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400">Amount Paid</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">₹{booking.amountPaid}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTicket(booking);
                      setCurrentView('ticket-confirmation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#0F4C81] hover:bg-[#0B3A64] text-white text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
                  >
                    <Ticket className="w-4 h-4 text-emerald-300" />
                    <span>{language === 'kn' ? 'ಟಿಕೆಟ್ ವೀಕ್ಷಿಸಿ / ಪಿಡಿಎಫ್' : 'View E-Ticket / PDF'}</span>
                  </button>

                  {!(booking.status || '').toLowerCase().includes('cancel') && !(booking.status || '').toLowerCase().includes('reject') && (
                    <button
                      onClick={() => {
                        if (cancelUserTicket) {
                          cancelUserTicket(booking.pnr || booking.bookingId);
                        }
                      }}
                      className="px-3.5 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-black border border-red-500/30 transition-all cursor-pointer shrink-0"
                    >
                      {language === 'kn' ? 'ರದ್ದುಗೊಳಿಸಿ' : 'Cancel Ticket'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 max-w-lg mx-auto space-y-4">
          <Ticket className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No Booked Tickets Yet</h3>
          <p className="text-xs text-slate-500 font-semibold">
            You haven't booked any bus tickets yet. Search routes to book your first Malenadu Travels luxury journey!
          </p>
          <button
            onClick={() => setCurrentView('search-results')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] text-white font-black text-xs shadow-lg hover:scale-105 transition-all"
          >
            Search & Book Tickets
          </button>
        </div>
      )}

    </div>
  );
}
