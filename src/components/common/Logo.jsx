import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = "default", showTagline = true, lightMode = false, linkTo = "/" }) => {
  const isLarge = size === "large";
  const isSmall = size === "small";

  const Content = (
    <div className="flex items-center gap-3 group select-none">
      {/* 3D-styled Emblem Icon */}
      <div 
        className={`relative flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-md ${
          isLarge ? 'w-13 h-13' : isSmall ? 'w-8 h-8 rounded-xl' : 'w-11 h-11'
        } ${lightMode ? 'bg-white shadow-black/10' : 'bg-gradient-to-br from-[#0f392b] to-[#164e3b] border border-[#84cc16]/40'}`}
      >
        {/* SVG Plate, Heart & Sprouting Leaf Motif */}
        <svg 
          viewBox="0 0 100 100" 
          className={isLarge ? 'w-9 h-9' : isSmall ? 'w-5 h-5' : 'w-7 h-7'} 
          fill="none"
        >
          {/* Outer glowing rim */}
          <circle cx="50" cy="50" r="44" stroke="#84cc16" strokeWidth="4" strokeDasharray="6 3" className="opacity-75" />
          
          {/* Ceramic Plate curve */}
          <ellipse cx="50" cy="62" rx="30" ry="14" fill="#faf7f2" />
          <ellipse cx="50" cy="61" rx="22" ry="9" fill="#e5dfd3" />
          
          {/* Sprouting Heart / Leaf Fusion Motif */}
          <path 
            d="M50 20 C40 10, 24 18, 30 35 C34 47, 50 56, 50 56 C50 56, 66 47, 70 35 C76 18, 60 10, 50 20 Z" 
            fill="#48A82E" 
          />
          {/* Leaf Central Vein */}
          <path 
            d="M50 22 C48 32, 47 42, 50 52" 
            stroke="#145C3D" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* Warm Amber Spark / Second Chance Sparkle */}
          <circle cx="72" cy="22" r="5" fill="#f97316" />
        </svg>

        {/* Ambient subtle glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#48A82E]/20 filter blur-md -z-10 group-hover:blur-lg transition-all" />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black font-['Outfit'] tracking-tight ${
            isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl'
          } ${lightMode ? 'text-white' : 'text-[#145C3D]'}`}>
            Share<span className="text-[#48A82E]">Bite</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
        </div>
        
        {showTagline && (
          <span className={`text-[10px] font-semibold tracking-wide uppercase transition-colors ${
            lightMode ? 'text-white/70' : 'text-[#0f392b]/70'
          }`}>
            Share more. Waste less.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="inline-block">{Content}</Link>;
  }

  return Content;
};

export default Logo;
