import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Thermometer, 
  Package, 
  FileCheck2, 
  AlertCircle, 
  ArrowRight,
  Scale
} from 'lucide-react';

export const FoodSafetyNotice = () => {
  return (
    <section className="py-16 sm:py-20 relative bg-[#092119] text-white overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#84cc16]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f97316]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Card */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 text-[#84cc16] text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" /> Federal Legal Protection & Safety Shield
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
                Food Safety & Good Samaritan Responsibility
              </h2>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                Under the federal <strong>Bill Emerson Good Samaritan Food Donation Act (42 U.S. Code § 1791)</strong>, commercial food donors and non-profit distribution centers are comprehensively protected from civil and criminal liability when donating wholesome food in good faith.
              </p>
            </div>

            <Link
              to="/safety"
              className="px-6 py-3 rounded-2xl bg-[#84cc16] hover:bg-[#a3e635] text-[#0f392b] text-xs font-bold transition-all flex items-center gap-2 shadow-lg shrink-0"
            >
              <span>Read Full Legal Shield</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Pillars of Safety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center mb-3">
                <Thermometer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Cold & Hot Chain Logging</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Cold items maintained &lt; 40°F (4°C); hot prepared items kept &gt; 140°F (60°C).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Tamper-Evident Seals</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                All bulk containers sealed with date-marked tamper verification labels prior to pickup.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Allergen Transparency</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Mandatory disclosure of the 9 major allergens (nuts, dairy, gluten, soy, eggs, fish, etc).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Verified Organizations</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Non-profits are verified for 501(c)(3) status and safe food handling equipment.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FoodSafetyNotice;
