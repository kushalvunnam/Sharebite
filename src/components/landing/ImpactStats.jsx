import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, CloudRain, Store, HeartHandshake, TrendingUp, Sparkles } from 'lucide-react';
import { TiltCard } from '../3d/TiltCard';
import { useApp } from '../../context/AppContext';

export const ImpactStats = () => {
  const { totalMealsSaved } = useApp();

  const stats = [
    {
      id: "meals",
      icon: Utensils,
      value: `${totalMealsSaved.toLocaleString()}+`,
      label: "Meals Rescued & Served",
      detail: "Wholesome, nutritious surplus diverted from landfills",
      color: "#84cc16",
      bgLight: "bg-[#84cc16]/10",
      accent: "text-[#84cc16]"
    },
    {
      id: "co2",
      icon: CloudRain,
      value: "115.8 Tons",
      label: "CO2 Emissions Prevented",
      detail: "Equivalent to removing 28 gas cars off the road for a year",
      color: "#267c61",
      bgLight: "bg-[#267c61]/10",
      accent: "text-[#267c61]"
    },
    {
      id: "donors",
      icon: Store,
      value: "324+",
      label: "Verified Donor Kitchens",
      detail: "Bakeries, trattorias, caterers, & supermarket partners",
      color: "#0f392b",
      bgLight: "bg-[#0f392b]/10",
      accent: "text-[#0f392b]"
    },
    {
      id: "ngos",
      icon: HeartHandshake,
      value: "146+",
      label: "Partner NGOs & Shelters",
      detail: "Vetted 501(c)(3) charities & community food banks",
      color: "#f97316",
      bgLight: "bg-[#f97316]/10",
      accent: "text-[#f97316]"
    }
  ];

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0f392b]" /> Real-Time Ecological & Community Footprint
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
            Tangible Impact in Every Hand-Off
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Every surplus listing converts potential food waste into immediate nutrition and carbon reduction.
          </p>
        </div>

        {/* 4 Dimensional Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <TiltCard
                key={stat.id}
                maxTilt={10}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_25px_-5px_rgba(15,57,43,0.08)] hover:shadow-[0_20px_35px_-10px_rgba(15,57,43,0.18)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.accent}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      Verified
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
                    {stat.value}
                  </div>

                  <div className="text-sm font-bold text-gray-900 mt-1">
                    {stat.label}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
                  {stat.detail}
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Live Community Activity Ticker */}
        <div className="mt-8 bg-gradient-to-r from-[#0f392b] via-[#164e3b] to-[#0f392b] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-ping" />
            <span className="text-xs font-semibold text-white/90">
              <strong className="text-[#84cc16]">Live Ticker:</strong> Verde Artisan Trattoria handed off 45 portions to Eastside Shelter • 14 mins ago
            </span>
          </div>

          <div className="text-xs font-bold text-[#84cc16] flex items-center gap-1.5 shrink-0">
            <TrendingUp className="w-4 h-4" /> Platform Average Handoff: 28 mins
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
