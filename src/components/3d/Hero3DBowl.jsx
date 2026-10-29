import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  Leaf, 
  Utensils,
  Flame,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero3DBowl = () => {
  const { totalMealsSaved, availableListingsCount } = useApp();
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 8, y: -10 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Ticking countdown seconds for realistic urgency simulation
  const [secondsLeft, setSecondsLeft] = useState(38 * 60 + 24);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 60 ? prev - 1 : 45 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m : ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 14;
    const rotY = ((x - centerX) / centerX) * 18;

    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 6, y: -8 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] mx-auto h-[490px] sm:h-[550px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Mint-Green & Warm Glow */}
      <div className="absolute inset-0 bg-radial from-[#6ee7b7]/25 via-[#84cc16]/10 to-transparent rounded-full filter blur-3xl -z-10 animate-pulse-subtle pointer-events-none" />

      {/* Main 3D Rotating Wrapper */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Curved Dotted Green Connection Lines SVG Canvas */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 580 550"
          fill="none"
        >
          {/* Curve 1: From Card 1 (Fresh Surplus) to Center Bowl */}
          <path
            d="M 120 90 Q 180 180 290 260"
            stroke="#16a34a"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            className="opacity-60"
          />
          {/* Curve 2: From Center Bowl to Card 2 (Pickup Countdown) */}
          <path
            d="M 330 290 Q 430 310 460 380"
            stroke="#16a34a"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            className="opacity-60"
          />
          {/* Curve 3: From Card 3 (Helping Communities) to Center Bowl */}
          <path
            d="M 150 430 Q 200 370 270 320"
            stroke="#84cc16"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            className="opacity-50"
          />
        </svg>

        {/* Soft 3D Ground Shadow */}
        <div
          className="absolute bottom-6 w-84 h-16 rounded-[100%] bg-gradient-to-r from-transparent via-[#0f392b]/30 to-transparent filter blur-xl transform transition-transform duration-300"
          style={{
            transform: 'translateZ(-80px) rotateX(75deg)',
          }}
        />

        {/* 3D Ceramic Bowl Base with layered realistic lighting */}
        <div
          className="relative w-76 sm:w-92 h-76 sm:h-92 rounded-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)',
          }}
        >
          {/* Ceramic Outer Bowl Body (Smooth porcelain ivory texture) */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffffff] via-[#f7f4ec] to-[#ded5c2] shadow-[0_30px_70px_-15px_rgba(15,57,43,0.35),inset_0_-12px_24px_rgba(15,57,43,0.15)] border-4 border-white/90"
            style={{
              transform: 'translateZ(0px)',
            }}
          />

          {/* Deep Bowl Inner Lip */}
          <div
            className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-b from-[#1a382b]/15 via-[#ece7dc] to-[#ffffff] shadow-[inset_0_15px_30px_rgba(15,57,43,0.2)]"
            style={{
              transform: 'translateZ(15px)',
            }}
          />

          {/* Bowl Contents: Fresh vegetables, leafy greens, tomatoes, apples, and artisan bread */}
          <div 
            className="absolute inset-5 sm:inset-6 rounded-full overflow-hidden flex items-center justify-center shadow-inner"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(30px)',
            }}
          >
            {/* Salad bed base */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2d6a4f] via-[#40916c] to-[#74c69d] opacity-95 rounded-full" />
            
            {/* High-res food bowl photography centerpiece */}
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=750&q=80"
              alt="Fresh harvest bowl with organic vegetables, heirloom tomatoes, and crisp greens"
              className="w-full h-full object-cover object-center rounded-full scale-105 filter contrast-105 brightness-105"
              loading="eager"
            />

            {/* Glossy ceramic rim reflection highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/40 pointer-events-none" />
          </div>

          {/* Floating Fresh Sourdough Bread Wedge (Layer: Z=65px) */}
          <motion.div
            className="absolute -top-4 -right-1 sm:-right-3 w-26 sm:w-28 h-26 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(65px)',
            }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
              alt="Artisan Sourdough"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-md rounded-md py-0.5 px-1.5 text-[9px] sm:text-[10px] text-white font-medium text-center">
              Artisan Bread
            </div>
          </motion.div>

          {/* Floating Crisp Fresh Red Apple / Produce (Layer: Z=75px) */}
          <motion.div
            className="absolute -bottom-3 -right-2 w-22 sm:w-24 h-22 sm:h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(75px)',
            }}
            animate={{
              y: [0, 8, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80"
              alt="Fresh Crisp Apples"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-md rounded-md py-0.5 px-1.5 text-[9px] sm:text-[10px] text-white font-medium text-center">
              Crisp Apples
            </div>
          </motion.div>

          {/* Floating Botanical Leaf 1 (Layer: Z=85px) */}
          <motion.div
            className="absolute top-2 left-4 bg-gradient-to-r from-[#16a34a] to-[#15803d] p-2.5 sm:p-3 rounded-2xl shadow-xl text-white flex items-center justify-center border border-white/30"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(85px)',
            }}
            animate={{
              y: [0, -6, 0],
              rotate: [-6, 6, -6]
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Leaf className="w-5 h-5 drop-shadow" />
          </motion.div>

          {/* Floating Botanical Leaf 2 (Layer: Z=105px) */}
          <motion.div
            className="absolute bottom-12 right-12 w-8 h-8 rounded-full bg-[#84cc16]/25 backdrop-blur-md text-[#16a34a] flex items-center justify-center border border-[#16a34a]/30"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(105px)',
            }}
            animate={{
              y: [0, 7, 0],
              rotate: [10, -10, 10]
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
          >
            <Leaf className="w-4 h-4 text-[#16a34a]" />
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* THREE FLOATING TRANSLUCENT CARDS REQUIRED BY SPECIFICATION     */}
        {/* ============================================================== */}

        {/* Card 1: Fresh Surplus Available (Top Left) */}
        <motion.div
          className="absolute -top-3 sm:top-2 left-0 sm:-left-12 bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(15,57,43,0.12)] border border-[#0f392b]/10 flex items-center gap-3 z-30 max-w-[240px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(95px)',
          }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#16a34a]/15 text-[#16a34a] flex items-center justify-center shrink-0 border border-[#16a34a]/20">
            <PackageCheck className="w-5 h-5 text-[#16a34a]" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#16a34a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              Fresh Surplus Available
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0f392b] font-['Outfit'] mt-0.5">
              {availableListingsCount > 0 ? `${availableListingsCount * 25}+ Servings Ready` : "120+ Servings Ready"}
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              Daily farm harvest & bakery surplus
            </div>
          </div>
        </motion.div>

        {/* Card 2: Pickup Countdown (Right / Bottom-Right) */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 right-0 sm:-right-8 bg-[#0f392b]/95 text-white backdrop-blur-xl px-4 py-3.5 rounded-2xl shadow-[0_25px_50px_rgba(15,57,43,0.35)] border border-[#84cc16]/35 flex items-center gap-3 z-30 max-w-[245px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(105px)',
          }}
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#84cc16] text-[#0f392b] flex items-center justify-center shrink-0 font-bold shadow-sm">
            <Clock className="w-5 h-5 text-[#0f392b]" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#84cc16] flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#f97316]" /> Pickup Countdown
            </div>
            <div className="text-sm font-black text-[#faf7f2] font-mono tracking-wider mt-0.5">
              {formatCountdown(secondsLeft)}
            </div>
            <div className="text-[10px] text-white/70 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#84cc16]" /> Cold-chain 4°C preserved
            </div>
          </div>
        </motion.div>

        {/* Card 3: Helping Communities (Bottom Left) */}
        <motion.div
          className="absolute -bottom-4 sm:bottom-2 left-2 sm:-left-8 bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(15,57,43,0.12)] border border-[#0f392b]/10 flex items-center gap-3 z-25 max-w-[235px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(90px)',
          }}
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#f97316]/15 text-[#f97316] flex items-center justify-center shrink-0 border border-[#f97316]/20">
            <HeartHandshake className="w-5 h-5 text-[#f97316]" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#f97316]">
              Helping Communities
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0f392b] font-['Outfit'] mt-0.5">
              450+ Families Fed
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              18 local shelters & pantries active
            </div>
          </div>
        </motion.div>

        {/* Scripted Typography on top-right (matching reference) */}
        <motion.div
          className="absolute -top-6 right-2 z-20 pointer-events-none hidden sm:block"
          style={{
            transform: 'translateZ(40px)',
          }}
          animate={{
            rotate: [1, -1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="font-serif italic text-gray-500 text-xs sm:text-sm tracking-wide text-right leading-tight">
            Share<br />
            Love<br />
            <span className="text-[#16a34a] font-semibold">Nourish</span><br />
            Together 🍃
          </div>
        </motion.div>

        {/* Floating Pill: Fresh Food / Brighter Tomorrows (matching reference bottom right) */}
        <motion.div
          className="absolute -bottom-6 right-8 sm:right-16 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-30"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(110px)',
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-xs text-gray-900 leading-tight">Fresh Food</div>
            <div className="text-[10px] text-gray-500 font-medium">Brighter Tomorrows</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero3DBowl;
