import React, { useState } from 'react';
import { 
  Calculator, 
  CloudRain, 
  Droplet, 
  Users, 
  DollarSign, 
  Sparkles, 
  FileText, 
  ArrowRight,
  Download
} from 'lucide-react';
import { TiltCard } from '../3d/TiltCard';

export const ImpactCalculator = () => {
  const [weeklyMeals, setWeeklyMeals] = useState(0);

  // Environmental and financial formulas:
  // Average meal waste = ~0.45 kg
  // 1 kg food waste generates ~2.5 kg CO2e
  // 1 meal saved conserves ~50 litres water
  // Tax deduction under IRC 170(e)(3) ~ $3.80 per meal cost recovery
  const annualMeals = weeklyMeals * 52;
  const annualCo2Kg = Math.round(annualMeals * 0.45 * 2.5);
  const annualWaterLitres = Math.round(annualMeals * 50);
  const annualTaxUsd = Math.round(annualMeals * 3.8);
  const peopleFedWeekly = Math.round(weeklyMeals / 1.5);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#faf7f2] via-white to-[#faf7f2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" /> Interactive Environmental & Tax Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
            Calculate Your Kitchen’s Waste Rescue Impact
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Move the slider to calculate the real-world carbon reduction, clean water conservation, and enhanced corporate tax deductions your business can generate.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Slider & Input (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Weekly Surplus Volume
              </span>
              <span className="text-xs font-bold text-[#84cc16] bg-[#0f392b] px-3 py-1 rounded-full">
                Interactive Model
              </span>
            </div>

            {/* Large Active Counter Display */}
            <div className="text-center p-6 rounded-2xl bg-[#faf7f2] border border-[#0f392b]/10">
              <div className="text-5xl font-black text-[#0f392b] font-['Outfit']">
                {weeklyMeals}
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
                Portions Rescued Every Week
              </div>
              <div className="text-xs text-gray-400 mt-1">
                (~{(weeklyMeals * 0.45).toFixed(1)} kg of prepared food)
              </div>
            </div>

            {/* Slider Range */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                <span>0 meals (New kitchen)</span>
                <span>1,000+ (Hotel / Caterer)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={weeklyMeals}
                onChange={(e) => setWeeklyMeals(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#84cc16]"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-gray-400 font-medium">Presets:</span>
              <button
                onClick={() => setWeeklyMeals(50)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#84cc16]/20 text-[#0f392b] transition-colors"
              >
                Bakery (50)
              </button>
              <button
                onClick={() => setWeeklyMeals(200)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#84cc16]/20 text-[#0f392b] transition-colors"
              >
                Bistro (200)
              </button>
              <button
                onClick={() => setWeeklyMeals(600)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 hover:bg-[#84cc16]/20 text-[#0f392b] transition-colors"
              >
                Catering (600)
              </button>
            </div>
          </div>

          {/* Right Column: Computed 4 Dimensions of Impact (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Impact 1: CO2 Abatement */}
            <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                  <CloudRain className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Annual GHGs
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
                  {(annualCo2Kg / 1000).toFixed(1)} MT
                </div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  CO2e Prevented Annually
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Prevents anaerobic methane breakdown in municipal landfills.
                </p>
              </div>
            </TiltCard>

            {/* Impact 2: Water Saved */}
            <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
                  <Droplet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  Water Footprint
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
                  {(annualWaterLitres / 1000).toLocaleString()} kL
                </div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  Litres of Water Conserved
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Embodied water saved across agriculture, irrigation, and harvest.
                </p>
              </div>
            </TiltCard>

            {/* Impact 3: Community Nourished */}
            <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Social SROI
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
                  {peopleFedWeekly} People
                </div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  Nourished Every Week
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Delivered warm to homeless shelters and youth kitchens.
                </p>
              </div>
            </TiltCard>

            {/* Impact 4: Enhanced Tax Deduction */}
            <TiltCard className="p-6 rounded-3xl bg-[#0f392b] text-white border border-[#84cc16]/30 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-[#84cc16] text-[#0f392b]">
                  <DollarSign className="w-6 h-6 font-bold" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#84cc16] bg-white/10 px-2 py-0.5 rounded-full">
                  IRS Sec. 170(e)(3)
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#84cc16] font-['Outfit']">
                  ${annualTaxUsd.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  Estimated Annual Tax Deduction
                </div>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  Up to twice the production cost deduction for verified food donations.
                </p>
              </div>
            </TiltCard>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ImpactCalculator;
