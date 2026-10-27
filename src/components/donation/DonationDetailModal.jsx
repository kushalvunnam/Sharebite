import React, { useState } from 'react';
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
  Calendar,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const DonationDetailModal = () => {
  const { 
    selectedDonation, 
    setSelectedDonation, 
    claimDonation, 
    currentUser, 
    switchRole 
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!selectedDonation) return null;

  const isAvailable = selectedDonation.status === 'available';
  const isClaimed = selectedDonation.status === 'claimed';
  const isCompleted = selectedDonation.status === 'completed';

  const handleClaim = () => {
    // If current role is donor or guest, seamlessly set to recipient NGO for the claim
    const recipientOrg = currentUser?.role === 'recipient' 
      ? currentUser.organization 
      : "Eastside Hope Food Rescue & Shelter";
    
    claimDonation(selectedDonation.id, recipientOrg);
    
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
  };

  const copyCode = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedDonation(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedDonation(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Banner Food Image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900">
            <img
              src={selectedDonation.imageUrl}
              alt={selectedDonation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges on Banner */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold tracking-wide uppercase bg-[#0f392b]/80 backdrop-blur-md text-[#84cc16] border border-[#84cc16]/30">
                {selectedDonation.category}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {selectedDonation.storageType}
              </span>
            </div>

            {/* Title & Donor Info over image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-xs text-[#84cc16] font-semibold mb-1">
                <Building2 className="w-4 h-4" />
                <span>{selectedDonation.donorName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> HACCP Certified
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] leading-tight">
                {selectedDonation.title}
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 bg-[#faf7f2] p-3.5 rounded-2xl border border-gray-100 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-[#0f392b]" /> Servings
                </div>
                <div className="text-lg font-bold text-[#0f392b] font-['Outfit'] mt-0.5">
                  {selectedDonation.servings} Meals
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs font-medium">
                  <Scale className="w-3.5 h-3.5 text-[#0f392b]" /> Net Weight
                </div>
                <div className="text-lg font-bold text-[#0f392b] font-['Outfit'] mt-0.5">
                  {selectedDonation.weightKg} kg
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Expiry Window
                </div>
                <div className="text-lg font-bold text-amber-700 font-['Outfit'] mt-0.5">
                  {selectedDonation.timeRemainingMins} mins
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Food Overview & Condition
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedDonation.description}
              </p>
            </div>

            {/* Food Safety, Temperature & Packaging Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                  <Thermometer className="w-4 h-4 text-[#f97316]" />
                  <span>Temperature Log</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedDonation.temperatureLog}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70">
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
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Dietary Certifications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDonation.dietaryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-[#84cc16]/15 text-[#0f392b] border border-[#84cc16]/30"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Allergen Notice
                </h4>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs text-gray-600">
                    Contains or prepared near: <strong className="text-gray-900">{selectedDonation.allergens.join(', ')}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Pickup Details & Address */}
            <div className="p-4 rounded-2xl bg-[#0f392b]/5 border border-[#0f392b]/15 space-y-2">
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

            {/* Handoff Verification Panel (When Claimed or Completed) */}
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

                <p className="text-xs text-white/80">
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
                  onClick={() => copyCode(`ShareBite Pickup: ${selectedDonation.verificationCode} | OTP: ${selectedDonation.otpCode}`)}
                  className="w-full py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-[#84cc16]" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Handoff Details'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Action Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedDonation(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200/70 transition-colors"
            >
              Close
            </button>

            {isAvailable ? (
              <button
                onClick={handleClaim}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <HeartHandshake className="w-5 h-5 text-[#84cc16]" />
                <span>Reserve for Food Rescue (1-Click)</span>
              </button>
            ) : isClaimed ? (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 px-4 py-2.5 rounded-xl">
                <Clock className="w-4 h-4" />
                <span>Active Reservation • Pickup in Progress</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f392b] bg-[#84cc16]/20 px-4 py-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#84cc16]" />
                <span>Zero-Waste Redistribution Complete</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DonationDetailModal;
