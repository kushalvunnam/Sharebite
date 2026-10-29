import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Package,
  HeartHandshake, 
  UserCheck,
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
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20">
      {/* Background ambient warm glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-10 left-8 w-80 h-80 bg-[#16a34a]/10 rounded-full filter blur-3xl animate-pulse-subtle" />
        <div className="absolute top-20 right-8 w-96 h-96 bg-[#84cc16]/12 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Badge, Headline, Description & CTAs (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Delicate Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#16a34a]/20 text-[#0f392b] text-xs font-bold shadow-xs">
              <span className="text-sm">🌱</span>
              <span className="text-gray-800 font-extrabold text-[12px] tracking-tight">Food Today, Hope Tomorrow</span>
              <span className="text-sm">💚</span>
            </div>

            {/* Main Headline Matching Reference Design */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f392b] tracking-tight leading-[1.08] font-['Outfit']">
              Good Food<br className="hidden sm:inline" /> Should Reach<br className="hidden sm:inline" /> People,{' '}
              <span className="text-[#16a34a]">Not Waste.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ShareBite connects restaurants, hotels and food businesses with NGOs and communities to reduce food waste and fight hunger.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleDonateCTA}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#134e38] hover:bg-[#0f392b] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>Donate Food</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#0f392b] text-sm sm:text-base font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 border border-gray-200/90 hover:border-[#16a34a] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Find Food</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3D Food Bowl Centerpiece (5 cols) */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Hero3DBowl />
          </motion.div>

        </div>

        {/* 4 Metrics Pill Cards Row (Matching Reference) */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Metric 1: Meals Shared */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit']">
                {totalMealsSaved > 0 ? `${totalMealsSaved.toLocaleString()}+` : "10K+"}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Meals Shared
              </div>
            </div>
          </div>

          {/* Metric 2: Partner NGOs */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit']">
                500+
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Partner NGOs
              </div>
            </div>
          </div>

          {/* Metric 3: Active Donors */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit']">
                5K+
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Active Donors
              </div>
            </div>
          </div>

          {/* Metric 4: People Helped */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0f392b] font-['Outfit']">
                8K+
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                People Helped
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
