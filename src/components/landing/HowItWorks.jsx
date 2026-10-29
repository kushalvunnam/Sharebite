import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  BellRing, 
  CalendarClock, 
  Heart,
  ArrowRight
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: "List Surplus Food",
      description: "Restaurants list available food with details",
      color: "bg-[#16a34a]",
      badgeColor: "bg-[#16a34a] text-white",
      icon: PlusCircle
    },
    {
      num: 2,
      title: "Get Matched",
      description: "Nearby NGOs get notified",
      color: "bg-[#16a34a]",
      badgeColor: "bg-[#16a34a] text-white",
      icon: BellRing
    },
    {
      num: 3,
      title: "Schedule Pickup",
      description: "Organize quick and safe pickups",
      color: "bg-[#f59e0b]",
      badgeColor: "bg-[#f59e0b] text-white",
      icon: CalendarClock
    },
    {
      num: 4,
      title: "Make an Impact",
      description: "Food reaches people in need",
      color: "bg-[#f43f5e]",
      badgeColor: "bg-[#f43f5e] text-white",
      icon: Heart
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching reference mockup */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
            How ShareBite Works?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Simple, transparent, and direct surplus food redistribution
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                {/* Step number badge circle */}
                <div className={`w-8 h-8 rounded-full ${step.badgeColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                  {step.num}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm text-gray-900 font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
