import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade-out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a2744] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative flex items-center justify-center">
        {/* Animated Background Crystals */}
        <div className="absolute -inset-16 animate-float opacity-20">
            <svg viewBox="0 0 200 200" className="w-64 h-64 fill-[#00e5ff]">
                <path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z" />
            </svg>
        </div>
        
        {/* Logo Icon (Approximated Crystal) */}
        <div className="relative z-10 scale-125 animate-pulse">
            <svg viewBox="0 0 500 500" className="w-48 h-48 drop-shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                <path d="M250,30 L430,140 L430,360 L250,470 L70,360 L70,140 Z" fill="white" fillOpacity="0.1" stroke="#00e5ff" strokeWidth="2" />
                <path d="M250,30 L430,140 L250,250 Z" fill="#1565c0" />
                <path d="M430,140 L430,360 L250,250 Z" fill="#1e88e5" />
                <path d="M430,360 L250,470 L250,250 Z" fill="#29b6f6" />
                <path d="M250,470 L70,360 L250,250 Z" fill="#1565c0" />
                <path d="M70,360 L70,140 L250,250 Z" fill="#1e88e5" />
                <path d="M70,140 L250,30 L250,250 Z" fill="#29b6f6" />
            </svg>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white font-manrope">
            Micro<span className="text-[#29b6f6]">Gigs</span>
        </h1>
        <p className="mt-2 text-sm font-medium tracking-widest text-[#a0aec0] uppercase">
            Student Micro-Project Platform
        </p>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-20 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#1565c0] to-[#00e5ff] animate-loading-bar" style={{ width: '100%' }}></div>
      </div>

      <style>{`
        @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
        }
        .animate-loading-bar {
            animation: loading-bar 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
