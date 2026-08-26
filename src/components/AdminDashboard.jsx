import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import TicketApprovalTimer from './TicketApprovalTimer';
import { 
  ShieldCheck, Plus, Trash2, Bus, QrCode, Upload, Check, Copy, Sparkles, CheckCircle2, Clock, AlertCircle, Eye, Ticket, XCircle, Zap, Lock, Calendar, MessageSquare, Bot, Send
} from 'lucide-react';
import { karnatakaLocations } from '../data/karnatakaLocations';
import { malenaduFleetCategories, formatJourneyDate, calculateDuration } from '../data/busRoutesData';

// Intelligent Natural Language Parser for Bulk Bus Scheduling Prompts
export function parseBulkBusPrompt(promptText) {
  const text = promptText.toLowerCase();

  // 1. Detect Fleet Type
  let busType = 'Normal Seating Bus';
  let operatorName = 'Malenadu Sarige (Normal Seating Bus)';
  let operatorLogo = '🚍';
  let isAc = false;
  let isSleeper = false;

  if (text.includes('airavat') || text.includes('semi sleeper ac')) {
    busType = 'Semi Sleeper AC';
    operatorName = 'Malenadu Airavat (Semi Sleeper AC)';
    operatorLogo = '🛋️';
    isAc = true;
  } else if (text.includes('rajahamsa') || text.includes('semi sleeper non ac')) {
    busType = 'Semi Sleeper Non AC';
    operatorName = 'Malenadu Rajahamsa (Semi Sleeper Non AC)';
    operatorLogo = '🚌';
  } else if (text.includes('night queen') || text.includes('sleeper non ac')) {
    busType = 'Sleeper Non AC';
    operatorName = 'Malenadu Night Queen (Sleeper Non AC)';
    operatorLogo = '🛏️';
    isSleeper = true;
  } else if (text.includes('volvo') || text.includes('sleeper ac')) {
    busType = 'Sleeper AC';
    operatorName = 'Malenadu Volvo Multi-Axle (Sleeper AC)';
    operatorLogo = '👑';
    isAc = true;
    isSleeper = true;
  }

  // 2. Detect Bus Registration Numbers (e.g. KA-01-MN-1001, KA-04-MN-9999)
  const busNumbers = [];
  const regMatches = promptText.match(/KA-\d{2}-[A-Z]{1,2}-\d{4}/gi);
  if (regMatches && regMatches.length > 0) {
    regMatches.forEach(no => busNumbers.push(no.toUpperCase()));
  }

  // 3. Detect Count (e.g., "5 buses", "add 10", "3 sarige")
  let count = busNumbers.length > 0 ? busNumbers.length : 1;
  const countMatch = text.match(/(\d+)\s*(buses|bus|fleet|sarige|airavat|rajahamsa|volvo|night queen)?/i);
  if (countMatch && parseInt(countMatch[1]) > 0 && parseInt(countMatch[1]) <= 50) {
    count = Math.max(count, parseInt(countMatch[1]));
  }

  // 4. Detect Price / Fare (e.g. "price 1100", "fare 450", "₹950")
  let price = 950;
  const priceMatch = text.match(/(₹|fare|price|rs\.?)\s*:?\s*(\d{3,5})/i) || text.match(/(\d{3,5})\s*(₹|rs|fare|price)/i);
  if (priceMatch) {
    price = parseInt(priceMatch[2] || priceMatch[1]);
  }

  // 5. Detect Travel Date (e.g. 2026-08-25, 25-08-2026, tomorrow)
  let travelDate = new Date().toISOString().split('T')[0];
  const isoDateMatch = text.match(/20\d{2}-\d{2}-\d{2}/);
  if (isoDateMatch) {
    travelDate = isoDateMatch[0];
  } else if (text.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    travelDate = d.toISOString().split('T')[0];
  }

  // 6. Detect Departure & Arrival Times (e.g. "21:30", "05:30")
  let departureTime = '21:30';
  let arrivalTime = '05:30';
  const times = text.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/g);
  if (times && times.length > 0) {
    departureTime = times[0];
    if (times.length > 1) {
      arrivalTime = times[1];
    }
  }

  // 7. Detect Cities (From & To)
  let fromCity = 'Bengaluru';
  let toCity = 'Kottigehara';

  const citiesInText = [];
  karnatakaLocations.forEach(loc => {
    if (text.includes(loc.name.toLowerCase())) {
      citiesInText.push(loc.name);
    }
  });

  if (citiesInText.length >= 2) {
    fromCity = citiesInText[0];
    toCity = citiesInText[1];
  } else if (citiesInText.length === 1) {
    toCity = citiesInText[0];
  }

  // Auto-generate missing bus registration numbers up to count
  while (busNumbers.length < count) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    busNumbers.push(`KA-01-MN-${randomNum}`);
  }

  // Generate Array of Bus Objects
  return busNumbers.map(busNo => ({
    operatorName,
    operatorLogo,
    busNumber: busNo,
    busType,
    category: 'Malenadu Express',
    fromCity,
    toCity,
    travelDate,
    departureTime,
    arrivalTime,
    duration: calculateDuration(departureTime, arrivalTime),
    price,
    totalSeats: isSleeper ? 32 : 46,
    isAc,
    isSleeper,
    isEv: false
  }));
}

