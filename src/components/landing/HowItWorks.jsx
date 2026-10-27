import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Cpu, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { TiltCard } from '../3d/TiltCard';

export const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "List Surplus in 60 Seconds",
      subtitle: "Commercial Kitchens & Markets",
      description: "Chefs or managers log surplus batches with portion counts, current temperature reading, and safe pickup window before waste occurs.",
      icon: Camera,
      tag: "HACCP Logged",
      highlight: "Less than 1 minute to submit",
      color: "#84cc16"
    },
    {
      step: "02",
      title: "Smart Radius Matching",
      subtitle: "Instant NGO Push Notifications",
      description: "Our geo-spatial routing algorithm alerts vetted local shelters and community pantries within a 5km radius to claim portions in 1 click.",
      icon: Cpu,
      tag: "Instant Dispatch",
      highlight: "Average 2.4 min reservation speed",
      color: "#f97316"
    },
    {
      step: "03",
      title: "Verified Zero-Waste Handoff",
      subtitle: "Tamper-Evident QR & OTP Confirmation",
      description: "Volunteers arrive at the kitchen loading dock, provide the 6-digit OTP pass, and automatically generate audit-ready tax compliance certificates.",
      icon: QrCode,
      tag: "Tax Deductible",
      highlight: "100% Bill Emerson Act protected",
      color: "#0f392b"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#84cc16]/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" /> Frictionless Community Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
            How ShareBite Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            A frictionless three-step operational workflow engineered for high-pace commercial kitchens and urgent community redistribution.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TiltCard
                key={idx}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_15px_35px_-10px_rgba(15,57,43,0.08)] hover:shadow-[0_25px_45px_-10px_rgba(15,57,43,0.18)] flex flex-col justify-between relative group"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-6 right-8 text-5xl font-black text-gray-100 group-hover:text-[#84cc16]/20 transition-colors font-['Outfit'] pointer-events-none">
                  {item.step}
                </span>

                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f392b] bg-[#84cc16]/20 px-2.5 py-1 rounded-full border border-[#84cc16]/30">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f392b] font-['Outfit'] mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#f97316] mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Highlight Badge */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0f392b]">
                  <CheckCircle2 className="w-4 h-4 text-[#84cc16] shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Operational Guarantee Box */}
        <div className="mt-12 p-6 rounded-3xl bg-[#faf7f2] border border-[#0f392b]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0f392b]">Full Food Safety & Compliance Guarantee</h4>
              <p className="text-xs text-gray-600">Every donation requires temperature logging and verified recipient identification at handoff.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-[#0f392b] bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              HACCP Compliant
            </span>
            <span className="text-xs font-bold text-[#0f392b] bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              42 U.S. Code § 1791
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
