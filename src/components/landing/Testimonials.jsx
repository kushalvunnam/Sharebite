import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../../data/demoData';
import { TiltCard } from '../3d/TiltCard';

export const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#faf7f2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-3">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Community Voices & Trust
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
            Trusted by Kitchens & Shelters Alike
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            See how restaurants and community organizations transform daily surplus into dignified nourishment.
          </p>
        </div>

        {/* Testimonials 3D Grid or Clean Zero State */}
        {MOCK_TESTIMONIALS.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#84cc16]/15 text-[#0f392b] flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0f392b] font-['Outfit']">No community reviews yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Reviews, partner ratings, and volunteer stories will appear once verified donors and recipient organizations complete initial surplus handoffs.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              Ratings: Not yet rated
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.map((t) => (
              <TiltCard
                key={t.id}
                className="bg-white p-7 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* 5-star rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-[#84cc16]/40 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#84cc16]/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#0f392b]">{t.author}</h4>
                    <div className="text-[11px] text-gray-500 font-medium">{t.role}</div>
                    <div className="text-[11px] font-semibold text-[#84cc16] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#84cc16]" /> {t.organization}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;
