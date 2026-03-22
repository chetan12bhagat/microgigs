import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const MicroGigsLogo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  light = false,
  size = 'md'
}) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-32 md:h-40'
  };

  const primaryColor = light ? "#FFFFFF" : "#1a2744"; // Dark Navy from reference
  const accentColor = light ? "rgba(255,255,255,0.7)" : "#4facfe"; // Subtle accent
  
  const textColor = light ? "text-white" : "text-[#1a2744]";
  const subtextColor = light ? "text-white/70" : "text-[#1a2744]/70";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Academic Icon (Graduation Cap) */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${sizes[size]} w-auto transition-all duration-300`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cap Top (Mortarboard) */}
        <path 
          d="M50 20 L90 40 L50 60 L10 40 Z" 
          fill={primaryColor} 
        />
        {/* Stylized Curve on Top (Path of Growth) */}
        <path 
          d="M40 35 C45 30 55 30 60 35 C55 45 45 45 40 35 Z" 
          fill={light ? "rgba(255,255,255,0.2)" : "white"} 
          fillOpacity={light ? "0.3" : "0.4"}
        />
        {/* Cap Base */}
        <path 
          d="M25 48 L25 65 C25 65 35 75 50 75 C65 75 75 65 75 65 L75 48 L50 63 Z" 
          fill={primaryColor} 
          fillOpacity="0.9"
        />
        {/* Tassel */}
        <path 
          d="M90 40 L90 65 L85 70" 
          stroke={primaryColor} 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <circle cx="85" cy="72" r="3" fill={primaryColor} />
      </svg>

      {/* Vertical Separator */}
      {showText && size !== 'sm' && (
        <div className={`h-12 w-[1.5px] ${light ? 'bg-white/30' : 'bg-[#1a2744]/30'}`}></div>
      )}

      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-black tracking-widest leading-none ${size === 'xl' ? 'text-5xl md:text-6xl' : size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl'} ${textColor} uppercase`}>
            MicroGig<span className="text-sky-500">s</span>
          </span>
          {size !== 'sm' && (
            <div className="mt-1 flex items-center gap-2">
                <span className={`font-bold tracking-[0.3em] uppercase ${size === 'xl' ? 'text-xs md:text-sm' : 'text-[9px]'} ${subtextColor}`}>
                    Student Micro-Project Platform
                </span>
                {size === 'xl' && <div className={`h-[1px] flex-grow ${light ? 'bg-white/20' : 'bg-[#1a2744]/20'}`}></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MicroGigsLogo;
