import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { User, Lock, Mail, Phone, X, UserPlus, LogIn, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, AtSign } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { language, authenticateUser, registerUser, authTab, setAuthTab } = useBooking();
  
  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');

  // Registration Form States
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleMobileInput = (value, setter) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setter(digitsOnly);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' : 'Please enter your Username and Password.');
      return;
    }

    const result = authenticateUser(loginUsername, loginPassword);
    if (result.success) {
      onClose();
    } else {
      setLoginError(result.message || (language === 'kn' ? 'ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.' : 'Invalid Username or Password.'));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim() || !regName.trim() || !regMobile.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setRegError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' : 'Please fill in all registration fields.');
      return;
    }

    if (regMobile.length !== 10) {
      setRegError(language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಸರಿಯಾಗಿ ೧೦ ಅಂಕಿಗಳಿರಬೇಕು.' : 'Mobile number must be exactly 10 numeric digits.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಕನ್ಫರ್ಮ್ ಪಾಸ್‌ವರ್ಡ್ ಒಂದೇ ಆಗಿಲ್ಲ.' : 'Password and Confirm Password do not match.');
      return;
    }

    registerUser({
      username: regUsername.trim(),
      name: regName.trim(),
      mobile: regMobile.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: 'passenger'
    });

    setLoginUsername(regUsername.trim());
    setLoginPassword(regPassword);

    setLoginSuccessMessage(
      language === 'kn'
        ? `ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ಸೃಷ್ಟಿಯಾಗಿದೆ! ಬಳಕೆದಾರ ಹೆಸರು: ${regUsername.trim()}`
        : `Account Created Successfully for ${regName.trim()}! Please Login with your Username: ${regUsername.trim()}`
    );
    setAuthTab('login');
    setRegError('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B4F37] via-[#0F4C81] to-[#0B4F37] p-0.5 shadow-md overflow-hidden shrink-0 border-2 border-amber-400">
              <img 
                src="/malenadu_circle_logo.jpg" 
                alt="Malenadu Travels Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 leading-tight font-display">
                MALENADU TRAVELS
              </h3>
              <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {language === 'kn' ? 'ಕರ್ನಾಟಕ ಬಸ್ ಟಿಕೆಟ್ ಪೋರ್ಟಲ್' : 'Karnataka Official Bus Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Tabs (Sign In / Register) */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl mb-6 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setLoginError(''); setRegError(''); setLoginSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              authTab === 'login'
                ? 'bg-[#0F4C81] text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#0F4C81]'
            }`}
          >
            <LogIn className="w-4 h-4 text-amber-300" />
            <span>{language === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'LOGIN'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('register'); setLoginError(''); setRegError(''); setLoginSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              authTab === 'register'
                ? 'bg-[#0B4F37] text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#0B4F37]'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>{language === 'kn' ? 'ನೋಂದಣಿ ಮಾಡಿ' : 'REGISTER'}</span>
          </button>
        </div>

        {/* LOGIN FORM */}
        {authTab === 'login' && (
          <div>
            <div className="text-center mb-5">
              <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {language === 'kn' ? 'ಬಳಕೆದಾರರ ಲಾಗಿನ್' : 'User Login'}
              </h4>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಲು ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter your Username & Password to Sign In'}
              </p>
            </div>

            {loginSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-start space-x-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{loginSuccessMessage}</span>
              </div>
            )}

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-extrabold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು / ಮೊಬೈಲ್ *' : 'Username / Mobile *'}
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => { setLoginUsername(e.target.value); setLoginError(''); }}
                    placeholder={language === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ' : 'Enter your Username'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0F4C81] placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                    placeholder={language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0F4C81] placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-sm text-white shadow-lg transition-all bg-[#0F4C81] hover:bg-[#0D3B66] cursor-pointer"
              >
                {language === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'LOGIN NOW'}
              </button>
            </form>

            <div className="text-center mt-4 pt-2">
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setLoginError(''); setRegError(''); setLoginSuccessMessage(''); }}
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>{language === 'kn' ? 'ಖಾತೆ ಇಲ್ಲವೇ? ನೋಂದಾಯಿಸಿ' : "Don't have an account? Register Here"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* REGISTER FORM */}
        {authTab === 'register' && (
          <div>
            <div className="text-center mb-4">
              <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {language === 'kn' ? 'ಹೊಸ ಖಾತೆ ನೋಂದಣಿ' : 'Register New User Account'}
              </h4>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'kn' ? 'ನೋಂದಾಯಿಸಲು ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'Fill in all fields below to register'}
              </p>
            </div>

            {regError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-extrabold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Username */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು (Username) *' : 'Username *'}
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder={language === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು ರಚಿಸಿ' : 'Choose a unique Username'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಹೆಸರು (Full Name) *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು' : 'Enter your full name'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Mobile Number) *' : 'Mobile Number (10 Digits) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    value={regMobile}
                    onChange={(e) => handleMobileInput(e.target.value, setRegMobile)}
                    maxLength={10}
                    placeholder={language === 'kn' ? '೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Enter 10-digit mobile number'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಇಮೇಲ್ (Email) *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password) *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ' : 'Enter password'}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'kn' ? 'ಕನ್ಫರ್ಮ್ ಪಾಸ್‌ವರ್ಡ್ (Confirm Password) *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type={showRegConfirmPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder={language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರು-ನಮೂದಿಸಿ' : 'Re-enter password'}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0B4F37] placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black text-xs text-white bg-[#0B4F37] hover:bg-[#073625] shadow-lg shadow-emerald-700/20 transition-all mt-2 cursor-pointer uppercase"
              >
                {language === 'kn' ? 'ಖಾತೆ ನೋಂದಾಯಿಸಿ' : 'REGISTER NOW'}
              </button>
            </form>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setLoginError(''); setRegError(''); setLoginSuccessMessage(''); }}
                className="text-xs font-black text-[#0F4C81] dark:text-blue-400 hover:underline cursor-pointer"
              >
                {language === 'kn' ? 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ' : 'Already registered? Sign In'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