export default function AdminDashboard() {
  const { 
    customAdminBuses, addNewBus, deleteBus, adminQrCodes, updatePersonalQrCode, 
    userBookings, approveTicket, rejectTicket, deleteTicket, deleteMultipleTickets, 
    userRole, loginAdmin, setCurrentView 
  } = useBooking();

  const [activeTab, setActiveTab] = useState('buses'); // 'buses' | 'ai-assistant' | 'approvals' | 'qrcodes'
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Ticket Approval Filter & Bulk Actions State
  const [ticketFilterType, setTicketFilterType] = useState('all'); // 'all' | 'pending' | 'approved' | 'cancelled'
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  // Admin Access Passcode Gatekeeper State
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for Adding Bus Fleet
  const [busForm, setBusForm] = useState({
    operatorName: 'Semi Sleeper AC',
    operatorLogo: '🛋️',
    busNumber: 'KA-01-MN-9999',
    busType: 'Semi Sleeper AC',
    category: 'Malenadu Express',
    fromCity: 'Bengaluru',
    toCity: 'Mangaluru',
    travelDate: new Date().toISOString().split('T')[0],
    departureTime: '21:30',
    arrivalTime: '05:30',
    duration: '8h 00m',
    price: 1100,
    totalSeats: 36,
    isAc: true,
    isSleeper: false,
    isEv: false
  });

  // Chatbot State for AI Bulk Bus Scheduling
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "👋 Hello Fleet Admin! I am your Malenadu AI Bus Assistant.\n\nYou can type natural language commands or paste bulk lists of long bus registration numbers, routes, travel dates, and fares. I will automatically parse and add all buses to your live schedule instantly!\n\nTry typing something like:\n• \"Schedule 5 Sarige buses KA-01-MN-1001 to KA-01-MN-1005 from Bengaluru to Kottigehara on 2026-08-25 at 21:30 price 450\"\n• \"Add Airavat bus KA-04-MN-8888 from Mysuru to Kottigehara on 2026-08-28 fare 1100\""
    }
  ]);

  // Current active QR from context
  const activeQr = (adminQrCodes && adminQrCodes.find(q => q.isActive)) || adminQrCodes?.[0];

  // Form State for Uploading Personal Admin QR Code
  const [personalQrForm, setPersonalQrForm] = useState({
    upiId: activeQr?.upiId || 'malenadutravels@upi',
    merchantName: activeQr?.merchantName || 'Malenadu Travels Private Limited',
    qrImageUrl: activeQr?.qrImageUrl || ''
  });

  // Filtered tickets list based on selected ticket type filter
  const filteredTickets = userBookings.filter(b => {
    const isPending = b.status === 'Pending Admin Approval' || b.status === 'Pending Approval';
    const isApproved = b.status === 'Confirmed' || b.status === 'Approved' || (b.status && b.status.includes('Approved'));
    const isCancelled = b.status === 'Cancelled' || b.status === 'Cancelled by Admin' || b.status === 'Rejected';

    if (ticketFilterType === 'pending') return isPending;
    if (ticketFilterType === 'approved') return isApproved;
    if (ticketFilterType === 'cancelled') return isCancelled;
    return true;
  });

  // Check if ALL currently filtered tickets are selected
  const allFilteredSelected = filteredTickets.length > 0 && filteredTickets.every(b => {
    const id = String(b.ticketId || b.bookingId || b.pnr);
    return selectedTicketIds.includes(id);
  });

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedTicketIds([]);
    } else {
      const allIds = filteredTickets.map(b => String(b.ticketId || b.bookingId || b.pnr));
      setSelectedTicketIds(allIds);
    }
  };

  const handleToggleSelectTicket = (id) => {
    const targetId = String(id);
    setSelectedTicketIds(prev => 
      prev.includes(targetId) ? prev.filter(i => i !== targetId) : [...prev, targetId]
    );
  };

  const handleDeleteSelectedTickets = () => {
    if (selectedTicketIds.length === 0) return;
    deleteMultipleTickets(selectedTicketIds);
    setSuccessMsg(`Deleted ${selectedTicketIds.length} selected ticket(s) permanently!`);
    setSelectedTicketIds([]);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleApproveSelectedTickets = () => {
    if (selectedTicketIds.length === 0) return;
    selectedTicketIds.forEach(id => approveTicket(id));
    setSuccessMsg(`Approved ${selectedTicketIds.length} selected ticket(s)!`);
    setSelectedTicketIds([]);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRejectSelectedTickets = () => {
    if (selectedTicketIds.length === 0) return;
    selectedTicketIds.forEach(id => rejectTicket(id));
    setSuccessMsg(`Rejected ${selectedTicketIds.length} selected ticket(s)!`);
    setSelectedTicketIds([]);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle single manual bus form submission
  const handleBusSubmit = (e) => {
    e.preventDefault();
    addNewBus(busForm);
    setSuccessMsg(`Bus ${busForm.busNumber} scheduled for ${busForm.travelDate} added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle AI Chatbot prompt submission
  const handleSendChat = (promptText) => {
    const query = promptText || chatInput;
    if (!query.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', time: userTime, text: query };
    
    // Parse bulk buses from AI prompt
    const parsedBuses = parseBulkBusPrompt(query);

    // Call addNewBus for each parsed bus
    parsedBuses.forEach(bus => addNewBus(bus));

    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const botMsg = {
      sender: 'bot',
      time: botTime,
      text: `✅ Successfully processed your AI command! Scheduled ${parsedBuses.length} bus service(s) into your live fleet database.`,
      addedBuses: parsedBuses
    };

    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setChatInput('');
    setSuccessMsg(`🤖 AI Chatbot scheduled ${parsedBuses.length} bus(es) successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePersonalQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalQrForm(prev => ({ ...prev, qrImageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalQrSubmit = (e) => {
    e.preventDefault();
    if (!personalQrForm.qrImageUrl) {
      alert('Please select and upload a Personal QR Code Image file first!');
      return;
    }
    updatePersonalQrCode({
      title: 'Admin Personal Payment QR Code',
      upiId: personalQrForm.upiId || 'malenadutravels@upi',
      merchantName: personalQrForm.merchantName || 'Malenadu Travels Private Limited',
      qrImageUrl: personalQrForm.qrImageUrl
    });
    setSuccessMsg('Personal QR Code uploaded and set live for passenger payments successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // If NOT logged in as Admin, show Restricted Admin Unlock Screen
  if (userRole !== 'admin') {
    const handleUnlock = (e) => {
      e.preventDefault();
      if (passcode.trim() === '2525252525') {
        loginAdmin('Malenadu Fleet Admin', 'admin@malenadutravels.com');
        setErrorMsg('');
      } else {
        setErrorMsg('Invalid passcode. Admin access denied.');
      }
    };

    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-slate-900 text-white rounded-3xl border-2 border-emerald-500/40 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black text-white">Admin Access Required</h2>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              This area is strictly restricted to Malenadu Travels Fleet Admins. Enter your secret passcode to gain access.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-1.5">Admin Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setErrorMsg(''); }}
                placeholder="Enter number"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white font-mono text-sm font-black focus:border-emerald-500 outline-none transition-all"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                ⚠️ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Unlock Fleet Admin Control Center
            </button>
          </form>

          <p className="text-[11px] text-slate-400 font-medium">
            Passcode: <span className="font-mono text-emerald-400 font-bold">2525252525</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Malenadu Fleet Operator Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Malenadu Fleet Operator Dashboard
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Manage buses, schedule routes, set travel dates, arrival/departure times, or use the AI Chatbot for bulk scheduling!
          </p>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex flex-wrap p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 gap-1">
          <button
            onClick={() => setActiveTab('buses')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'buses'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Bus Fleet ({customAdminBuses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ai-assistant'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-500'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>🤖 AI Bulk Bus Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Ticket Approvals ({userBookings.filter(b => b.status === 'Pending Admin Approval' || b.status === 'Pending Approval').length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcodes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'qrcodes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Upload Personal QR Code</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center space-x-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: BUS FLEET MANAGEMENT */}
      {activeTab === 'buses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Bus Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h2 className="font-black text-lg text-slate-900 dark:text-white">Add New Bus Service</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('ai-assistant')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-black flex items-center gap-1 hover:bg-purple-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Chatbot</span>
              </button>
            </div>

            <form onSubmit={handleBusSubmit} className="space-y-4">
              {/* FLEET SERVICE NAME */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Fleet Service Name</label>
                <select
                  value={busForm.operatorName}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Custom') {
                      setBusForm({ ...busForm, operatorName: 'Custom' });
                      return;
                    }
                    const catObj = malenaduFleetCategories.find(c => c.name === val) || malenaduFleetCategories[0];
                    setBusForm({
                      ...busForm,
                      operatorName: catObj.name,
                      operatorLogo: catObj.logo,
                      busType: catObj.busType,
                      isAc: catObj.isAc,
                      isSleeper: catObj.isSleeper
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                >
                  {malenaduFleetCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.logo} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ROUTE: FROM & TO */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">From City</label>
                  <select
                    value={busForm.fromCity}
                    onChange={(e) => setBusForm({ ...busForm, fromCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {karnatakaLocations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">To City</label>
                  <select
                    value={busForm.toCity}
                    onChange={(e) => setBusForm({ ...busForm, toCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {karnatakaLocations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TRAVEL DATE / BUS NUMBER */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={busForm.travelDate}
                    onChange={(e) => setBusForm({ ...busForm, travelDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Bus Number</label>
                  <input
                    type="text"
                    value={busForm.busNumber}
                    onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                    placeholder="KA-01-MN-9999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* PRICE / DEPARTURE TIME / ARRIVAL TIME */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={busForm.price}
                    onChange={(e) => setBusForm({ ...busForm, price: e.target.value })}
                    placeholder="950"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={busForm.departureTime}
                    onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })}
                    placeholder="21:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-1 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> Arrival Time
                  </label>
                  <input
                    type="text"
                    value={busForm.arrivalTime}
                    onChange={(e) => setBusForm({ ...busForm, arrivalTime: e.target.value })}
                    placeholder="05:30"
                    className="w-full px-3 py-2 rounded-xl border-2 border-emerald-500/60 bg-emerald-50/50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                + Schedule & Add Bus Fleet
              </button>
            </form>
          </div>

          {/* Active Buses List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Active Malenadu Buses ({customAdminBuses.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">Managed by Fleet Admin</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {customAdminBuses.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <Bus className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">No Buses Added Yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                    Fill out the form on the left or use the AI Chatbot to schedule your first bus fleet service!
                  </p>
                </div>
              ) : (
                customAdminBuses.map((bus) => (
                  <div key={bus.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{bus.operatorLogo}</span>
                        <h4 className="font-black text-slate-900 dark:text-white text-sm">{bus.operatorName}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{bus.busNumber}</span>
                      </div>

                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {bus.fromCity} ➔ {bus.toCity} • Departure: <span className="text-emerald-600 dark:text-emerald-400">{bus.departureTime}</span> • Arrival: <span className="text-teal-600 dark:text-teal-400">{bus.arrivalTime || '06:00'}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">Fare: ₹{bus.price}</span>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Scheduled Date: {formatJourneyDate(bus.travelDate || new Date().toISOString().split('T')[0])}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteBus(bus.id)}
                      className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors"
                      title="Delete Bus Service"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI BULK BUS SCHEDULING CHATBOT */}
      {activeTab === 'ai-assistant' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shadow-lg">
                🤖
              </div>
              <div>
                <h2 className="font-black text-lg text-white flex items-center space-x-2">
                  <span>Malenadu AI Bulk Scheduling Assistant</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-purple-500/30 text-purple-300 border border-purple-400/40 rounded-full">
                    AI Chatbot Active
                  </span>
                </h2>
                <p className="text-xs text-purple-200 font-medium mt-0.5">
                  Instantly add long lists of bus numbers, routes, dates, and prices using natural chat commands!
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('buses')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-white border border-white/20 transition-all cursor-pointer"
            >
              View Active Fleet ({customAdminBuses.length})
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[450px]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-3xl text-xs font-semibold shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-[10px] opacity-75 font-black uppercase mb-1">
                    <span>{msg.sender === 'user' ? '👤 Fleet Admin' : '🤖 AI Assistant'}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed text-sm">
                    {msg.text}
                  </div>

                  {msg.addedBuses && msg.addedBuses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Added {msg.addedBuses.length} Bus Services to Live System:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.addedBuses.map((b, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs flex items-center justify-between shadow-sm">
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-xs">{b.operatorName}</p>
                              <p className="text-[10px] text-slate-500 font-bold">{b.fromCity} ➔ {b.toCity} • 📅 {b.travelDate}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-black">
                              {b.busNumber}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Quick AI Actions:</span>
            <button
              type="button"
              onClick={() => handleSendChat("Schedule 5 Sarige buses KA-01-MN-1001 to KA-01-MN-1005 from Bengaluru to Kottigehara on 2026-08-25 at 21:30 price 450")}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 shrink-0 hover:bg-purple-200 transition-all cursor-pointer"
            >
              ➕ Add 5 Sarige Buses to Kottigehara
            </button>
            <button
              type="button"
              onClick={() => handleSendChat("Add Airavat bus KA-04-MN-8888 from Mysuru to Kottigehara on 2026-08-28 price 1100 departure 22:00 arrival 06:00")}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 shrink-0 hover:bg-indigo-200 transition-all cursor-pointer"
            >
              🛋️ Add Airavat Mysuru ➔ Kottigehara
            </button>
            <button
              type="button"
              onClick={() => handleSendChat("Schedule 3 Volvo Sleeper buses KA-01-MN-9001, KA-01-MN-9002, KA-01-MN-9003 from Bengaluru to Mangaluru on 2026-09-01 price 1300")}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 shrink-0 hover:bg-emerald-200 transition-all cursor-pointer"
            >
              👑 Schedule 3 Volvo Sleeper Buses
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendChat(chatInput); }} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type natural command or paste list e.g. 'Add 5 buses KA-01-MN-101 to 105 from Bengaluru to Chikamagaluru on 2026-08-25 at 21:30 price 450'"
              className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 focus:border-purple-500 text-slate-900 dark:text-white text-xs font-extrabold outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Send AI Command</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </form>

        </div>
      )}

      {/* TAB 3: UPLOAD PERSONAL ADMIN QR CODE */}
      {activeTab === 'qrcodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-lg text-slate-900 dark:text-white">Upload Personal Payment QR Code</h2>
                <p className="text-xs text-slate-500 font-bold">Upload your GPay / PhonePe / Paytm / UPI QR Code image</p>
              </div>
            </div>

            <form onSubmit={handlePersonalQrSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Your UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={personalQrForm.upiId}
                  onChange={(e) => setPersonalQrForm({ ...personalQrForm, upiId: e.target.value })}
                  placeholder="e.g. yourname@gpay or 9900001122@ybl"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-black focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Merchant / Operator Name
                </label>
                <input
                  type="text"
                  value={personalQrForm.merchantName}
                  onChange={(e) => setPersonalQrForm({ ...personalQrForm, merchantName: e.target.value })}
                  placeholder="e.g. Malenadu Travels Private Limited"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-extrabold focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Select QR Code Image File
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePersonalQrUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Click to choose image file or drag & drop
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">PNG, JPG, WEBP formats supported</p>
                </div>
              </div>

              {personalQrForm.qrImageUrl && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-4">
                  <img
                    src={personalQrForm.qrImageUrl}
                    alt="Preview"
                    className="w-20 h-20 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 shadow-sm"
                  />
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white">Preview Ready</span>
                    <p className="text-xs font-black text-slate-900 dark:text-white mt-1">QR Code Image Selected</p>
                    <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 mt-0.5">{personalQrForm.upiId}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Set Live as Personal Admin Payment QR Code
              </button>
            </form>
          </div>

          {/* Active Live QR Code Display Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Current Live Payment QR Code
            </span>

            <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-emerald-500 max-w-[220px]">
              {activeQr?.qrImageUrl ? (
                <img
                  src={activeQr.qrImageUrl}
                  alt="Live Admin QR Code"
                  className="w-full h-auto object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                  No QR Code Image
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">{activeQr?.merchantName || 'Malenadu Travels Private Limited'}</h3>
              <p className="font-mono text-sm font-extrabold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40 inline-block">
                {activeQr?.upiId || 'malenadutravels@upi'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TICKET APPROVALS & MANAGEMENT */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          
          {/* Header & Select Type of Ticket Filter Pills */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                <Ticket className="w-6 h-6 text-emerald-500" />
                <span>Passenger Ticket Approvals & Management</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Filter by ticket status, select all, approve/reject or delete tickets permanently.
              </p>
            </div>

            {/* Select Type of Ticket Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTicketFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  ticketFilterType === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
                }`}
              >
                All ({userBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilterType('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  ticketFilterType === 'pending'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-500'
                }`}
              >
                ⏳ Pending ({userBookings.filter(b => b.status === 'Pending Admin Approval' || b.status === 'Pending Approval').length})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilterType('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  ticketFilterType === 'approved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
                }`}
              >
                ✓ Confirmed ({userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Approved' || (b.status && b.status.includes('Approved'))).length})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilterType('cancelled')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  ticketFilterType === 'cancelled'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-red-500'
                }`}
              >
                ✕ Cancelled ({userBookings.filter(b => b.status === 'Cancelled' || b.status === 'Cancelled by Admin' || b.status === 'Rejected').length})
              </button>
            </div>
          </div>

          {/* Bulk Select & Bulk Actions Bar */}
          {filteredTickets.length > 0 && (
            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              
              {/* Select All Checkbox */}
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-black text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span>Select All ({filteredTickets.length} Tickets)</span>
              </label>

              {/* Bulk Actions Buttons */}
              <div className="flex items-center space-x-2">
                {selectedTicketIds.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveSelectedTickets}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Selected ({selectedTicketIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRejectSelectedTickets}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Selected ({selectedTicketIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteSelectedTickets}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected ({selectedTicketIds.length})</span>
                    </button>
                  </>
                )}
              </div>

            </div>
          )}

          {/* Ticket List Cards */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Ticket className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">No Tickets Found for Selected Filter</h4>
              </div>
            ) : (
              filteredTickets.map((b) => {
                const currentId = String(b.ticketId || b.bookingId || b.pnr);
                const isSelected = selectedTicketIds.includes(currentId);

                return (
                  <div
                    key={currentId}
                    className={`bg-white dark:bg-slate-900 rounded-3xl border-2 p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Individual Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectTicket(currentId)}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer mt-1"
                      />

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                            {b.ticketId || b.bookingId}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            b.status === 'Confirmed' || b.status === 'Approved' || (b.status && b.status.includes('Approved'))
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                              : b.status === 'Cancelled' || b.status === 'Cancelled by Admin' || b.status === 'Rejected'
                              ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 dark:text-white">{b.busName} ({b.busNo})</h3>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {b.from} ➔ {b.to} • Departure: {b.departureTime} • Date: {b.date}
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Seats: <span className="font-black text-emerald-600">{Array.isArray(b.seats) ? b.seats.map(s => typeof s === 'object' ? (s.id || s.label) : s).join(', ') : b.seats}</span> • Total Fare: <span className="font-black text-slate-900 dark:text-white">₹{b.totalAmount || b.amount}</span>
                        </p>

                        <div className="pt-1 flex items-center space-x-3 text-xs font-mono text-slate-500">
                          <span>UPI Ref: <span className="font-bold text-slate-900 dark:text-white">{b.upiTxnId || 'N/A'}</span></span>
                          <span>Passenger: <span className="font-bold text-slate-900 dark:text-white">{b.passengerName || 'Passenger'} ({b.mobile || 'N/A'})</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 shrink-0">
                      {(b.status === 'Pending Admin Approval' || b.status === 'Pending Approval') && (
                        <>
                          <button
                            type="button"
                            onClick={() => approveTicket(b.ticketId || b.bookingId)}
                            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                          >
                            ✓ Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectTicket(b.ticketId || b.bookingId)}
                            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      {/* Single Ticket Delete Trash Button */}
                      <button
                        type="button"
                        onClick={() => {
                          deleteTicket(b.ticketId || b.bookingId || b.pnr);
                          setSuccessMsg(`Ticket ${b.ticketId || b.bookingId} deleted permanently.`);
                          setTimeout(() => setSuccessMsg(''), 4000);
                        }}
                        className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors cursor-pointer"
                        title="Delete Ticket Permanently"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
