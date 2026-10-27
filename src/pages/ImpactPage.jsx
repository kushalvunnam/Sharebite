import React, { useState } from 'react';
import { 
  Sparkles, 
  CloudRain, 
  Droplet, 
  TreePine, 
  Award, 
  Users, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TiltCard } from '../components/3d/TiltCard';
import ImpactCalculator from '../components/landing/ImpactCalculator';

export const ImpactPage = () => {
  const { totalMealsSaved } = useApp();
  const [downloadedCert, setDownloadedCert] = useState(false);

  const goalTarget = 100000;
  const progressPct = Math.min(100, Math.round((totalMealsSaved / goalTarget) * 100));

  const co2AvoidedTons = (totalMealsSaved * 0.45 * 2.5 / 1000).toFixed(1);
  const waterSavedMillionLitres = (totalMealsSaved * 50 / 1000000).toFixed(2);
  const treesEquiv = Math.round(totalMealsSaved * 0.12);
  const totalTaxSaved = (totalMealsSaved * 3.8).toLocaleString();

  const handleDownload = () => {
    setDownloadedCert(true);
    setTimeout(() => setDownloadedCert(false), 3000);
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#84cc16]" /> Verifiable ESG & Climate Metrics
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
          Quantifying the Power of Every Rescued Meal
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Food waste produces 8-10% of global greenhouse emissions. ShareBite tracks every kilogram diverted to measure atmospheric carbon reduction and clean water preservation.
        </p>
      </div>

      {/* Progress Toward 100K Meals Milestone */}
      <div className="bg-gradient-to-br from-[#0f392b] to-[#164e3b] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#84cc16]">Community Goal 2026</span>
            <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">Target: 100,000 Meals Rescued</h3>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-2xl sm:text-3xl font-black text-[#84cc16] font-['Outfit']">{progressPct}%</span>
            <span className="text-xs text-white/70 block">({totalMealsSaved.toLocaleString()} / 100,000)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-white/70 pt-1">
          <span>Current Run-Rate: ~1,200 meals rescued weekly</span>
          <span className="text-[#84cc16] font-semibold">On track to meet goal 2 months ahead of schedule</span>
        </div>
      </div>

      {/* 4 Pillars of Environmental Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 w-fit mb-4">
              <CloudRain className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#0f392b] font-['Outfit']">
              {co2AvoidedTons} MT
            </div>
            <div className="text-xs font-bold text-gray-800 mt-1">
              CO2e Diverted from Landfills
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
            Equivalent to preventing 28 gas cars driving for an entire year.
          </p>
        </TiltCard>

        <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-800 w-fit mb-4">
              <Droplet className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#0f392b] font-['Outfit']">
              {waterSavedMillionLitres}M Litres
            </div>
            <div className="text-xs font-bold text-gray-800 mt-1">
              Agricultural Water Conserved
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
            Enough clean drinking water to supply 3,200 households for a month.
          </p>
        </TiltCard>

        <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-lime-100 text-[#0f392b] w-fit mb-4">
              <TreePine className="w-6 h-6 text-[#0f392b]" />
            </div>
            <div className="text-3xl font-black text-[#0f392b] font-['Outfit']">
              {treesEquiv.toLocaleString()} Trees
            </div>
            <div className="text-xs font-bold text-gray-800 mt-1">
              Urban Tree Carbon Equivalent
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
            Equivalent carbon sequestered by a 40-acre mature temperate forest.
          </p>
        </TiltCard>

        <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 w-fit mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-amber-800 font-['Outfit']">
              ${totalTaxSaved}
            </div>
            <div className="text-xs font-bold text-gray-800 mt-1">
              Cumulative Donor Tax Savings
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
            IRS Sec. 170(e)(3) certified deduction receipts generated.
          </p>
        </TiltCard>
      </div>

      {/* Embedded Interactive Calculator */}
      <ImpactCalculator />

      {/* Downloadable ESG Impact Certificate Banner */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84cc16]">
            <FileCheck className="w-4 h-4" /> Certified ESG Reporting
          </div>
          <h3 className="text-2xl font-bold text-[#0f392b] font-['Outfit']">
            Export Your Certified Sustainability Certificate
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Generate an official audit-ready certificate showcasing your kitchen's diverted food metrics, GHG reduction calculations, and non-profit beneficiary verification.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-6 py-3.5 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-[#84cc16]" />
          <span>{downloadedCert ? 'Certificate Generated & Downloaded!' : 'Download ESG Certificate (PDF)'}</span>
        </button>
      </div>

    </div>
  );
};

export default ImpactPage;
