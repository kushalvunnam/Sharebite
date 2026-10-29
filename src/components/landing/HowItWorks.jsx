import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "List Surplus Food",
      description: "Chefs and kitchen staff log available portions, allergens, and safe temperature requirements in under two minutes.",
      icon: Utensils,
      accentColor: "bg-[#48A82E]/15 text-[#48A82E]",
      highlight: "Quick 2-minute digital post"
    },
    {
      num: "02",
      title: "Instant NGO Matching",
      description: "Nearby verified shelters and food rescue pantries receive automated proximity alerts based on meal capacities.",
      icon: HeartHandshake,
      accentColor: "bg-[#145C3D]/15 text-[#145C3D]",
      highlight: "Autonomous local matchmaking"
    },
    {
      num: "03",
      title: "Safe Verified Pickup",
      description: "Drivers collect within the cold-chain window. A 6-digit digital OTP handshake verifies the custody transfer.",
      icon: ShieldCheck,
      accentColor: "bg-[#EA580C]/15 text-[#EA580C]",
      highlight: "Cryptographic OTP verification"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FFFDF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#145C3D]/8 text-[#145C3D] text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#48A82E]" />
            <span>Seamless Redistribution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#145C3D] font-['Outfit'] tracking-tight">
            How ShareBite works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 font-normal leading-relaxed">
            From commercial kitchen surplus to community table in three safe, transparent steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(20,92,61,0.04)] hover:shadow-[0_15px_35px_rgba(20,92,61,0.08)] hover:border-[#145C3D]/20 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Row: Large Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#145C3D]/20 group-hover:text-[#145C3D] transition-colors">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl ${step.accentColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#145C3D] transition-colors font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2.5 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Highlight Feature Tag */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#48A82E] shrink-0" />
                  <span>{step.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Context Callout */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#145C3D] hover:bg-[#0f442d] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <span>Join our food rescue network today</span>
            <ArrowRight className="w-4 h-4 text-[#48A82E]" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
