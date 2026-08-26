import React, { useState, useEffect } from 'react';
import { Bus, Sparkles, ShieldCheck, Zap, ArrowRight, Shield, Award, CheckCircle2 } from 'lucide-react';

export default function Intro3D({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [logoLoaded, setLogoLoaded] = useState(true);

  useEffect(() => {
    // 3800ms progress timeline for 4-second total sequence
    const intervalTime = 20;
    const duration = 3600;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // Trigger smooth exit transition at 3800ms
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3800);

    // Complete callback after 4200ms
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4250);

    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Smooth mouse tilt parallax effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) - 0.5) * 16; // subtle Y-axis rotation
    const y = ((clientY / innerHeight) - 0.5) * -14; // subtle X-axis rotation
    setMousePos({ x, y });
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  // Professional stage status messages
  const getStageStatus = () => {
    if (progress < 25) {
      return { stage: "01 / 03", text: "INITIALIZING FLEET TELEMATICS & GPS GRID" };
    }
    if (progress < 65) {
      return { stage: "02 / 03", text: "SYNCHRONIZING EXPRESS ROUTE CORRIDORS" };
    }
    if (progress < 90) {
      return { stage: "03 / 03", text: "VERIFYING SAFETY STANDARDS & SEAT MATRIX" };
    }
    return { stage: "READY", text: "WELCOME TO MALENADU TRAVELS" };
  };

  const status = getStageStatus();

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-between py-10 px-6 bg-[#030712] text-slate-100 overflow-hidden select-none transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 blur-xl pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cinematic Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-b from-blue-600/20 via-cyan-500/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px]" />
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      </div>

      {/* 3D Perspective Road Grid */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="perspective-1000 w-full h-full flex items-center justify-center">
          <div
            className="w-[200vw] h-[200vh] animate-grid-drive"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              transformOrigin: '50% 50%',
            }}
          />
        </div>
      </div>

      {/* TOP HEADER: Brand Tag & Skip Button */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold tracking-wider shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MALENADU OS v4.2</span>
          </div>
          <span className="hidden sm:inline-block text-slate-500 text-xs font-medium">|</span>
          <span className="hidden sm:inline-block text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Luxury Transport Systems
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 shadow-xl cursor-pointer"
        >
          <span className="tracking-wider">SKIP INTRO</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
        </button>
      </div>

      {/* CENTER: 3D Emblem Stage */}
      <div className="perspective-1500 z-10 w-full max-w-lg mx-auto flex flex-col items-center justify-center my-auto">
        <div
          className="preserve-3d transition-transform duration-300 ease-out flex flex-col items-center"
          style={{
            transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          }}
        >
          {/* 3D Glass Emblem & Logo */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-8 flex items-center justify-center preserve-3d">
            
            {/* Holographic Glowing Base Reflection */}
            <div 
              className="absolute -bottom-8 w-48 sm:w-60 h-12 rounded-full bg-gradient-to-r from-emerald-500/30 via-cyan-400/40 to-blue-600/30 blur-xl border border-cyan-500/30 transform preserve-3d"
              style={{ transform: 'rotateX(75deg) translateZ(-40px)' }}
            />

            {/* Rotating Outer Tech Ring */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 animate-spin-slow pointer-events-none transform preserve-3d"
              style={{ transform: 'translateZ(20px)' }}
            />

            {/* Second Reverse Ring */}
            <div 
              className="absolute -inset-3 rounded-full border border-cyan-500/20 pointer-events-none transform preserve-3d"
              style={{ transform: 'translateZ(10px)' }}
            />

            {/* Glass Cylinder Frame */}
            <div 
              className="relative w-full h-full rounded-full bg-gradient-to-tr from-slate-950 via-slate-900/90 to-slate-950 border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.25)] backdrop-blur-2xl flex items-center justify-center p-3 preserve-3d"
              style={{ transform: 'translateZ(35px)' }}
            >
              {/* Inner Metallic Bezel */}
              <div 
                className="relative w-full h-full rounded-full p-1 bg-gradient-to-tr from-[#0F4C81] via-[#2196F3] to-[#00C896] shadow-2xl overflow-hidden preserve-3d flex items-center justify-center border border-emerald-400/60"
                style={{ transform: 'translateZ(45px)' }}
              >
                {logoLoaded ? (
                  <img
                    src="/malenadu_circle_logo.jpg"
                    alt="Malenadu Travels Logo"
                    className="w-full h-full object-cover rounded-full shadow-inner block"
                    onError={() => setLogoLoaded(false)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-emerald-400">
                    <Bus className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="preserve-3d space-y-3 text-center" style={{ transform: 'translateZ(40px)' }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium tracking-widest uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>KARNATAKA'S PREMIER BUS NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              MALENADU <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">TRAVELS</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-slate-400 tracking-wider">
              SAFE • LUXURIOUS • PUNCTUAL
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER: Progress Indicator & Telematics */}
      <div className="w-full max-w-xl mx-auto z-20 space-y-3">
        {/* Progress Bar Container */}
        <div className="relative w-full h-2 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{status.stage}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 tracking-wider font-semibold">{status.text}</span>
          </div>
          <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
