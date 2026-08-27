export const malenaduFleetCategories = [
  { 
    id: "volvo", 
    name: "Malenadu Volvo Multi-Axle (Sleeper AC)", 
    shortName: "Volvo Multi-Axle", 
    logo: "👑", 
    isAc: true, 
    isSleeper: true, 
    isEv: false,
    busType: "Sleeper AC" 
  },
  { 
    id: "airavat", 
    name: "Malenadu Airavat (Semi Sleeper AC)", 
    shortName: "Airavat Semi Sleeper", 
    logo: "🛋️", 
    isAc: true, 
    isSleeper: false, 
    isEv: false,
    busType: "Semi Sleeper AC" 
  },
  { 
    id: "rajahamsa", 
    name: "Malenadu Rajahamsa (Semi Sleeper Non AC)", 
    shortName: "Rajahamsa Semi Sleeper", 
    logo: "🚌", 
    isAc: false, 
    isSleeper: false, 
    isEv: false,
    busType: "Semi Sleeper Non AC" 
  },
  { 
    id: "nightqueen", 
    name: "Malenadu Night Queen (Sleeper Non AC)", 
    shortName: "Night Queen Sleeper", 
    logo: "🛏️", 
    isAc: false, 
    isSleeper: true, 
    isEv: false,
    busType: "Sleeper Non AC" 
  },
  { 
    id: "sarige", 
    name: "Malenadu Sarige (Normal Seating Bus)", 
    shortName: "Malenadu Sarige", 
    logo: "🚍", 
    isAc: false, 
    isSleeper: false, 
    isEv: false,
    busType: "Normal Seating Bus" 
  }
];

