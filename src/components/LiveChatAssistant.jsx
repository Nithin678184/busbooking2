import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { karnatakaLocations } from '../data/karnatakaLocations';
import { 
  MessageCircle, Send, Bot, User, CheckCircle2, AlertCircle, 
  PhoneCall, Ticket, MapPin, RotateCcw, Sparkles, Search, Tag, ArrowRight, ShieldCheck
} from 'lucide-react';

const SAMPLE_DEMO_BOOKINGS = [
  {
    pnr: 'MLN-884920',
    bookingId: 'MLN-884920',
    from: 'Bengaluru (Bangalore)',
    to: 'Shivamogga (Shimoga)',
    busName: 'Malenadu Airavat Dream Sleeper',
    date: new Date().toISOString().split('T')[0],
    time: '22:30',
    seats: ['L4', 'L5'],
    totalAmount: 1750,
    status: 'Confirmed (Admin Approved)',
    passengerName: 'Nithin Kumar'
  },
  {
    pnr: 'MLN-920145',
    bookingId: 'MLN-920145',
    from: 'Bengaluru (Bangalore)',
    to: 'Madikeri (Coorg)',
    busName: 'Malenadu Greenline Electric Luxury (EV)',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    seats: ['S12'],
    totalAmount: 950,
    status: 'Confirmed (Auto-Approved)',
    passengerName: 'Passenger User'
  }
];

