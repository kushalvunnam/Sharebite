import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedDonations = () => {
  const { donations, setSelectedDonation } = useApp();

  // Take the first 3 actual donations from application data
  const displayDonations = (donations || []).slice(0, 3);

  return (
    <section className="py-14 sm:py-20 bg-[#F8F5EB]/60 border-t border-b border-[#145C3D]/8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Title, Subtitle & Clean "View all" Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#145C3D]/10 text-[#145C3D] text-xs font-bold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#48A82E]" />
              <span>Available in your community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#145C3D] font-['Outfit'] tracking-tight">
              Fresh food, ready to be shared
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-xl font-normal leading-relaxed">
              Safe, high-quality surplus meals from licensed commercial kitchens awaiting pickup by local shelters.
            </p>
          </div>

          <Link
            to="/explore"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#145C3D] hover:text-[#48A82E] transition-colors self-start md:self-auto py-1"
          >
            <span>View all surplus food</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Attractive Donation Cards Grid */}
        {displayDonations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F8F5EB] border border-[#145C3D]/10 flex items-center justify-center mx-auto text-[#145C3D]">
              <Utensils className="w-6 h-6 text-[#145C3D]" />
            </div>
            <h3 className="text-xl font-bold text-[#145C3D] font-['Outfit']">
              Ready for the Next Surplus Batch
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Commercial kitchens and food establishments post surplus daily. Be the first to claim freshly prepared portions or list your own kitchen surplus.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/explore"
                className="px-5 py-2.5 rounded-full bg-[#145C3D] text-white text-xs font-bold hover:bg-[#0f442d] transition-all cursor-pointer"
              >
                Explore Surplus Food →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayDonations.map((item) => {
              const isAvailable = item.status === 'available';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDonation(item)}
                  className="bg-white rounded-3xl border border-gray-100/90 shadow-[0_4px_25px_rgba(20,92,61,0.04)] hover:shadow-[0_15px_35px_rgba(20,92,61,0.1)] hover:border-[#145C3D]/25 transition-all duration-300 flex flex-col cursor-pointer group overflow-hidden"
                >
                  {/* Food Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges: Category & Status */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#145C3D] shadow-xs backdrop-blur-md">
                        {item.category || 'Meals'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                        isAvailable
                          ? 'bg-[#145C3D] text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-[#48A82E] animate-pulse' : 'bg-white'}`} />
                        <span>{isAvailable ? 'Available Now' : 'Claimed'}</span>
                      </span>
                    </div>

                    {/* Distance Pill over Image */}
                    {item.distance && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#48A82E]" />
                        <span>{item.distance}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Donor Kitchen Name */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <span className="font-semibold text-gray-700">{item.donorName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#48A82E]" />
                        <span className="text-[11px] text-gray-400">• Certified</span>
                      </div>

                      {/* Food Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#145C3D] transition-colors font-['Outfit'] line-clamp-1">
                        {item.title}
                      </h3>

                      {/* Key Attributes Row */}
                      <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#145C3D]" />
                          <span className="font-bold text-gray-900">{item.servings} servings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="truncate">{item.pickupWindow || `${item.timeRemainingMins || 45}m window`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        className="w-full py-2.5 px-4 rounded-2xl bg-[#F8F5EB] group-hover:bg-[#145C3D] text-[#145C3D] group-hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>{isAvailable ? 'Request This Food' : 'View Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedDonations;
