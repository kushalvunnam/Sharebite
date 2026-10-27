import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Flame, 
  Clock, 
  X, 
  Utensils, 
  Sparkles,
  Layers,
  List as ListIcon,
  Map as MapIcon,
  ShieldCheck,
  ArrowRight,
  Users,
  Thermometer,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DonationCard } from '../components/donation/DonationCard';
import { FOOD_CATEGORIES, DIETARY_OPTIONS } from '../data/demoData';
import CommunityGlobeNetwork from '../components/3d/CommunityGlobeNetwork';

export const ExploreDonationsPage = () => {
  const { donations, setSelectedDonation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [urgencyOnly, setUrgencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('urgent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'map'

  const toggleDietary = (tag) => {
    setSelectedDietary(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Dynamic live counts per food category
  const categoryCounts = useMemo(() => {
    const counts = { all: donations.length };
    donations.forEach(d => {
      if (d.category) {
        counts[d.category] = (counts[d.category] || 0) + 1;
      }
    });
    return counts;
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter(item => {
      // Search
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Dietary
      const matchesDietary = selectedDietary.length === 0 || 
        selectedDietary.every(d => item.dietaryTags?.includes(d));

      // Urgency
      const matchesUrgency = !urgencyOnly || item.urgency === 'urgent';

      return matchesSearch && matchesCategory && matchesDietary && matchesUrgency;
    }).sort((a, b) => {
      if (sortBy === 'urgent') {
        return (a.timeRemainingMins || 999) - (b.timeRemainingMins || 999);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'servings') {
        return (b.servings || 0) - (a.servings || 0);
      }
      if (sortBy === 'weight') {
        return (b.weightKg || 0) - (a.weightKg || 0);
      }
      return 0;
    });
  }, [donations, searchQuery, selectedCategory, selectedDietary, urgencyOnly, sortBy]);

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    selectedDietary.length + 
    (urgencyOnly ? 1 : 0) + 
    (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDietary([]);
    setUrgencyOnly(false);
    setSortBy('urgent');
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0f392b]" /> Live Redistribution Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f392b] font-['Outfit']">
            Browse Available Surplus Food
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time surplus listings ready for immediate pickup by registered NGOs, shelters, and food banks.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#0f392b] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0f392b]'
            }`}
          >
            <Layers className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-[#0f392b] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0f392b]'
            }`}
          >
            <ListIcon className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-[#0f392b] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0f392b]'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Radar Map
          </button>
        </div>
      </div>

      {/* Search & Quick Filter Cluster */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by meal, kitchen name, sourdough, pasta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Urgent toggle */}
            <button
              onClick={() => setUrgencyOnly(!urgencyOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                urgencyOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Expiring Soon (&lt;90m)</span>
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 focus:border-[#84cc16] cursor-pointer"
            >
              <option value="urgent">Sort: Urgent Pickup Window</option>
              <option value="newest">Sort: Newly Listed</option>
              <option value="servings">Sort: Largest Portions</option>
              <option value="weight">Sort: Heaviest Weight (kg)</option>
            </select>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-gray-100">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-gray-200/90 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dietary Checkbox Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-gray-400 font-semibold mr-1">Dietary:</span>
          {DIETARY_OPTIONS.map((tag) => {
            const isSelected = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDietary(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  isSelected
                    ? 'bg-[#84cc16] text-[#0f392b] border-[#84cc16] font-bold'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="space-y-6">
          <CommunityGlobeNetwork />
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center">
            <h3 className="font-bold text-lg text-[#0f392b]">Nearby Dispatch Radius: 5.0 km</h3>
            <p className="text-xs text-gray-500 mt-1">
              Select any node on the radar network above to see real-time inventory and contact details.
            </p>
          </div>
        </div>
      ) : (
        <>
          {filteredDonations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-12">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">
                {donations.length === 0 ? "No donations yet" : "No surplus matched your criteria"}
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                {donations.length === 0
                  ? "There are currently no food surplus listings available in the network. Be the first to list surplus food!"
                  : "Try loosening your filters or clearing search terms to explore available pickups."}
              </p>
              {donations.length > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-xl bg-[#0f392b] text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onSelect={setSelectedDonation}
                />
              ))}
            </div>
          ) : (
            /* Horizontal List View */
            <div className="space-y-4">
              {filteredDonations.map((donation) => {
                const isUrgent = donation.urgency === 'urgent';
                const isAvailable = donation.status === 'available';
                const isClaimed = donation.status === 'claimed';
                const isCompleted = donation.status === 'completed';

                return (
                  <div
                    key={donation.id}
                    onClick={() => setSelectedDonation(donation)}
                    className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:border-[#84cc16]/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-4 items-stretch group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-56 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={donation.imageUrl}
                        alt={donation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-black/60 text-white backdrop-blur-xs">
                          {donation.category}
                        </span>
                      </div>
                      {isAvailable && isUrgent && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                            <Flame className="w-3 h-3" /> {donation.timeRemainingMins}m left
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span className="font-semibold text-[#0f392b] flex items-center gap-1">
                            {donation.donorName}
                            <ShieldCheck className="w-3.5 h-3.5 text-[#84cc16]" />
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-[#84cc16]" />
                            {donation.distance}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0f392b] transition-colors font-['Outfit']">
                          {donation.title}
                        </h3>

                        <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                          {donation.description}
                        </p>

                        {/* Dietary tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {donation.dietaryTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#faf7f2] text-[#0f392b] border border-[#0f392b]/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#84cc16]" />
                            {donation.servings} Servings ({donation.weightKg} kg)
                          </span>
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3.5 h-3.5 text-[#f97316]" />
                            {donation.storageType}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            Window: {donation.pickupWindow}
                          </span>
                        </div>

                        <button
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all self-end ${
                            isAvailable
                              ? 'bg-[#0f392b] text-white group-hover:bg-[#84cc16] group-hover:text-[#0f392b]'
                              : isClaimed
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <span>{isAvailable ? 'Claim Surplus' : 'View Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default ExploreDonationsPage;
