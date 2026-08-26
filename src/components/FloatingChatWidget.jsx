import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import LiveChatAssistant from './LiveChatAssistant';
import { useBooking } from '../context/BookingContext';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole, effectiveDevice } = useBooking();

  // Hide floating widget if in admin mode
  if (userRole === 'admin') return null;

  const isMobileView = effectiveDevice === 'mobile';

  return (
    <div className={`fixed z-50 flex flex-col items-end transition-all duration-300 ${
      isMobileView ? 'bottom-20 right-4' : 'bottom-6 right-6'
    }`}>
      
      {/* Floating Assistant Popover */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm sm:w-96 shadow-2xl rounded-3xl animate-in slide-in-from-bottom duration-300">
          <div className="relative">
            <LiveChatAssistant isCompact={true} />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] text-white shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-emerald-400"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </div>
        <span className="font-black text-xs hidden sm:inline tracking-tight">
          {isOpen ? 'Close Support' : 'Live Support 24x7'}
        </span>
      </button>

    </div>
  );
}
