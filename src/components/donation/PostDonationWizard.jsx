import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Utensils, 
  ShieldCheck, 
  Thermometer, 
  Package, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FOOD_CATEGORIES, DIETARY_OPTIONS, STORAGE_TYPES } from '../../data/demoData';
import confetti from 'canvas-confetti';

const PHOTO_PRESETS = [
  {
    name: "Prepared Pasta & Entrees",
    url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Artisan Breads & Pastries",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Fresh Greens & Salads",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Warm Curries & Rice",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dairy & Fresh Smoothies",
    url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80"
  }
];

export const PostDonationWizard = () => {
  const { 
    isPostWizardOpen, 
    setIsPostWizardOpen, 
    addDonation, 
    currentUser 
  } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Prepared Meals',
    servings: 40,
    weightKg: 15,
    timeRemainingMins: 90,
    pickupWindow: 'Today, 6:00 PM - 7:30 PM',
    storageType: 'Hot Holding (> 140°F / 60°C)',
    temperatureLog: 'Verified 145°F in hot holding unit at 4:30 PM',
    packaging: 'Commercial sealed foil pans with security tape',
    allergens: 'Gluten, Dairy',
    dietaryTags: ['Vegetarian'],
    description: 'Fresh surplus prepared for banquet service. Sealed in thermal containers.',
    imageUrl: PHOTO_PRESETS[0].url,
    address: currentUser?.address || '412 Mulberry St, Downtown (Back kitchen alley)'
  });

  if (!isPostWizardOpen) return null;

  const handleDietaryToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    addDonation({
      ...formData,
      allergens: formData.allergens.split(',').map(s => s.trim()).filter(Boolean)
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    setIsPostWizardOpen(false);
    setStep(1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsPostWizardOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#0f392b] via-[#164e3b] to-[#0f392b] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-['Outfit']">List Surplus Food</h3>
                <p className="text-xs text-white/70">Connect with nearby shelters in under 60 seconds</p>
              </div>
            </div>

            <button
              onClick={() => setIsPostWizardOpen(false)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 pt-4 pb-2 border-b border-gray-100 bg-[#faf7f2] flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0f392b]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-[#0f392b] text-white' : 'bg-gray-200 text-gray-500'
              }`}>1</span>
              <span>Food Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200">
              <div className={`h-full bg-[#84cc16] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0f392b]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-[#0f392b] text-white' : 'bg-gray-200 text-gray-500'
              }`}>2</span>
              <span>Safety & Storage</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200">
              <div className={`h-full bg-[#84cc16] transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0f392b]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 3 ? 'bg-[#0f392b] text-white' : 'bg-gray-200 text-gray-500'
              }`}>3</span>
              <span>Photo & Handoff</span>
            </div>
          </div>

          {/* Form Wizard Steps */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* STEP 1: Food Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Food Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roasted Mediterranean Vegetable Pasta"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#84cc16] text-sm font-medium bg-white"
                    >
                      {FOOD_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Safe Pickup Window
                    </label>
                    <input
                      type="text"
                      value={formData.pickupWindow}
                      onChange={(e) => setFormData({ ...formData, pickupWindow: e.target.value })}
                      placeholder="e.g. Today, 5:30 PM - 7:00 PM"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#84cc16] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Portions (Servings)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.servings}
                      onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-[#0f392b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Approx Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-[#0f392b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Urgency Window (mins)
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={formData.timeRemainingMins}
                      onChange={(e) => setFormData({ ...formData, timeRemainingMins: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Brief Food Description
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe how it was prepared, ingredients, freshness..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-700"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Safety & Storage */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Storage Protocol
                  </label>
                  <select
                    value={formData.storageType}
                    onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-medium bg-white"
                  >
                    {STORAGE_TYPES.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Temperature Log Certification
                  </label>
                  <input
                    type="text"
                    value={formData.temperatureLog}
                    onChange={(e) => setFormData({ ...formData, temperatureLog: e.target.value })}
                    placeholder="e.g. Kept at 145°F continuously, tested with probe"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Certified under standard FDA Food Code temperature holding rules.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Packaging & Tamper Seal Method
                  </label>
                  <input
                    type="text"
                    value={formData.packaging}
                    onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                    placeholder="e.g. Food-grade foil pans with sealed security tape"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Common Allergens (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.allergens}
                    onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                    placeholder="e.g. Gluten, Dairy, Sesame (or None)"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Dietary Badges (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((opt) => {
                      const isSelected = formData.dietaryTags.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleDietaryToggle(opt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-[#0f392b] text-white border-[#0f392b]'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Photo & Handoff Instructions */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Select Representative High-Res Photo Preset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PHOTO_PRESETS.map((preset, idx) => {
                      const isSelected = formData.imageUrl === preset.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected ? 'border-[#84cc16] ring-2 ring-[#84cc16]/50' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                            <span className="text-[10px] font-bold text-white leading-tight">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#84cc16] text-[#0f392b] flex items-center justify-center font-bold text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Custom Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Handoff Location & Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 412 Mulberry St (Kitchen service door, buzz 3)"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0f392b]/5 border border-[#84cc16]/30 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#84cc16] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#0f392b] leading-relaxed">
                    <strong>Bill Emerson Good Samaritan Act Shield:</strong> Donating surplus in good faith is fully protected against civil and criminal liability under federal statute 42 U.S. Code § 1791.
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPostWizardOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !formData.title) return;
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0f392b] text-white text-xs font-bold hover:bg-[#164e3b] flex items-center gap-1.5 shadow-md"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#84cc16]" />
                  <span>Publish Surplus Listing</span>
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PostDonationWizard;
