import React from 'react';
import { 
  Clock, 
  MapPin, 
  Users, 
  Thermometer, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { TiltCard } from '../3d/TiltCard';
import { useApp } from '../../context/AppContext';

export const DonationCard = ({ donation, onSelect }) => {
  const { setSelectedDonation } = useApp();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(donation);
    } else {
      setSelectedDonation(donation);
    }
  };

  const isUrgent = donation.urgency === 'urgent';
  const isAvailable = donation.status === 'available';
  const isClaimed = donation.status === 'claimed';
  const isCompleted = donation.status === 'completed';

  return (
    <TiltCard
      onClick={handleCardClick}
      className="bg-white border border-gray-100/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group overflow-hidden"
    >
      {/* Top Image Banner with Floating Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category & Rating Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-[#134e38] text-[#84cc16] shadow-sm">
            {donation.category}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
            ★ 4.8
          </span>
        </div>

        {/* Favorite Heart & Urgency Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isAvailable && isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/90 text-white shadow-md animate-pulse">
              <Flame className="w-3 h-3" />
              <span>{donation.timeRemainingMins}m</span>
            </span>
          )}
          {isClaimed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#f97316] text-white shadow-md">
              <Clock className="w-3 h-3" />
              <span>Claimed</span>
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#0f392b] text-[#84cc16] shadow-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>Preserved</span>
            </span>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-rose-500 flex items-center justify-center backdrop-blur-md shadow-sm transition-transform hover:scale-110 cursor-pointer"
            title="Save to favorites"
          >
            ♥
          </div>
        </div>

        {/* Portion Count Overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
            <Users className="w-4 h-4 text-[#84cc16]" />
            <span className="text-white font-bold">{donation.servings} Servings</span>
            <span className="text-white/70">({donation.weightKg} kg)</span>
          </div>
        </div>

        {/* Distance indicator */}
        <div className="absolute bottom-3 right-3 text-white text-xs font-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#84cc16]" />
          <span>{donation.distance}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Donor Kitchen Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-semibold text-[#0f392b] truncate max-w-[200px]">
              {donation.donorName}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#84cc16]" /> Verified
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#0f392b] transition-colors line-clamp-1 font-['Outfit']">
            {donation.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
            {donation.description}
          </p>

          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {donation.dietaryTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#faf7f2] text-[#0f392b] border border-[#0f392b]/10"
              >
                {tag}
              </span>
            ))}
            {donation.dietaryTags.length > 3 && (
              <span className="text-[10px] text-gray-400 font-medium self-center">
                +{donation.dietaryTags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Storage and CTA */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500 truncate max-w-[170px]">
            <Thermometer className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
            <span className="truncate text-[11px]">{donation.storageType}</span>
          </div>

          <button
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              isAvailable
                ? 'bg-[#134e38] text-white hover:bg-[#0f392b] shadow-xs'
                : isClaimed
                ? 'bg-amber-100 text-amber-900'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span>{isAvailable ? 'Request Now' : 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </TiltCard>
  );
};

export default DonationCard;
