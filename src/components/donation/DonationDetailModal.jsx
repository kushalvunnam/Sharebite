import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  MapPin, 
  Users, 
  Scale, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  Package, 
  QrCode, 
  Key, 
  HeartHandshake, 
  CheckCircle2, 
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const DonationDetailModal = () => {
  const { 
    selectedDonation, 
    setSelectedDonation, 
    claimDonation, 
    currentUser 
  } = useApp();

  const [copied, setCopied] = useState(false);

  // Lock background scroll when modal is active and restore on close
  useEffect(() => {
    if (selectedDonation) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedDonation]);

  // Support keyboard Escape to close modal
  useEffect(() => {
    if (!selectedDonation) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDonation(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDonation, setSelectedDonation]);

  const isAvailable = selectedDonation?.status === 'available';
  const isClaimed = selectedDonation?.status === 'claimed';
  const isCompleted = selectedDonation?.status === 'completed';

  const handleClaim = async () => {
    if (!selectedDonation) return;
    const recipientOrg = currentUser?.role === 'recipient' 
      ? currentUser.organization 
      : "Eastside Hope Food Rescue & Shelter";
    
    const res = await claimDonation(selectedDonation.id, recipientOrg);
    if (res && res.success !== false) {
      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const copyCode = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const dietaryTags = Array.isArray(selectedDonation?.dietaryTags) 
    ? selectedDonation.dietaryTags 
    : [];

  const allergensList = Array.isArray(selectedDonation?.allergens)
    ? selectedDonation.allergens.join(', ')
    : (selectedDonation?.allergens || 'None reported');

  return (
    <AnimatePresence>
      {selectedDonation && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-food-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          {/* Backdrop with dark translucent styling and blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedDonation(null)}
            className="fixed inset-0"
            style={{
              backgroundColor: 'rgba(10, 20, 15, 0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)'
            }}
          />

          {/* Modal Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative z-10 flex flex-col bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-[#0f392b]/15 max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-32px)] supports-[max-height:100dvh]:max-h-[calc(100dvh-24px)] sm:supports-[max-height:100dvh]:max-h-[calc(100dvh-32px)]"
            style={{
              width: 'min(720px, calc(100vw - 32px))'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Banner Food Image (Pinned Header) */}
            <div className="relative h-44 sm:h-56 w-full shrink-0 overflow-hidden bg-gray-900">
              <img
                src={selectedDonation.imageUrl}
                alt={selectedDonation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

              {/* Badges on Banner */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex flex-wrap gap-2 pr-12">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold tracking-wide uppercase bg-[#134e38] text-[#84cc16] border border-[#84cc16]/40 shadow-xs">
                  {selectedDonation.category}
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold bg-[#16a34a] text-white shadow-xs">
                  🌱 Fresh Batch
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold bg-black/50 backdrop-blur-md text-amber-300 border border-white/20 shadow-xs flex items-center gap-1">
                  ★ 4.8 <span className="text-white/80 font-normal">(120 reviews)</span>
                </span>
              </div>

              {/* Close button - Always visible with high contrast */}
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                aria-label="Close food details modal"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:ring-offset-2 focus:ring-offset-black"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Donor Info over image */}
              <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                <div className="flex items-center gap-2 text-xs text-[#84cc16] font-semibold mb-1">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{selectedDonation.donorName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" /> HACCP Certified
                  </span>
                </div>
                <h2 id="modal-food-title" className="text-lg sm:text-2xl font-bold font-['Outfit'] leading-tight line-clamp-2">
                  {selectedDonation.title}
                </h2>
              </div>
            </div>

            {/* Body Content (Independently scrollable) */}
            <div className="p-4 sm:p-6 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 bg-[#faf7f2] p-3 sm:p-3.5 rounded-2xl border border-gray-100 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-500 text-[11px] sm:text-xs font-medium">
                    <Users className="w-3.5 h-3.5 text-[#0f392b]" /> Servings
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#0f392b] font-['Outfit'] mt-0.5">
                    {selectedDonation.servings} Meals
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-500 text-[11px] sm:text-xs font-medium">
                    <Scale className="w-3.5 h-3.5 text-[#0f392b]" /> Net Weight
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#0f392b] font-['Outfit'] mt-0.5">
                    {selectedDonation.weightKg} kg
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-500 text-[11px] sm:text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Expiry Window
                  </div>
                  <div className="text-base sm:text-lg font-bold text-amber-700 font-['Outfit'] mt-0.5">
                    {selectedDonation.timeRemainingMins} mins
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Food Overview & Condition
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {selectedDonation.description}
                </p>
              </div>

              {/* Food Safety, Temperature & Packaging Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <Thermometer className="w-4 h-4 text-[#f97316]" />
                    <span>Temperature Log</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedDonation.temperatureLog}
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <Package className="w-4 h-4 text-[#0f392b]" />
                    <span>Packaging & Seal</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedDonation.packaging}
                  </p>
                </div>
              </div>

              {/* Dietary & Allergens */}
              <div className="space-y-3">
                {dietaryTags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Dietary Certifications
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dietaryTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-xs font-bold bg-[#84cc16]/15 text-[#0f392b] border border-[#84cc16]/30"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Allergen Notice
                  </h4>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs text-gray-600">
                      Contains or prepared near: <strong className="text-gray-900">{allergensList}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup Details & Address */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0f392b]/5 border border-[#0f392b]/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0f392b] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#84cc16]" /> Pickup Location
                  </span>
                  <span className="text-gray-500 font-semibold">{selectedDonation.distance}</span>
                </div>
                <p className="text-xs text-gray-800 font-medium">
                  {selectedDonation.address}
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Pickup Window: <strong className="text-gray-900">{selectedDonation.pickupWindow}</strong></span>
                </div>
              </div>

              {/* Handoff Verification Pass (When Claimed or Completed) */}
              {(isClaimed || isCompleted) && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0f392b] to-[#164e3b] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-[#84cc16]" />
                      <h4 className="font-bold text-sm font-['Outfit']">
                        Handoff Verification Pass
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#84cc16] text-[#0f392b]">
                      {isCompleted ? 'Verified & Completed' : 'Ready for Pickup'}
                    </span>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed">
                    Claimed by <strong className="text-white">{selectedDonation.claimedBy || "Eastside Hope Food Rescue"}</strong>.
                    Present this verification pass or provide the 6-digit OTP code to kitchen staff at collection.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 text-center">
                      <div className="text-[10px] text-white/60 font-semibold uppercase">Pickup Code</div>
                      <div className="text-base font-extrabold text-[#84cc16] tracking-wider mt-0.5">
                        {selectedDonation.verificationCode}
                      </div>
                    </div>

                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 text-center">
                      <div className="text-[10px] text-white/60 font-semibold uppercase">6-Digit Handoff OTP</div>
                      <div className="text-base font-extrabold text-[#f97316] tracking-widest mt-0.5">
                        {selectedDonation.otpCode || "439201"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyCode(`ShareBite Pickup: ${selectedDonation.verificationCode} | OTP: ${selectedDonation.otpCode}`)}
                    className="w-full py-2 rounded-xl bg-white/15 hover:bg-white/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  >
                    <Key className="w-3.5 h-3.5 text-[#84cc16]" />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Handoff Details'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Action Footer (Pinned Non-Scrolling) */}
            <div className="p-3.5 sm:p-5 border-t border-gray-100 bg-gray-50/95 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>

              {isAvailable ? (
                <button
                  type="button"
                  onClick={handleClaim}
                  className="flex-1 py-3 px-4 sm:px-6 rounded-2xl bg-[#134e38] hover:bg-[#0f392b] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:ring-offset-2 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#84cc16]" />
                  <span>Request This Food →</span>
                </button>
              ) : isClaimed ? (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/90 px-4 py-2.5 rounded-xl border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Active Reservation • Pickup in Progress</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-[#0f392b] bg-[#84cc16]/20 px-4 py-2.5 rounded-xl border border-[#84cc16]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#0f392b]" />
                  <span>Zero-Waste Redistribution Complete</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonationDetailModal;
