import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Flame, 
  Award,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Hero3DBowl } from '../3d/Hero3DBowl';
import { useApp } from '../../context/AppContext';

export const HeroSection = () => {
  const { 
    setIsPostWizardOpen, 
    switchRole, 
    currentUser, 
    availableListingsCount,
    totalMealsSaved 
  } = useApp();
  const navigate = useNavigate();

  const handleDonateCTA = () => {
    if (currentUser?.role === 'donor') {
      setIsPostWizardOpen(true);
    } else {
      switchRole('donor');
      setIsPostWizardOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background 3D mesh grid & ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-12 left-10 w-72 h-72 bg-[#84cc16]/15 rounded-full filter blur-3xl animate-pulse-subtle" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#0f392b]/10 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f392b]/8 border border-[#0f392b]/15 text-[#0f392b] text-xs sm:text-sm font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-ping" />
              <span>⚡ Real-Time Redistribution Network</span>
              <span className="text-gray-300">|</span>
              <span className="text-[#84cc16] font-extrabold">{availableListingsCount} Pickups Available Now</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f392b] tracking-tight leading-[1.08] font-['Outfit']">
              Good Food Deserves a{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0f392b] via-[#267c61] to-[#84cc16]">
                Second Chance.
                {/* Decorative underline brush */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#84cc16] fill-current opacity-80" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M5 12 Q 150 18 295 8 Q 150 14 5 12 Z" />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ShareBite connects restaurants, caterers, bakeries, and grocery stores with nearby non-profits and community shelters to rescue surplus meals safely in under 60 seconds.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleDonateCTA}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-base font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 group border border-[#84cc16]/30"
              >
                <PlusCircle className="w-5 h-5 text-[#84cc16] group-hover:rotate-90 transition-transform duration-300" />
                <span>Donate Surplus Food</span>
              </button>

              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-[#0f392b] text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-gray-200/90 hover:border-[#84cc16]"
              >
                <Search className="w-5 h-5 text-[#84cc16]" />
                <span>Find Food Near You</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>

            {/* Trust and Safety Badges */}
            <div className="pt-4 border-t border-gray-200/70 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#84cc16] shrink-0" />
                <span className="text-xs text-gray-700 font-semibold">Good Samaritan Act Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#84cc16] shrink-0" />
                <span className="text-xs text-gray-700 font-semibold">HACCP Temperature Logged</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Users className="w-4 h-4 text-[#84cc16] shrink-0" />
                <span className="text-xs text-gray-700 font-semibold">100% Free For Shelters</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Floating Food Bowl Visual (5 cols) */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Hero3DBowl />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