export default function LiveChatAssistant({ isCompact = false }) {
  const { 
    language, userBookings, customAdminBuses, setSearchQuery, 
    setCurrentView, setActiveTicket, currentUser 
  } = useBooking();

  const [chatLogs, setChatLogs] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: language === 'kn' 
        ? 'ನಮಸ್ಕಾರ! ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ 24x7 ಬೆಂಬಲ ಸೇವೆಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಪ್ರಯಾಣಕ್ಕೆ ನಾನು ಹೇಗೆ ನೆರವಾಗಲಿ?' 
        : 'Namaskara! Welcome to Malenadu Travels 24x7 Support. How can I assist your Karnataka journey today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'welcome'
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botMode, setBotMode] = useState('normal'); // 'normal' | 'awaiting_pnr' | 'awaiting_phone'
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs, isTyping]);

  // Quick Chips options
  const quickPrompts = [
    { label: language === 'kn' ? '🔍 PNR ತಪಾಸಣೆ' : '🔍 Check PNR Status', query: 'Check my PNR status' },
    { label: language === 'kn' ? '🚌 ಬೆಂಗಳೂರು → ಶಿವಮೊಗ್ಗ ಬಸ್' : '🚌 Bengaluru → Shivamogga Buses', query: 'Show buses from Bengaluru to Shivamogga' },
    { label: language === 'kn' ? '💰 ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿ' : '💰 Cancellation & Refund Policy', query: 'What is the cancellation and refund policy?' },
    { label: language === 'kn' ? '📞 ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿ' : '📞 Request Call Back', query: 'I want a support agent to call me' },
    { label: language === 'kn' ? '🏷️ ರಿಯಾಯಿತಿ ಕೂಪನ್‌ಗಳು' : '🏷️ Offers & Promo Codes', query: 'Show available promo codes' }
  ];

  // Helper to validate Phone number (10-digit Indian Mobile)
  const isValidPhoneNumber = (phoneStr) => {
    const cleanDigits = phoneStr.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleanDigits);
  };

  // Helper to validate PNR string format
  const isValidPnrFormat = (pnrStr) => {
    const clean = pnrStr.trim().toUpperCase();
    return clean.length >= 4 && /^[A-Z0-9-]+$/.test(clean);
  };

  const handleClearChat = () => {
    setChatLogs([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: language === 'kn' 
          ? 'ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' 
          : 'Chat history reset. How can I assist your bus journey today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setValidationError('');
    setBotMode('normal');
  };

  const processUserQuery = (userText) => {
    const cleanText = userText.trim();
    setValidationError('');

    // INPUT VALIDATION 1: Empty or Whitespace
    if (!cleanText) {
      setValidationError(
        language === 'kn'
          ? '⚠️ ದಯವಿಟ್ಟು ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ.'
          : '⚠️ Please enter a valid message or pick a quick option below.'
      );
      return;
    }

    // INPUT VALIDATION 2: Too short (single char spam)
    if (cleanText.length < 2 && !/^\d$/.test(cleanText)) {
      setValidationError(
        language === 'kn'
          ? '⚠️ ಸಂದೇಶವು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.'
          : '⚠️ Message must be at least 2 characters long.'
      );
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message to Chat Log
    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: timeStr
    };

    setChatLogs(prev => [...prev, userMsgObj]);
    setChatInput('');
    setIsTyping(true);

    // Bot Response Logic with artificial natural delay
    setTimeout(() => {
      let botResponseObj = null;
      const lowerText = cleanText.toLowerCase();

      // MODE 1: Awaiting Phone Number for Callback
      if (botMode === 'awaiting_phone' || lowerText.includes('call') || lowerText.includes('phone') || lowerText.includes('callback') || lowerText.includes('agent')) {
        const extractedDigits = cleanText.replace(/\D/g, '');

        if (extractedDigits.length >= 10 && isValidPhoneNumber(extractedDigits)) {
          const ticketId = `MN-SUP-${Math.floor(100000 + Math.random() * 900000)}`;
          
          // Save callback request into localStorage for admin tracking
          try {
            const savedCallbacks = JSON.parse(localStorage.getItem('malenadu_callback_requests') || '[]');
            savedCallbacks.unshift({
              ticketId,
              phone: extractedDigits,
              name: currentUser?.name || 'Passenger',
              requestedAt: new Date().toISOString(),
              status: 'Pending Executive Call'
            });
            localStorage.setItem('malenadu_callback_requests', JSON.stringify(savedCallbacks));
          } catch (e) {
            console.error(e);
          }

          setBotMode('normal');
          botResponseObj = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'kn'
              ? `✅ ದೂರವಾಣಿ ಸಂಖ್ಯೆ +91 ${extractedDigits} ಯಶಸ್ವಿಯಾಗಿ ನೊಂದಾಯಿಸಲಾಗಿದೆ! ಬೆಂಬಲ ಟಿಕೆಟ್ #${ticketId} ರಚಿಸಲಾಗಿದೆ. ನಮ್ಮ ಗ್ರಾಹಕ ಸೇವಾ ಪ್ರತಿನಿಧಿ 15 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲಿದ್ದಾರೆ.`
              : `✅ Call back successfully registered for +91 ${extractedDigits}! Support Ticket #${ticketId} created. Our 24x7 Malenadu helpline executive will call you within 15 minutes.`,
            type: 'callback_success',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        } else if (extractedDigits.length > 0 && !isValidPhoneNumber(extractedDigits)) {
          // Phone Validation Failure
          botResponseObj = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'kn'
              ? `⚠️ ಸಂಖ್ಯೆ ಸಿಂಧುವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಸರಿಯಾದ 10-ಅಂಕಿಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ: 9876543210).`
              : `⚠️ Invalid Phone Number format! Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210).`,
            type: 'validation_error',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setBotMode('awaiting_phone');
        } else {
          // Ask for Phone Number
          setBotMode('awaiting_phone');
          botResponseObj = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'kn'
              ? '📞 ನಮ್ಮ ಬೆಂಬಲ ಪ್ರತಿನಿಧಿ ನಿಮ್ಮನ್ನು ದೂರವಾಣಿ ಮೂಲಕ ಸಂಪರ್ಕಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.'
              : '📞 Sure! Please enter your 10-digit mobile number so our Karnataka helpline executive can call you back immediately.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      }

      // MODE 2: PNR Lookup / Check Booking
      else if (botMode === 'awaiting_pnr' || lowerText.includes('pnr') || lowerText.includes('booking status') || lowerText.includes('my ticket') || /mln-?\d+/i.test(cleanText)) {
        // Extract potential PNR string
        const pnrMatch = cleanText.match(/MLN-?[0-9]+/i) || cleanText.match(/[0-9]{4,10}/);
        const pnrQuery = pnrMatch ? pnrMatch[0].toUpperCase() : cleanText.toUpperCase();

        if (!isValidPnrFormat(pnrQuery)) {
          setBotMode('awaiting_pnr');
          botResponseObj = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'kn'
              ? '🔍 ದಯವಿಟ್ಟು ನಿಮ್ಮ ಟಿಕೆಟ್‌ನಲ್ಲಿರುವ PNR ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ: MLN-884920).'
              : '🔍 Please type your 8-digit PNR number to check live status (e.g. MLN-884920).',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        } else {
          // Search in real bookings context and demo bookings
          const allBookings = [...(userBookings || []), ...SAMPLE_DEMO_BOOKINGS];
          const found = allBookings.find(b => {
            const bId = (b.bookingId || b.pnr || '').toUpperCase();
            return bId.includes(pnrQuery) || pnrQuery.includes(bId.replace('MLN-', ''));
          });

          if (found) {
            setBotMode('normal');
            botResponseObj = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: language === 'kn'
                ? `✅ PNR ${found.bookingId || found.pnr} ದೊರೆತಿದೆ! ಮಾರ್ಗ: ${found.from} → ${found.to}. ಸ್ಥಿತಿ: ${found.status}`
                : `✅ Found Booking for PNR: ${found.bookingId || found.pnr}!`,
              type: 'pnr_card',
              data: found,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          } else {
            botResponseObj = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: language === 'kn'
                ? `❌ '${pnrQuery}' PNR ಸಂಖ್ಯೆಗೆ ಯಾವುದೇ ಬುಕಿಂಗ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಟಿಕೆಟ್ ಪರಿಶೀಲಿಸಿ.`
                : `❌ No active booking found for PNR '${pnrQuery}'. Please verify your PNR number or check your SMS confirmation message. Try demo PNR 'MLN-884920'.`,
              type: 'validation_error',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setBotMode('awaiting_pnr');
          }
        }
      }

      // MODE 3: Bus Route / Search Inquiry
      else if (
        lowerText.includes('bus') || lowerText.includes('route') || 
        lowerText.includes('bengaluru') || lowerText.includes('mysuru') || 
        lowerText.includes('shivamogga') || lowerText.includes('mangaluru') ||
        lowerText.includes('coorg') || lowerText.includes('madikeri') ||
        lowerText.includes('gokarna') || lowerText.includes('hampi') || lowerText.includes('udupi')
      ) {
        // Detect mentioned cities
        const matchedCities = karnatakaLocations.filter(loc => 
          lowerText.includes(loc.name.toLowerCase()) || 
          lowerText.includes(loc.nameKn.toLowerCase()) ||
          lowerText.includes(loc.id.toLowerCase())
        );

        let fromLoc = matchedCities[0] || karnatakaLocations.find(l => l.id === 'blr_city') || karnatakaLocations[0];
        let toLoc = matchedCities[1] || karnatakaLocations.find(l => l.id === 'smg_city') || karnatakaLocations[1];

        if (fromLoc.id === toLoc.id) {
          toLoc = karnatakaLocations.find(l => l.id === 'mys_city') || karnatakaLocations[1];
        }

        // Available Buses
        const buses = customAdminBuses && customAdminBuses.length > 0 
          ? customAdminBuses 
          : [
              {
                id: 'BUS-DEMO-1',
                busNumber: 'KA-14-MN-9900',
                operatorName: 'Malenadu Volvo Multi-Axle',
                busType: 'AC Sleeper Volvo',
                departureTime: '22:00',
                arrivalTime: '05:30',
                price: 950,
                rating: 4.9,
                fromCity: fromLoc.name,
                toCity: toLoc.name
              },
              {
                id: 'BUS-DEMO-2',
                busNumber: 'KA-19-MN-4521',
                operatorName: 'Malenadu Greenline EV Luxury',
                busType: 'Electric AC Seater',
                departureTime: '14:30',
                arrivalTime: '21:00',
                price: 780,
                rating: 4.8,
                fromCity: fromLoc.name,
                toCity: toLoc.name
              }
            ];

        botResponseObj = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'kn'
            ? `🚌 ${fromLoc.nameKn} ದಿಂದ ${toLoc.nameKn} ಗೆ ಲಭ್ಯವಿರುವ ಮಲೆನಾಡು ಬಸ್‌ಗಳು:`
            : `🚌 Direct Malenadu Travels buses found from ${fromLoc.name} to ${toLoc.name}:`,
          type: 'bus_cards',
          data: {
            from: fromLoc,
            to: toLoc,
            buses: buses.slice(0, 2)
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      // MODE 4: Cancellation & Refund Policy
      else if (lowerText.includes('cancel') || lowerText.includes('refund') || lowerText.includes('policy')) {
        botResponseObj = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'kn'
            ? '💰 **ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿ ನೀತಿ:**\n• ಪ್ರಯಾಣದ 24 ಗಂಟೆಗಳ ಮೊದಲು ರದ್ದುಗೊಳಿಸಿದರೆ 100% ಪೂರ್ಣ ಮರುಪಾವತಿ ലഭಿಸುತ್ತದೆ.\n• 12 - 24 ಗಂಟೆಗಳ ಮೊದಲು: 80% ಮರುಪಾವತಿ.\n• 12 ಗಂಟೆಗಿಂತ ಕಡಿಮೆ: 50% ಮರುಪಾವತಿ.\nಮರುಪಾವತಿ ಮೊತ್ತವನ್ನು ನಿಮ್ಮ ಮಲೆನಾಡು ಇ-ವ್ಯಾಲೆಟ್‌ಗೆ ತಕ್ಷಣವೇ ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ.'
            : '💰 **Malenadu Travels Cancellation & Instant Refund Policy:**\n• Cancellation > 24 hrs before departure: **100% Instant Refund**\n• 12 - 24 hrs before departure: **80% Refund**\n• < 12 hrs before departure: **50% Refund**\nRefunds are processed instantly to your original payment method or Malenadu E-Wallet.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      // MODE 5: Offers & Discount Coupons
      else if (lowerText.includes('offer') || lowerText.includes('coupon') || lowerText.includes('code') || lowerText.includes('discount')) {
        botResponseObj = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'kn'
            ? '🎉 **ಸಕ್ರಿಯ ಕೊಡುಗೆಗಳು & ಪ್ರೋಮೋ ಕೋಡ್‌ಗಳು:**\n1. `MALENADU10` - 10% ತ್ವರಿತ ರಿಯಾಯಿತಿ\n2. `SENIOR15` - ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ 15% ರಿಯಾಯಿತಿ\n3. `STUDENT10` - ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 10% ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್\n4. `EVGREEN` - ಇವಿ ಬಸ್‌ಗಳಲ್ಲಿ ₹100 ರಿಯಾಯಿತಿ'
            : '🎉 **Active Promo Codes for Malenadu Bus Tickets:**\n• **`MALENADU10`**: Get 10% Flat Discount on all Volvo & Sleeper routes.\n• **`SENIOR15`**: 15% instant discount for Senior Citizens (60+ yrs).\n• **`STUDENT10`**: 10% Cashback for college students.\n• **`EVGREEN`**: Flat ₹100 Off on Greenline EV Luxury buses.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      // MODE 6: Default Helpful Bot Response
      else {
        botResponseObj = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'kn'
            ? `ನಿಮ್ಮ ಪ್ರಶ್ನೆ: "${cleanText}" ಪಡೆಯಲಾಗಿದೆ. ನಿಮಗೆ ತಕ್ಷಣವೇ ಸಹಾಯ ಮಾಡಲು ದಯವಿಟ್ಟು ಕೆಳಗಿನ ನೀಡಿರುವ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ:`
            : `I understood your query about "${cleanText}". How would you like me to assist you? Please choose a quick option below or type PNR number/phone number:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setIsTyping(false);
      setChatLogs(prev => [...prev, botResponseObj]);
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    processUserQuery(chatInput);
  };

  const handleQuickChipClick = (query) => {
    processUserQuery(query);
  };

  const handleBookBusFromChat = (fromObj, toObj) => {
    setSearchQuery(prev => ({
      ...prev,
      from: fromObj,
      to: toObj
    }));
    setCurrentView('search-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTicketFromChat = (booking) => {
    setActiveTicket(booking);
    setCurrentView('ticket-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden ${isCompact ? 'h-[480px]' : 'h-[520px]'}`}>
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F4C81] to-[#00C896] p-0.5 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-white">{language === 'kn' ? 'ಲೈವ್ ಬೆಂಬಲ ಸಹಾಯಕ' : 'Live Support Assistant'}</h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                {language === 'kn' ? '೨೪x೭ ಸಕ್ರಿಯ' : '24x7 Online'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">{language === 'kn' ? 'ತತ್ಕ್ಷಣದ ಎಐ ಮತ್ತು ಕಂಡಕ್ಟರ್ ಸಹಾಯವಾಣಿ' : 'Instant AI & Conductor Helpdesk'}</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reset / Clear Chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages Log Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium">
        {chatLogs.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start space-x-2 max-w-[90%] sm:max-w-[85%]">
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-emerald-600/20 dark:bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none font-bold shadow-md'
                    : msg.type === 'validation_error'
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-bl-none font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none font-semibold shadow-sm'
                }`}
              >
                {/* Text Message */}
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Rich Component: PNR Ticket Card inside Chat */}
                {msg.type === 'pnr_card' && msg.data && (
                  <div className="mt-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-500/40 space-y-2 text-[11px] text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>PNR: {msg.data.pnr || msg.data.bookingId}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {msg.data.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 font-bold">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Route</span>
                        <span>{msg.data.from} → {msg.data.to}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Bus</span>
                        <span className="truncate block">{msg.data.busName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Seats</span>
                        <span>{Array.isArray(msg.data.seats) ? msg.data.seats.join(', ') : msg.data.seats}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Amount</span>
                        <span className="text-emerald-600 dark:text-emerald-400">₹{msg.data.totalAmount || msg.data.fare || 950}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewTicketFromChat(msg.data)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-center flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Full E-Ticket</span>
                    </button>
                  </div>
                )}

                {/* Rich Component: Bus Cards inside Chat */}
                {msg.type === 'bus_cards' && msg.data && (
                  <div className="mt-3 space-y-2">
                    {msg.data.buses.map((b, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100">{b.operatorName}</p>
                          <p className="text-[10px] text-slate-500">{b.departureTime} • {b.busType}</p>
                          <p className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{b.price} per seat</p>
                        </div>
                        <button
                          onClick={() => handleBookBusFromChat(msg.data.from, msg.data.to)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-lg text-[10px] flex items-center space-x-1 shadow-sm transition-all cursor-pointer shrink-0"
                        >
                          <span>Select Seats</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <span className="text-[9px] text-slate-400 font-semibold px-2 mt-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Animated Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Validation Error Banner above Input */}
      {validationError && (
        <div className="px-4 py-1.5 bg-red-100 dark:bg-red-950/80 border-t border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-[11px] font-black flex items-center justify-between shrink-0 animate-in fade-in duration-150">
          <span className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </span>
          <button 
            onClick={() => setValidationError('')}
            className="text-xs font-bold text-red-500 hover:text-red-700 ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Form Footer */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
        <div className="flex-1 relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => {
              setChatInput(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={
              botMode === 'awaiting_phone'
                ? 'Enter 10-digit mobile number...'
                : botMode === 'awaiting_pnr'
                ? 'Enter PNR e.g. MLN-884920...'
                : language === 'kn' ? 'ಪ್ರಶ್ನೆ ಅಥವಾ PNR ನಮೂದಿಸಿ...' : 'Ask about booking, route, or PNR...'
            }
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 placeholder:text-slate-400 transition-colors"
          />
          {chatInput.trim().length > 0 && (
            <span className="absolute right-2.5 top-2.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-gradient-to-r from-[#0F4C81] via-[#2196F3] to-[#00C896] hover:opacity-90 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