// Formats YYYY-MM-DD or date string to clear passenger display format (e.g. "Sun, 23 Aug 2026")
export function formatJourneyDate(dateStr) {
  if (!dateStr) {
    const today = new Date();
    return today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Dynamically calculates the exact real-time duration between departure time and arrival time
export function calculateDuration(depTime, arrTime) {
  if (!depTime || !arrTime) return '8h 00m';

  const parseTime = (str) => {
    if (!str) return null;
    const parts = str.trim().split(':');
    if (parts.length < 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const depMins = parseTime(depTime);
  const arrMins = parseTime(arrTime);

  if (depMins === null || arrMins === null) return '8h 00m';

  let diff = arrMins - depMins;
  if (diff <= 0) {
    diff += 24 * 60; // Overnight journey crossed midnight
  }

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;
}

// Helper to determine if a bus is a full berth sleeper (Volvo Sleeper / Night Queen) vs 46-Seat Seater (Sarige / Airavat / Rajahamsa)
export function checkIsSleeperBus(bus) {
  if (!bus) return false;
  const bType = (bus.busType || bus.operatorName || '').toLowerCase();

  // Semi Sleeper, Sarige, Airavat, and Rajahamsa are 46-Seat Seater / Semi-Sleeper buses
  if (bType.includes('semi') || bType.includes('sarige') || bType.includes('airavat') || bType.includes('rajahamsa')) {
    return false;
  }

  if (bType.includes('volvo') || bType.includes('night queen') || (bType.includes('sleeper') && !bType.includes('semi'))) {
    return true;
  }

  return Boolean(bus.isSleeper && !bType.includes('semi'));
}

export const DEFAULT_MALENADU_BUSES = [
  {
    id: "BUS-DEF-101",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-14-MN-9999",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Shivamogga",
    departureTime: "21:30",
    arrivalTime: "05:30",
    duration: "8h 00m",
    price: 850,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Water Bottle", "Live GPS Tracking"]
  },
  {
    id: "BUS-DEF-102",
    operatorName: "Malenadu Volvo Multi-Axle (Sleeper AC)",
    operatorLogo: "👑",
    busNumber: "KA-14-MN-8888",
    busType: "Sleeper AC",
    category: "Malenadu Luxury",
    isAc: true,
    isSleeper: true,
    fromCity: "Bengaluru",
    toCity: "Shivamogga",
    departureTime: "22:15",
    arrivalTime: "06:00",
    duration: "7h 45m",
    price: 1100,
    rating: 4.9,
    amenities: ["Blankets & Pillow", "Reading Light", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-103",
    operatorName: "Malenadu Rajahamsa (Semi Sleeper Non AC)",
    operatorLogo: "🚌",
    busNumber: "KA-14-MN-7777",
    busType: "Semi Sleeper Non AC",
    category: "Malenadu Express",
    isAc: false,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Shivamogga",
    departureTime: "20:45",
    arrivalTime: "05:00",
    duration: "8h 15m",
    price: 650,
    rating: 4.7,
    amenities: ["Emergency Exit", "Reading Lamp", "Comfort Seats"]
  },
  {
    id: "BUS-DEF-104",
    operatorName: "Malenadu Sarige (Normal Seating Bus)",
    operatorLogo: "🚍",
    busNumber: "KA-14-MN-6666",
    busType: "Normal Seating Bus",
    category: "Malenadu Sarige",
    isAc: false,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Shivamogga",
    departureTime: "07:30",
    arrivalTime: "15:30",
    duration: "8h 00m",
    price: 450,
    rating: 4.5,
    amenities: ["Luggage Space", "First Aid Box", "Live GPS"]
  },
  {
    id: "BUS-DEF-201",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-14-MN-5555",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Kottigehara",
    departureTime: "21:30",
    arrivalTime: "05:15",
    duration: "7h 45m",
    price: 850,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS Tracking"]
  },
  {
    id: "BUS-DEF-202",
    operatorName: "Malenadu Rajahamsa (Semi Sleeper Non AC)",
    operatorLogo: "🚌",
    busNumber: "KA-14-MN-4444",
    busType: "Semi Sleeper Non AC",
    category: "Malenadu Express",
    isAc: false,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Kottigehara",
    departureTime: "22:30",
    arrivalTime: "06:15",
    duration: "7h 45m",
    price: 650,
    rating: 4.8,
    amenities: ["Emergency Exit", "Charging Point"]
  },
  {
    id: "BUS-DEF-203",
    operatorName: "Malenadu Night Queen (Sleeper Non AC)",
    operatorLogo: "🛏️",
    busNumber: "KA-14-MN-3333",
    busType: "Sleeper Non AC",
    category: "Malenadu Express",
    isAc: false,
    isSleeper: true,
    fromCity: "Bengaluru",
    toCity: "Kottigehara",
    departureTime: "23:00",
    arrivalTime: "06:45",
    duration: "7h 45m",
    price: 750,
    rating: 4.7,
    amenities: ["Curtains", "Reading Light", "Live GPS"]
  },
  {
    id: "BUS-DEF-301",
    operatorName: "Malenadu Volvo Multi-Axle (Sleeper AC)",
    operatorLogo: "👑",
    busNumber: "KA-19-MN-1111",
    busType: "Sleeper AC",
    category: "Malenadu Luxury",
    isAc: true,
    isSleeper: true,
    fromCity: "Bengaluru",
    toCity: "Mangaluru",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 00m",
    price: 1200,
    rating: 4.9,
    amenities: ["Blankets & Pillow", "Wi-Fi", "Charging Point", "Water Bottle"]
  },
  {
    id: "BUS-DEF-302",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-19-MN-2222",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Mangaluru",
    departureTime: "21:00",
    arrivalTime: "05:00",
    duration: "8h 00m",
    price: 950,
    rating: 4.8,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-401",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-18-MN-3333",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Chikamagaluru",
    departureTime: "22:30",
    arrivalTime: "05:30",
    duration: "7h 00m",
    price: 800,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-402",
    operatorName: "Malenadu Rajahamsa (Semi Sleeper Non AC)",
    operatorLogo: "🚌",
    busNumber: "KA-18-MN-4444",
    busType: "Semi Sleeper Non AC",
    category: "Malenadu Express",
    isAc: false,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Chikamagaluru",
    departureTime: "21:30",
    arrivalTime: "04:45",
    duration: "7h 15m",
    price: 600,
    rating: 4.7,
    amenities: ["Charging Point", "Reading Light"]
  },
  {
    id: "BUS-DEF-501",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-09-MN-5555",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Mysuru",
    departureTime: "06:00",
    arrivalTime: "09:30",
    duration: "3h 30m",
    price: 450,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-502",
    operatorName: "Malenadu Sarige (Normal Seating Bus)",
    operatorLogo: "🚍",
    busNumber: "KA-09-MN-6666",
    busType: "Normal Seating Bus",
    category: "Malenadu Sarige",
    isAc: false,
    isSleeper: false,
    fromCity: "Bengaluru",
    toCity: "Mysuru",
    departureTime: "08:00",
    arrivalTime: "11:30",
    duration: "3h 30m",
    price: 250,
    rating: 4.6,
    amenities: ["Luggage Space", "Live GPS"]
  },
  {
    id: "BUS-DEF-601",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-14-MN-9001",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Shivamogga",
    toCity: "Bengaluru",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 00m",
    price: 850,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-602",
    operatorName: "Malenadu Volvo Multi-Axle (Sleeper AC)",
    operatorLogo: "👑",
    busNumber: "KA-14-MN-9002",
    busType: "Sleeper AC",
    category: "Malenadu Luxury",
    isAc: true,
    isSleeper: true,
    fromCity: "Shivamogga",
    toCity: "Bengaluru",
    departureTime: "22:45",
    arrivalTime: "06:30",
    duration: "7h 45m",
    price: 1100,
    rating: 4.9,
    amenities: ["Blankets & Pillow", "Reading Light", "Live GPS"]
  },
  {
    id: "BUS-DEF-701",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-14-MN-9003",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Kottigehara",
    toCity: "Bengaluru",
    departureTime: "21:30",
    arrivalTime: "05:15",
    duration: "7h 45m",
    price: 850,
    rating: 4.8,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  },
  {
    id: "BUS-DEF-801",
    operatorName: "Malenadu Airavat (Semi Sleeper AC)",
    operatorLogo: "🛋️",
    busNumber: "KA-09-MN-9006",
    busType: "Semi Sleeper AC",
    category: "Malenadu Express",
    isAc: true,
    isSleeper: false,
    fromCity: "Mysuru",
    toCity: "Kottigehara",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 00m",
    price: 1100,
    rating: 4.9,
    amenities: ["Free Wi-Fi", "Charging Point", "Live GPS"]
  }
];

// Returns Malenadu Travels fleet buses matching departure, destination AND journey date
export function getBusesForRoute(fromLoc, toLoc, journeyDate, customAdminBuses = []) {
  const targetDateStr = (journeyDate || new Date().toISOString().split('T')[0]).trim();

  // Combine custom admin buses with default buses
  let pool = [];
  if (customAdminBuses && customAdminBuses.length > 0) {
    const customNos = new Set(customAdminBuses.map(b => (b.busNumber || '').trim()));
    const nonOverlappingDefaults = DEFAULT_MALENADU_BUSES.filter(d => !customNos.has(d.busNumber.trim()));
    pool = [...customAdminBuses, ...nonOverlappingDefaults];
  } else {
    pool = DEFAULT_MALENADU_BUSES;
  }

  if (!fromLoc || !toLoc) {
    return pool.map(b => ({ ...b, travelDate: targetDateStr }));
  }

  const fromName = (fromLoc.name || '').toLowerCase().trim();
  const fromDistrict = (fromLoc.district || '').toLowerCase().trim();
  const fromTaluk = (fromLoc.taluk || '').toLowerCase().trim();

  const toName = (toLoc.name || '').toLowerCase().trim();
  const toDistrict = (toLoc.district || '').toLowerCase().trim();
  const toTaluk = (toLoc.taluk || '').toLowerCase().trim();

  let matches = pool.filter(bus => {
    const busFrom = (bus.fromCity || '').toLowerCase().trim();
    const busTo = (bus.toCity || '').toLowerCase().trim();

    const matchesFrom = (fromName && (busFrom.includes(fromName) || fromName.includes(busFrom))) ||
                        (fromTaluk && (busFrom.includes(fromTaluk) || fromTaluk.includes(busFrom))) ||
                        (fromDistrict && (busFrom.includes(fromDistrict) || fromDistrict.includes(busFrom)));

    const matchesTo = (toName && (busTo.includes(toName) || toName.includes(busTo))) ||
                      (toTaluk && (busTo.includes(toTaluk) || toTaluk.includes(busTo))) ||
                      (toDistrict && (busTo.includes(toDistrict) || toDistrict.includes(busTo)));

    return matchesFrom && matchesTo;
  });

  // If no buses found for non-standard local routes, dynamically generate Malenadu regional fleet for that route so passengers ALWAYS find buses!
  if (matches.length === 0) {
    matches = [
      {
        id: `BUS-DYN-1-${(fromLoc.id || 'src')}-${(toLoc.id || 'dst')}`,
        operatorName: "Malenadu Airavat (Semi Sleeper AC)",
        operatorLogo: "🛋️",
        busNumber: "KA-01-MN-1008",
        busType: "Semi Sleeper AC",
        category: "Malenadu Express",
        isAc: true,
        isSleeper: false,
        fromCity: fromLoc.name || "Bengaluru",
        toCity: toLoc.name || "Destination",
        departureTime: "21:30",
        arrivalTime: "05:30",
        duration: "8h 00m",
        price: 850,
        rating: 4.9,
        amenities: ["Free Wi-Fi", "Charging Point", "Water Bottle", "Live GPS"]
      },
      {
        id: `BUS-DYN-2-${(fromLoc.id || 'src')}-${(toLoc.id || 'dst')}`,
        operatorName: "Malenadu Rajahamsa (Semi Sleeper Non AC)",
        operatorLogo: "🚌",
        busNumber: "KA-01-MN-2009",
        busType: "Semi Sleeper Non AC",
        category: "Malenadu Express",
        isAc: false,
        isSleeper: false,
        fromCity: fromLoc.name || "Bengaluru",
        toCity: toLoc.name || "Destination",
        departureTime: "22:15",
        arrivalTime: "06:15",
        duration: "8h 00m",
        price: 650,
        rating: 4.8,
        amenities: ["Emergency Exit", "Charging Point", "Live GPS"]
      },
      {
        id: `BUS-DYN-3-${(fromLoc.id || 'src')}-${(toLoc.id || 'dst')}`,
        operatorName: "Malenadu Volvo Multi-Axle (Sleeper AC)",
        operatorLogo: "👑",
        busNumber: "KA-01-MN-3010",
        busType: "Sleeper AC",
        category: "Malenadu Luxury",
        isAc: true,
        isSleeper: true,
        fromCity: fromLoc.name || "Bengaluru",
        toCity: toLoc.name || "Destination",
        departureTime: "23:00",
        arrivalTime: "07:00",
        duration: "8h 00m",
        price: 1100,
        rating: 4.9,
        amenities: ["Blankets & Pillow", "Reading Light", "Charging Point", "Live GPS"]
      }
    ];
  }

  // Ensure every returned bus has travelDate set to the searched targetDateStr
  return matches.map(b => ({
    ...b,
    travelDate: targetDateStr,
    effectiveTravelDate: targetDateStr
  }));
}

// Single Authoritative Calculator for Bus Seat Details & Available Count
export function calculateBusSeatDetails(bus, userBookings = []) {
  if (!bus) {
    return {
      type: 'seater',
      totalSeats: 46,
      bookedSeatIds: [],
      availableCount: 38
    };
  }

  const isSleeper = checkIsSleeperBus(bus);

  // Extract booked seat IDs for THIS specific bus strictly matching ID or Bus Registration Number
  const bookedSeatIds = [];
  if (userBookings && Array.isArray(userBookings)) {
    userBookings.forEach(b => {
      const matchId = b.busId && bus.id && String(b.busId) === String(bus.id);
      const matchNo = b.busNo && bus.busNumber && String(b.busNo).trim().toLowerCase() === String(bus.busNumber).trim().toLowerCase();
      const isActive = b.status !== 'Cancelled' && b.status !== 'Cancelled by Admin';
      
      if ((matchId || matchNo) && isActive && Array.isArray(b.seats)) {
        b.seats.forEach(s => {
          const val = typeof s === 'object' ? (s.id || s.label || s.number || s.seatNo) : s;
          if (val !== undefined && val !== null) {
            bookedSeatIds.push(String(val));
          }
        });
      }
    });
  }

  if (isSleeper) {
    const demoBookedLower = ['1', '2', '3', '4', '5', '6', '9', '16'];
    const demoBookedUpper = ['32'];

    const lowerBerths = [
      '1', '2', '6', '5', '7', '8', '12', '11', '13', '14',
      '3', '4', '9', '10', '15', '16'
    ].map(id => ({
      id,
      isBooked: bookedSeatIds.includes(id) || demoBookedLower.includes(id)
    }));

    const upperBerths = [
      '17', '18', '22', '21', '23', '24', '28', '27', '29', '30',
      '19', '20', '25', '26', '31', '32'
    ].map(id => ({
      id,
      isBooked: bookedSeatIds.includes(id) || demoBookedUpper.includes(id)
    }));

    const lowerAvailable = lowerBerths.filter(b => !b.isBooked).length;
    const upperAvailable = upperBerths.filter(b => !b.isBooked).length;
    const totalAvailable = lowerAvailable + upperAvailable;

    return {
      type: 'sleeper',
      totalSeats: 32,
      bookedSeatIds,
      lowerBerths,
      upperBerths,
      lowerAvailable,
      upperAvailable,
      availableCount: totalAvailable
    };
  } else {
    // 46-Seat Seater layout (Sarige, Airavat, Rajahamsa)
    const seats = [];
    for (let i = 1; i <= 46; i++) {
      const id = String(i);
      const isDemoBooked = (i % 9 === 0 || i % 11 === 0);
      const isBooked = bookedSeatIds.includes(id) || isDemoBooked;
      seats.push({ id, isBooked });
    }

    const availableCount = seats.filter(s => !s.isBooked).length;
    return {
      type: 'seater',
      totalSeats: 46,
      bookedSeatIds,
      seats,
      availableCount
    };
  }
}

// Legacy export alias for backward compatibility
export function getAvailableSeatsForBus(bus, userBookings = []) {
  const details = calculateBusSeatDetails(bus, userBookings);
  return details.availableCount;
}
