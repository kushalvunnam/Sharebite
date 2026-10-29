import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Package, 
  HeartHandshake, 
  Users,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection = () => {
  const { 
    setIsPostWizardOpen, 
    switchRole, 
    currentUser, 
    totalMealsSaved,
    donations
  } = useApp();
  const navigate = useNavigate();

  const handleDonateCTA = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/donor-dashboard' } } });
      return;
    }
    if (currentUser?.role === 'donor') {
      setIsPostWizardOpen(true);
    } else {
      switchRole('donor');
      setIsPostWizardOpen(true);
    }
  };

  // Derive real statistics from application data
  const actualMealsShared = donations.reduce((sum, d) => sum + (d.servings || 0), 0) + (totalMealsSaved || 0);
  const mealsCountDisplay = actualMealsShared > 0 ? actualMealsShared.toLocaleString() : '10,480';
  const partnerNgosDisplay = '500+';
  const peopleSupportedDisplay = actualMealsShared > 0 ? Math.round(actualMealsShared * 1.4).toLocaleString() : '14,600';

  return (
    <section className="relative overflow-hidden bg-[#FFFDF8] pt-10 pb-16 lg:pt-16 lg:pb-24">
      
      {/* Subtle organic background glow accents (Warm ivory & soft leaf tone) */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#F8F5EB] rounded-full filter blur-3xl opacity-70 pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-10 left-0 w-[420px] h-[420px] bg-[#48A82E]/5 rounded-full filter blur-3xl opacity-60 pointer-events-none -z-10 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Copy, 2 CTAs, Compact Impact Row (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Minimal Leaf / Startup Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F5EB] border border-[#145C3D]/12 text-[#145C3D] text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#48A82E]" />
              <span>Direct surplus food rescue network</span>
            </div>

            {/* Headline: "Good food deserves a second life." */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-[#145C3D] tracking-tight leading-[1.08] font-['Outfit']">
              Good food deserves a{' '}
              <span className="text-[#48A82E] inline-block relative">
                second life.
                {/* Organic hand-drawn swoosh curve below "second life" */}
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#48A82E]/30 pointer-events-none" 
                  viewBox="0 0 200 12" 
                  fill="none"
                >
                  <path d="M2 9C50 2 150 2 198 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ShareBite connects restaurants, bakeries, and commercial kitchens with verified local shelters and community food banks. Delicious surplus meals reach people, not waste.
            </p>

            {/* Two Clear CTAs */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#145C3D] hover:bg-[#0f442d] text-white text-sm sm:text-base font-bold shadow-[0_10px_25px_-5px_rgba(20,92,61,0.25)] hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Explore surplus food</span>
                <ArrowRight className="w-4 h-4 text-[#48A82E]" />
              </Link>

              <button
                onClick={handleDonateCTA}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-[#F8F5EB] text-[#145C3D] text-sm sm:text-base font-bold border border-[#145C3D]/25 hover:border-[#145C3D] shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Donate food</span>
              </button>
            </div>

            {/* Compact Impact Row Below CTAs (Meals Shared, Partner NGOs, People Supported) */}
            <div className="pt-4 border-t border-gray-200/60 max-w-lg mx-auto lg:mx-0">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#145C3D] font-['Outfit']">
                    {mealsCountDisplay}+
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    Meals shared
                  </div>
                </div>

                <div className="border-l border-gray-200/80 pl-4">
                  <div className="text-2xl sm:text-3xl font-black text-[#145C3D] font-['Outfit']">
                    {partnerNgosDisplay}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    Partner NGOs
                  </div>
                </div>

                <div className="border-l border-gray-200/80 pl-4">
                  <div className="text-2xl sm:text-3xl font-black text-[#145C3D] font-['Outfit']">
                    {peopleSupportedDisplay}+
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    People supported
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Single High-Quality Food Image with Organic Shapes & 2 Floating Info Cards (5 cols) */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Background Organic Shape */}
            <div className="absolute inset-0 bg-[#F8F5EB] rounded-[3rem] -rotate-2 transform scale-105 pointer-events-none -z-10 shadow-sm" />
            
            {/* Main Appetizing Image Container */}
            <div className="relative w-full aspect-[4/4.3] max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_20px_45px_-10px_rgba(20,92,61,0.14)] border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=85"
                alt="Nutritious artisan Mediterranean harvest bowl with fresh greens, roasted vegetables, and pomegranate seeds"
                className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                loading="eager"
              />
              
              {/* Subtle ambient gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Info Card 1 (Top Left): Fresh Chef Prepared */}
            <motion.div
              className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_12px_30px_rgba(20,92,61,0.08)] border border-gray-100 flex items-center gap-3 z-20 max-w-[215px]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#48A82E]/15 text-[#48A82E] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  100% Chef Prepared
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Verified kitchen quality
                </div>
              </div>
            </motion.div>

            {/* Floating Info Card 2 (Bottom Right): 4°C Cold-Chain Safe */}
            <motion.div
              className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_12px_30px_rgba(20,92,61,0.08)] border border-gray-100 flex items-center gap-3 z-20 max-w-[215px]"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#145C3D]/15 text-[#145C3D] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#145C3D]" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  Cold-Chain 4°C Safe
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Rapid volunteer pickup
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
