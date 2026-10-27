import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Flame, 
  Clock, 
  SlidersHorizontal, 
  X, 
  Utensils, 
  Sparkles,
  Layers,
  Map as MapIcon,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DonationCard } from '../components/donation/DonationCard';
import { FOOD_CATEGORIES, DIETARY_OPTIONS } from '../data/demoData';
import CommunityGlobeNetwork from '../components/3d/CommunityGlobeNetwork';

export const ExploreDonationsPage = () => {
  const { donations, setSelectedDonation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [urgencyOnly, setUrgencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('urgent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const toggleDietary = (tag) => {
    setSelectedDietary(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(item => {
      // Search
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Dietary
      const matchesDietary = selectedDietary.length === 0 || 
        selectedDietary.every(d => item.dietaryTags.includes(d));

      // Urgency
      const matchesUrgency = !urgencyOnly || item.urgency === 'urgent';

      return matchesSearch && matchesCategory && matchesDietary && matchesUrgency;
    }).sort((a, b) => {
      if (sortBy === 'urgent') {
        return a.timeRemainingMins - b.timeRemainingMins;
      }
      if (sortBy === 'servings') {
        return b.servings - a.servings;
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
    setMaxDistance(10);
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
        <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#0f392b] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0f392b]'
            }`}
          >
            <Layers className="w-4 h-4" /> Grid Catalog
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-[#0f392b] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0f392b]'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Live Map Grid
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
              <option value="urgent">Sort: Most Urgent First</option>
              <option value="servings">Sort: Largest Portions</option>
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
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                {cat.label}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onSelect={setSelectedDonation}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default ExploreDonationsPage;
