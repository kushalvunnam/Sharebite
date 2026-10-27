import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonationCard } from '../donation/DonationCard';
import { FOOD_CATEGORIES } from '../../data/demoData';

export const FeaturedDonations = () => {
  const { donations, setSelectedDonation } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter donations
  const availableDonations = donations.filter(d => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  return (
    <section className="py-12 sm:py-20 relative bg-[#faf7f2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> High Priority Food Rescues
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
              Surplus Meals Ready for Pickup
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              Freshly prepared foods, morning artisan bakes, and organic produce with confirmed temperature logs.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f392b] hover:text-[#84cc16] transition-colors self-start md:self-auto"
          >
            <span>Explore full surplus catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#0f392b] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Food Listings Grid or Clean Empty State */}
        {availableDonations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#84cc16]/15 text-[#0f392b] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[#84cc16]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f392b] font-['Outfit']">No donations yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              There are currently no active surplus food listings in this category. Be the first to donate surplus meals or check back shortly!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/donor-dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-md"
              >
                List First Donation
              </Link>
              <Link
                to="/explore"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {availableDonations.slice(0, 6).map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onSelect={setSelectedDonation}
              />
            ))}
          </div>
        )}

        {/* Bottom Banner CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span>Browse All Available Pickups</span>
            <ArrowRight className="w-4 h-4 text-[#84cc16]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDonations;
