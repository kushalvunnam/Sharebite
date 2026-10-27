import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Clock, Heart, Leaf, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero3DBowl = () => {
  const { totalMealsSaved, availableListingsCount } = useApp();
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 8, y: -10 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 20;

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
      className="relative w-full max-w-[560px] mx-auto h-[480px] sm:h-[540px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background radial ambient glow */}
      <div className="absolute inset-0 bg-radial from-[#84cc16]/20 via-[#0f392b]/5 to-transparent rounded-full filter blur-3xl -z-10 animate-pulse-subtle" />

      {/* Main 3D Rotating Wrapper */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Soft 3D Ground Shadow */}
        <div
          className="absolute bottom-6 w-80 h-16 rounded-[100%] bg-gradient-to-r from-transparent via-[#0f392b]/35 to-transparent filter blur-xl transform transition-transform duration-300"
          style={{
            transform: 'translateZ(-80px) rotateX(75deg)',
          }}
        />

        {/* 3D Ceramic Bowl Base with layered realistic lighting */}
        <div
          className="relative w-80 sm:w-96 h-80 sm:h-96 rounded-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)',
          }}
        >
          {/* Ceramic Outer Bowl Body */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffffff] via-[#f7f3ea] to-[#dfd7c6] shadow-[0_25px_60px_-15px_rgba(15,57,43,0.35),inset_0_-12px_24px_rgba(15,57,43,0.15)] border-4 border-white/80"
            style={{
              transform: 'translateZ(0px)',
            }}
          />

          {/* Deep Bowl Inner Lip */}
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-b from-[#1a382b]/15 via-[#ece7dc] to-[#ffffff] shadow-[inset_0_15px_30px_rgba(15,57,43,0.2)]"
            style={{
              transform: 'translateZ(15px)',
            }}
          />

          {/* Bowl Contents / Fresh Organic Food Elements */}
          <div 
            className="absolute inset-6 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(30px)',
            }}
          >
            {/* Salad bed base */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#319777] via-[#4d8b31] to-[#84cc16] opacity-90 rounded-full" />
            
            {/* High-res food bowl photography centerpiece */}
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80"
              alt="Fresh harvest salad and organic surplus bowl"
              className="w-full h-full object-cover object-center rounded-full scale-105 filter contrast-105 brightness-105"
              loading="eager"
            />

            {/* Glossy ceramic rim reflection highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/40 pointer-events-none" />
          </div>

          {/* Floating Fresh Sourdough Bread Wedge (Layer 1: Z=50px) */}
          <motion.div
            className="absolute -top-6 -right-2 w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/70"
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
            <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-md rounded-md py-0.5 px-1.5 text-[10px] text-white font-medium text-center">
              Artisan Loaves
            </div>
          </motion.div>

          {/* Floating Fresh Avocado & Lime Slice (Layer 2: Z=75px) */}
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/70"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(75px)',
            }}
            animate={{
              y: [0, 10, 0],
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
              src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80"
              alt="Fresh Avocado"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-md rounded-md py-0.5 px-1.5 text-[10px] text-white font-medium text-center">
              Fresh Produce
            </div>
          </motion.div>

          {/* Floating Fresh Basil Leaf Motif */}
          <motion.div
            className="absolute top-4 left-6 bg-gradient-to-r from-[#84cc16] to-[#4d8b31] p-3 rounded-2xl shadow-xl text-white flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(85px)',
            }}
            animate={{
              y: [0, -6, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Leaf className="w-6 h-6 drop-shadow" />
          </motion.div>
        </div>

        {/* 3D Dimensional Orbiting Chips */}
        {/* Chip 1: Top-Left Rescue Stat */}
        <motion.div
          className="absolute -top-4 sm:top-2 left-0 sm:-left-12 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_15px_30px_rgba(15,57,43,0.12)] border border-[#0f392b]/10 flex items-center gap-3 z-30"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(90px)',
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
          <div className="w-9 h-9 rounded-xl bg-[#84cc16]/20 text-[#0f392b] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#84cc16]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0f392b] flex items-center gap-1">
              Zero Waste Today
            </div>
            <div className="text-[11px] text-[#0f392b]/70 font-medium">
              {totalMealsSaved > 0 ? `${totalMealsSaved.toLocaleString()}+ Meals Rescued` : '0 Meals Rescued'}
            </div>
          </div>
        </motion.div>

        {/* Chip 2: Bottom-Right Safety & Timing Chip */}
        <motion.div
          className="absolute -bottom-6 sm:bottom-4 right-0 sm:-right-8 bg-[#0f392b] text-white px-4 py-2.5 rounded-2xl shadow-[0_20px_35px_rgba(15,57,43,0.35)] border border-[#84cc16]/30 flex items-center gap-3 z-30"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(100px)',
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
          <div className="w-9 h-9 rounded-xl bg-[#84cc16] text-[#0f392b] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#0f392b]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#faf7f2] flex items-center gap-1">
              HACCP & FDA Compliant
            </div>
            <div className="text-[11px] text-[#84cc16] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> {totalMealsSaved > 0 ? 'Average pickup: 28 mins' : 'Ready for pickup handoffs'}
            </div>
          </div>
        </motion.div>

        {/* Chip 3: Floating Micro Pill */}
        <motion.div
          className="hidden sm:flex absolute bottom-20 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-[#84cc16]/30 items-center gap-2 text-xs font-semibold text-[#0f392b] z-20"
          style={{
            transform: 'translateZ(70px)',
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-ping" />
          <span>{availableListingsCount > 0 ? `Live Match: ${availableListingsCount} Surplus Active` : 'Redistribution Network Ready'}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero3DBowl;
