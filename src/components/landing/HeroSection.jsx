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
  Users,
  Leaf,
  Store,
  HeartHandshake,
  Utensils
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
          
          {/* Left Column: Headline, Description, CTAs & 3 Metrics (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Small Badge: COMMUNITY FOOD RESCUE NETWORK with minimal leaf icon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/25 text-[#0f392b] text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
              <span className="uppercase tracking-wider text-[11px] font-extrabold text-[#0f392b]">
                COMMUNITY FOOD RESCUE NETWORK
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f392b] tracking-tight leading-[1.08] font-['Outfit']">
              Good food deserves a{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#84cc16]">
                second chance.
                {/* Decorative underline brush */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#84cc16] fill-current opacity-80" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M5 12 Q 150 18 295 8 Q 150 14 5 12 Z" />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ShareBite connects surplus food from local kitchens with community shelters and people in need. Less food waste. Stronger communities. A healthier planet.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-base font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0 group border border-[#84cc16]/30"
              >
                <span>Explore available food</span>
                <ArrowRight className="w-5 h-5 text-[#84cc16] group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleDonateCTA}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-[#0f392b] text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 border border-gray-200/90 hover:border-[#16a34a] hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-5 h-5 text-[#16a34a]" />
                <span>Donate surplus food</span>
              </button>
            </div>

            {/* Three Impact Metrics with Icons */}
            <div className="pt-6 border-t border-gray-200/70 grid grid-cols-3 gap-4 sm:gap-6 text-left">
              {/* Metric 1: Meals Rescued */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#16a34a]/15 text-[#0f392b] flex items-center justify-center shrink-0 shadow-xs border border-[#16a34a]/20">
                  <Utensils className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit'] leading-tight">
                    {totalMealsSaved > 0 ? `${totalMealsSaved.toLocaleString()}+` : "2,400+"}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Meals rescued
                  </div>
                </div>
              </div>

              {/* Metric 2: Partner Kitchens */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0f392b]/10 text-[#0f392b] flex items-center justify-center shrink-0 shadow-xs border border-[#0f392b]/15">
                  <Store className="w-5 h-5 text-[#0f392b]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit'] leading-tight">
                    84+
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Partner kitchens
                  </div>
                </div>
              </div>

              {/* Metric 3: Community Partners */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#f97316]/15 text-[#f97316] flex items-center justify-center shrink-0 shadow-xs border border-[#f97316]/20">
                  <HeartHandshake className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit'] leading-tight">
                    36+
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-0.5">
                    Community partners
                  </div>
                </div>
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
