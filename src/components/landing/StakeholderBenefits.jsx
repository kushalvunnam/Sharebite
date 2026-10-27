import React, { useState } from 'react';
import { 
  Building2, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  FileCheck, 
  Sparkles,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { TiltCard } from '../3d/TiltCard';

export const StakeholderBenefits = () => {
  const [activeTab, setActiveTab] = useState('donors');

  const donorBenefits = [
    {
      title: "Enhanced Tax Write-Offs",
      desc: "Automatically receive IRS-compliant 170(e)(3) donation receipts allowing deductions up to twice the food production cost basis.",
      icon: DollarSign,
    },
    {
      title: "100% Legal Protection",
      desc: "Full civil and criminal liability shield guaranteed by the federal Bill Emerson Good Samaritan Food Donation Act.",
      icon: ShieldCheck,
    },
    {
      title: "Eliminate Waste Hauling Fees",
      desc: "Slash municipal organic waste surcharge and dumpster disposal expenses by diverting clean surplus directly to verified community channels.",
      icon: TrendingUp,
    },
    {
      title: "Elevated Brand & ESG Score",
      desc: "Showcase genuine verifiable sustainability metrics to eco-conscious diners and investors with real-time impact badges.",
      icon: Leaf,
    }
  ];

  const ngoBenefits = [
    {
      title: "100% Free Nutritional Food",
      desc: "Receive chef-prepared hot meals, artisan bakery goods, and fresh organic produce completely free of charge.",
      icon: Sparkles,
    },
    {
      title: "Safe Temperature Chain Tracking",
      desc: "Every donation carries certified HACCP temperature logs, tamper-evident seals, and full ingredient/allergen disclosures.",
      icon: FileCheck,
    },
    {
      title: "Predictable Local Supply",
      desc: "Lock in scheduled daily surplus pickups from neighborhood grocers and banquet kitchens to feed hundreds reliably.",
      icon: Clock,
    },
    {
      title: "Frictionless Handoffs with QR Pass",
      desc: "Instant pickup verification with single-tap 6-digit OTP tokens to respect volunteer time and kitchen workflows.",
      icon: HeartHandshake,
    }
  ];

  const currentBenefits = activeTab === 'donors' ? donorBenefits : ngoBenefits;

  return (
    <section className="py-16 sm:py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> High-Value Two-Sided Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
            Designed for Both Donors & Non-Profits
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            ShareBite eliminates the friction of food redistribution, making zero waste profitable for businesses and life-saving for charities.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[#faf7f2] border border-gray-200">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'donors'
                  ? 'bg-[#0f392b] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#0f392b]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#84cc16]" />
              <span>For Food Businesses & Donors</span>
            </button>
            <button
              onClick={() => setActiveTab('ngos')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ngos'
                  ? 'bg-[#0f392b] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#0f392b]'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-[#84cc16]" />
              <span>For Non-Profits & Shelters</span>
            </button>
          </div>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentBenefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <TiltCard
                key={idx}
                className="p-6 rounded-3xl bg-[#faf7f2] border border-gray-100 hover:border-[#84cc16]/40 transition-all shadow-xs hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-[#0f392b] font-['Outfit'] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-[#0f392b]">
                  <CheckCircle2 className="w-4 h-4 text-[#84cc16]" />
                  <span>Guaranteed feature</span>
                </div>
              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default StakeholderBenefits;
