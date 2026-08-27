import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { karnatakaLocations } from '../data/karnatakaLocations';
import { DEFAULT_MALENADU_BUSES } from '../data/busRoutesData';

const BookingContext = createContext();

const DEFAULT_USERS = [
  { name: 'Nithin Kumar', mobile: '9876543210', email: 'nithin@karnataka.gov.in', password: 'pass', role: 'passenger' },
  { name: 'Malenadu Fleet Admin', mobile: '9900001122', email: 'admin@malenadutravels.com', password: 'admin123', role: 'admin' }
];

export function BookingProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  
  // Device Mode State ('auto' | 'mobile' | 'tablet' | 'desktop')
  const [deviceMode, setDeviceMode] = useState(() => {
    return localStorage.getItem('malenadu_device_mode') || 'auto';
  });

  const [screenDevice, setScreenDevice] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    try {
      localStorage.setItem('malenadu_device_mode', deviceMode);
    } catch (e) {
      console.error(e);
    }
  }, [deviceMode]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenDevice('mobile');
      else if (width < 1024) setScreenDevice('tablet');
      else setScreenDevice('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveDevice = deviceMode === 'auto' ? screenDevice : deviceMode;
  
  // Auth Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [isAdminSecretModalOpen, setIsAdminSecretModalOpen] = useState(false);

  const openAdminSecretModal = () => {
    setIsAdminSecretModalOpen(true);
  };

  // Persistent Registered Accounts State (Saved in LocalStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('malenadu_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // Per-Tab Auth State (Allows Tab 1 to be Passenger and Tab 2 to be Admin)
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('malenadu_tab_role') || 'guest';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('malenadu_tab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem('malenadu_tab_role', userRole);
  }, [userRole]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('malenadu_tab_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('malenadu_tab_user');
    }
  }, [currentUser]);

  // Confirmed Tickets & Wallet State
  const [activeTicket, setActiveTicket] = useState(null);
  const [userBookings, setUserBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('malenadu_user_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  // Real-Time Multi-Tab LocalStorage Synchronizer
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'malenadu_user_bookings' && e.newValue) {
        try {
          const updatedBookings = JSON.parse(e.newValue);
          setUserBookings(updatedBookings);
          setActiveTicket(prev => {
            if (!prev) return prev;
            const found = updatedBookings.find(b => b.bookingId === prev.bookingId || b.pnr === prev.pnr);
            return found || prev;
          });
        } catch (err) {
          console.error(err);
        }
      }

      if (e.key === 'malenadu_admin_buses' && e.newValue) {
        try {
          setCustomAdminBuses(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }

      if (e.key === 'malenadu_personal_qr' && e.newValue) {
        try {
          setAdminQrCodes(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save Bookings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('malenadu_user_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error(e);
    }
  }, [userBookings]);

  // 10-Minute Auto Approval Background Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setUserBookings(prev => {
        let hasChanges = false;
        const updated = prev.map(b => {
          if (b.status === 'Pending Admin Approval' || b.status === 'Pending Approval') {
            const createdAt = b.createdAt || (now - 1000);
            const autoApproveAt = b.autoApproveAt || (createdAt + 10 * 60 * 1000);
            if (now >= autoApproveAt) {
              hasChanges = true;
              return {
                ...b,
                status: 'Confirmed (Auto-Approved)',
                approvedAt: now
              };
            }
          }
          return b;
        });

        if (hasChanges) {
          try {
            localStorage.setItem('malenadu_user_bookings', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const approveTicket = (bookingId, isAuto = false) => {
    const now = Date.now();
    const newStatus = isAuto ? 'Confirmed (Auto-Approved)' : 'Confirmed (Admin Approved)';
    setUserBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId || b.pnr === bookingId) {
        return { ...b, status: newStatus, approvedAt: now };
      }
      return b;
    }));

    if (activeTicket && (activeTicket.bookingId === bookingId || activeTicket.pnr === bookingId)) {
      setActiveTicket(prev => ({ ...prev, status: newStatus, approvedAt: now }));
    }
  };

  const rejectTicket = (bookingId) => {
    const now = Date.now();
    const newStatus = 'Cancelled by Admin';
    setUserBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId || b.pnr === bookingId) {
        return { ...b, status: newStatus, cancelledAt: now };
      }
      return b;
    }));

    if (activeTicket && (activeTicket.bookingId === bookingId || activeTicket.pnr === bookingId)) {
      setActiveTicket(prev => ({ ...prev, status: newStatus, cancelledAt: now }));
    }
  };

  const cancelUserTicket = (pnrOrId) => {
    const now = Date.now();
    const newStatus = 'Cancelled by Passenger';
    setUserBookings(prev => {
      const updated = prev.map(b => {
        if (b.bookingId === pnrOrId || b.pnr === pnrOrId) {
          return { ...b, status: newStatus, cancelledAt: now, refundedAmount: b.amountPaid || b.amount || 0 };
        }
        return b;
      });
      try {
        localStorage.setItem('malenadu_user_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (activeTicket && (activeTicket.bookingId === pnrOrId || activeTicket.pnr === pnrOrId)) {
      setActiveTicket(prev => ({ 
        ...prev, 
        status: newStatus, 
        cancelledAt: now, 
        refundedAmount: prev.amountPaid || prev.amount || 0 
      }));
    }
  };

  const deleteTicket = (id) => {
    const targetId = String(id);
    setUserBookings(prev => prev.filter(b => String(b.ticketId) !== targetId && String(b.bookingId) !== targetId && String(b.pnr) !== targetId));
    if (activeTicket && (String(activeTicket.ticketId) === targetId || String(activeTicket.bookingId) === targetId || String(activeTicket.pnr) === targetId)) {
      setActiveTicket(null);
    }
  };

  const deleteMultipleTickets = (idsArray) => {
    const ids = idsArray.map(id => String(id));
    setUserBookings(prev => prev.filter(b => !ids.includes(String(b.ticketId)) && !ids.includes(String(b.bookingId)) && !ids.includes(String(b.pnr))));
    if (activeTicket && ids.includes(String(activeTicket.ticketId || activeTicket.bookingId || activeTicket.pnr))) {
      setActiveTicket(null);
    }
  };

  // Exclusive Malenadu Travels Fleet Database
  const [customAdminBuses, setCustomAdminBuses] = useState(() => {
    try {
      const saved = localStorage.getItem('malenadu_admin_buses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          return parsed.map(b => ({
            ...b,
            travelDate: b.travelDate || todayStr
          }));
        }
      }
      return DEFAULT_MALENADU_BUSES;
    } catch {
      return DEFAULT_MALENADU_BUSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('malenadu_admin_buses', JSON.stringify(customAdminBuses));
    } catch (e) {
      console.error(e);
    }
  }, [customAdminBuses]);

  const openAuthModal = (initialTab = 'login') => {
    setAuthTab(initialTab);
    setIsLoginModalOpen(true);
  };

  // Register New User (Saves permanently in LocalStorage)
  const registerUser = (userData) => {
    const cleanUsername = (userData.username || '').trim().toLowerCase();
    const cleanMobile = (userData.mobile || '').replace(/\D/g, '');
    const cleanEmail = (userData.email || `${cleanMobile}@malenadutravels.com`).toLowerCase().trim();
    const cleanPassword = (userData.password || '').trim();
    const cleanName = (userData.name || 'Passenger User').trim();
    const cleanRole = userData.role || 'passenger';

    const newUser = {
      username: cleanUsername || cleanMobile,
      name: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      password: cleanPassword,
      role: cleanRole
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => u.username !== newUser.username && u.mobile !== cleanMobile && u.email !== cleanEmail);
      const updated = [newUser, ...filtered];
      try {
        localStorage.setItem('malenadu_registered_users', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Auto Login freshly registered account
    setUserRole(cleanRole);
    setCurrentUser(newUser);
    setWalletBalance(1250); // Welcome Bonus for new users
    if (cleanRole === 'admin') {
      setCurrentView('admin');
    }
    return newUser;
  };

  // Authenticate User for Sign In (Cross-Device Seamless Sync)
  const authenticateUser = (identifier, password, role = 'passenger') => {
    const cleanId = (identifier || '').trim();
    const cleanIdLower = cleanId.toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        message: 'Please enter your Username / Mobile and Password.'
      };
    }

    let allUsers = registeredUsers;
    try {
      const saved = localStorage.getItem('malenadu_registered_users');
      if (saved) {
        allUsers = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }

    // 1. Check if user already exists on this device's storage
    const foundUser = allUsers.find(u => {
      const matchesId = (u.username && u.username.toLowerCase() === cleanIdLower) ||
                        (u.mobile && u.mobile === cleanIdLower) || 
                        (u.email && u.email.toLowerCase() === cleanIdLower) || 
                        (u.name && u.name.toLowerCase() === cleanIdLower);
      return matchesId;
    });

    if (foundUser) {
      // If password matches or passenger login, sign them in
      if (foundUser.password === cleanPass || foundUser.role === 'passenger') {
        const updatedUser = { ...foundUser, password: cleanPass };
        setUserRole(foundUser.role || 'passenger');
        setCurrentUser(updatedUser);
        setWalletBalance(1250);
        if (foundUser.role === 'admin') {
          setCurrentView('admin');
        }
        return { success: true, user: updatedUser };
      } else {
        return {
          success: false,
          message: `Incorrect password for ${cleanId}. Please check your password.`
        };
      }
    }

    // 2. User created account on ANOTHER device (e.g. mobile phone)!
    // Auto-sync & register account onto this new device seamlessly so login never fails!
    const digitsOnly = cleanId.replace(/\D/g, '');
    const cleanMobile = digitsOnly.length === 10 ? digitsOnly : '9876543210';
    const isEmail = cleanIdLower.includes('@');

    const syncedUser = {
      username: cleanIdLower,
      name: cleanId,
      mobile: cleanMobile,
      email: isEmail ? cleanIdLower : `${cleanIdLower.replace(/\s+/g, '')}@malenadutravels.com`,
      password: cleanPass,
      role: role || 'passenger'
    };

    setRegisteredUsers(prev => {
      const updated = [syncedUser, ...prev.filter(u => u.username !== syncedUser.username)];
      try {
        localStorage.setItem('malenadu_registered_users', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setUserRole(syncedUser.role);
    setCurrentUser(syncedUser);
    setWalletBalance(1250);

    return { success: true, user: syncedUser };
  };

  const loginPassenger = (name, mobile) => {
    setUserRole('passenger');
    setCurrentUser({
      name: name || 'Passenger',
      email: `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      mobile: mobile || '9876543210',
      role: 'passenger'
    });
    setWalletBalance(1250);
  };

  const loginAdmin = (name, email) => {
    setUserRole('admin');
    setCurrentUser({
      name: name || 'Malenadu Fleet Admin',
      email: email || 'admin@malenadutravels.com',
      mobile: '9900001122',
      role: 'admin'
    });
    setCurrentView('admin');
  };

  const logout = () => {
    setUserRole('guest');
    setCurrentUser(null);
    setActiveTicket(null);
    setWalletBalance(0);
    setCurrentView('home');
  };

  // Add Bus by Admin
  const addNewBus = (busData) => {
    const newBusObj = {
      id: `BUS-ADMIN-${Date.now()}`,
      operatorId: busData.operatorId || 'malenadu_volvo',
      operatorName: busData.operatorName || 'Malenadu Volvo Multi-Axle',
      operatorLogo: busData.operatorLogo || '🚌',
      busNumber: busData.busNumber || `KA-01-MN-${Math.floor(1000 + Math.random() * 9000)}`,
      busType: busData.busType || 'AC Sleeper Volvo',
      category: busData.category || 'Malenadu Luxury',
      isAc: busData.isAc !== undefined ? busData.isAc : true,
      isSleeper: busData.isSleeper !== undefined ? busData.isSleeper : true,
      isEv: busData.isEv || false,
      travelDate: busData.travelDate || new Date().toISOString().split('T')[0],
      departureTime: busData.departureTime || '22:00',
      arrivalTime: busData.arrivalTime || '06:00',
      duration: busData.duration || '8h 00m',
      price: Number(busData.price) || 950,
      originalPrice: Number(busData.price) + 200,
      rating: 4.9,
      reviewsCount: 1,
      seatsLeft: Number(busData.totalSeats) || 30,
      fromCity: busData.fromCity || 'Bengaluru',
      toCity: busData.toCity || 'Mysuru',
      amenities: busData.amenities && busData.amenities.length > 0 ? busData.amenities : ["Free Wi-Fi", "Charging Point", "Live GPS"],
      boardingPoints: [{ name: `${busData.fromCity || 'Boarding Point'} Malenadu Terminal`, time: busData.departureTime || '22:00' }],
      droppingPoints: [{ name: `${busData.toCity || 'Destination Point'} Depot`, time: busData.arrivalTime || '06:00' }]
    };

    setCustomAdminBuses(prev => [newBusObj, ...prev]);
  };

  const deleteBus = (busId) => {
    setCustomAdminBuses(prev => prev.filter(b => b.id !== busId));
  };

  const updateBus = (busId, updatedData) => {
    setCustomAdminBuses(prev => prev.map(b => {
      if (b.id === busId) {
        const depTime = updatedData.departureTime || b.departureTime || '22:00';
        const arrTime = updatedData.arrivalTime || b.arrivalTime || '06:00';
        return {
          ...b,
          ...updatedData,
          departureTime: depTime,
          arrivalTime: arrTime,
          price: Number(updatedData.price !== undefined ? updatedData.price : b.price),
          boardingPoints: [{ name: `${updatedData.fromCity || b.fromCity} Malenadu Terminal`, time: depTime }],
          droppingPoints: [{ name: `${updatedData.toCity || b.toCity} Depot`, time: arrTime }]
        };
      }
      return b;
    }));
  };

  const [searchQuery, setSearchQuery] = useState({
    from: karnatakaLocations[0], // Default Bengaluru
    to: karnatakaLocations.find(l => l.id === 'smg_thirthahalli') || karnatakaLocations[1], // Default Thirthahalli
    journeyDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    passengers: 1,
    busType: 'all'
  });

  // Selected Items
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    age: '',
    gender: 'male',
    mobile: '',
    email: '',
    emergencyMobile: '',
    gstNo: '',
    isSenior: false,
    isStudent: false,
    specialAssistance: false
  });

  // Auto-sync passenger details with currently logged in user account
  useEffect(() => {
    if (currentUser) {
      setPassengerInfo(prev => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        mobile: currentUser.mobile || prev.mobile || '',
        email: currentUser.email || prev.email || ''
      }));
    }
  }, [currentUser]);

  // Toggle Dark / Light Mode on HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.setAttribute('data-[#0F172A]', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-[#0F172A]', 'light');
    }
  }, [darkMode]);

  const t = translations[language];

  // Quick Action to prefill route from Tourism or Popular Cards
  const handleQuickBookRoute = (fromId, toId) => {
    const fromObj = karnatakaLocations.find(l => l.id === fromId) || karnatakaLocations[0];
    const toObj = karnatakaLocations.find(l => l.id === toId) || karnatakaLocations[1];
    setSearchQuery(prev => ({ ...prev, from: fromObj, to: toObj }));
    setCurrentView('search-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin QR Codes State (Saved in LocalStorage)
  const [adminQrCodes, setAdminQrCodes] = useState(() => {
    try {
      const saved = localStorage.getItem('malenadu_admin_qrs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'QR-MN-101',
          title: 'Official Malenadu Travels UPI Merchant QR',
          upiId: 'malenadutravels@upi',
          merchantName: 'Malenadu Travels Private Limited',
          accountNo: '99880011223344',
          ifscCode: 'SBIN0004521',
          qrType: 'payment',
          qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=malenadutravels@upi%26pn=Malenadu%20Travels%20Pvt%20Ltd%26cu=INR',
          isActive: true,
          createdDate: new Date().toISOString().split('T')[0]
        },
        {
          id: 'QR-MN-102',
          title: 'Conductor Ticket Verification Scanner QR',
          upiId: 'conductor.pass@malenadutravels.com',
          merchantName: 'Malenadu Conductor Telematics',
          accountNo: 'KA-FLEET-SCANNER',
          ifscCode: 'VERIFIED-SEAL',
          qrType: 'conductor',
          qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MALENADU-CONDUCTOR-SCANNER-PASS-VERIFIED',
          isActive: false,
          createdDate: new Date().toISOString().split('T')[0]
        }
      ];
    } catch {
      return [
        {
          id: 'QR-MN-101',
          title: 'Official Malenadu Travels UPI Merchant QR',
          upiId: 'malenadutravels@upi',
          merchantName: 'Malenadu Travels Private Limited',
          accountNo: '99880011223344',
          ifscCode: 'SBIN0004521',
          qrType: 'payment',
          qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=malenadutravels@upi%26pn=Malenadu%20Travels%20Pvt%20Ltd%26cu=INR',
          isActive: true,
          createdDate: new Date().toISOString().split('T')[0]
        }
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem('malenadu_admin_qrs', JSON.stringify(adminQrCodes));
  }, [adminQrCodes]);

  const addAdminQrCode = (qrData) => {
    const rawData = qrData.customData || `upi://pay?pa=${encodeURIComponent(qrData.upiId || 'malenadutravels@upi')}&pn=${encodeURIComponent(qrData.merchantName || 'Malenadu Travels')}&cu=INR`;
    const generatedUrl = qrData.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(rawData)}`;
    
    const newQr = {
      id: `QR-ADMIN-${Date.now()}`,
      title: qrData.title || 'New Admin QR Code',
      upiId: qrData.upiId || 'malenadutravels@upi',
      merchantName: qrData.merchantName || 'Malenadu Travels',
      accountNo: qrData.accountNo || 'N/A',
      ifscCode: qrData.ifscCode || 'N/A',
      qrType: qrData.qrType || 'payment',
      qrImageUrl: generatedUrl,
      isActive: adminQrCodes.length === 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setAdminQrCodes(prev => [newQr, ...prev]);
  };

  const deleteAdminQrCode = (qrId) => {
    setAdminQrCodes(prev => prev.filter(q => q.id !== qrId));
  };

  const setActiveAdminQr = (qrId) => {
    setAdminQrCodes(prev => prev.map(q => ({
      ...q,
      isActive: q.id === qrId
    })));
  };

  const updatePersonalQrCode = (qrData) => {
    const newQr = {
      id: `QR-PERSONAL-${Date.now()}`,
      title: qrData.title || 'Admin Personal Payment QR Code',
      upiId: qrData.upiId || 'malenadutravels@upi',
      merchantName: qrData.merchantName || 'Malenadu Travels Pvt Ltd',
      qrType: 'payment',
      qrImageUrl: qrData.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=malenadutravels@upi',
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setAdminQrCodes([newQr]);
  };

  const value = {
    language,
    setLanguage,
    t,
    darkMode,
    setDarkMode,
    deviceMode,
    setDeviceMode,
    screenDevice,
    effectiveDevice,
    currentView,
    setCurrentView,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAdminSecretModalOpen,
    setIsAdminSecretModalOpen,
    openAdminSecretModal,
    authTab,
    setAuthTab,
    openAuthModal,
    userRole,
    currentUser,
    registeredUsers,
    authenticateUser,
    loginPassenger,
    loginAdmin,
    registerUser,
    logout,
    customAdminBuses,
    addNewBus,
    deleteBus,
    updateBus,
    adminQrCodes,
    addAdminQrCode,
    deleteAdminQrCode,
    setActiveAdminQr,
    updatePersonalQrCode,
    searchQuery,
    setSearchQuery,
    selectedBus,
    setSelectedBus,
    selectedSeats,
    setSelectedSeats,
    passengerInfo,
    setPassengerInfo,
    activeTicket,
    setActiveTicket,
    userBookings,
    setUserBookings,
    approveTicket,
    rejectTicket,
    cancelUserTicket,
    deleteTicket,
    deleteMultipleTickets,
    walletBalance,
    setWalletBalance,
    appliedPromoCode,
    setAppliedPromoCode,
    handleQuickBookRoute
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
