import React, { useEffect, useState } from 'react';
import MicroGigsLogo from './MicroGigsLogo';

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

        
        <div className="relative flex flex-col items-center justify-center scale-150">
          <MicroGigsLogo size="lg" light />
        </div>
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
