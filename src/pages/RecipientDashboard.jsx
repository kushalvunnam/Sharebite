import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Clock, 
  MapPin, 
  QrCode, 
  ShieldCheck, 
  Users, 
  Utensils, 
  CheckCircle2, 
  Search,
  Key,
  XCircle,
  Truck,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TiltCard } from '../components/3d/TiltCard';
import { Link } from 'react-router-dom';

export const RecipientDashboard = () => {
  const { 
    currentUser, 
    donations, 
    cancelClaim, 
    setSelectedDonation,
    claimDonation 
  } = useApp();

  const [activeTab, setActiveTab] = useState('claimed');

  // Claimed items
  const myClaimedDonations = donations.filter(d => 
    d.status === 'claimed' && (d.claimedBy?.includes(currentUser?.organization) || d.claimedBy?.includes("Eastside") || !d.claimedBy)
  );

  const availableNearby = donations.filter(d => d.status === 'available');
  const pastReceived = donations.filter(d => d.status === 'completed' && (d.claimedBy?.includes(currentUser?.organization) || d.claimedBy?.includes("Eastside")));

  const totalDistributed = pastReceived.reduce((sum, d) => sum + (d.servings || 0), 0);
  const familiesSupported = Math.round(totalDistributed / 3);
  const budgetSaved = Math.round(totalDistributed * 3.8);

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#f97316] shrink-0">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"}
              alt="Shelter Director"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0f392b] font-['Outfit']">
                {currentUser?.organization || "Eastside Hope Food Rescue & Shelter"}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                (currentUser?.isVerified || currentUser?.verified)
                  ? "bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {(currentUser?.isVerified || currentUser?.verified) ? "VERIFIED 501(c)(3) CHARITY" : "NOT VERIFIED"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Director: <strong className="text-gray-800">{currentUser?.name}</strong> • Tax ID: {currentUser?.taxId || "Not verified"} • Cold-Chain Certified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/settings"
            className="px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:border-[#f97316] hover:bg-[#f97316]/10 text-[#0f392b] text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            title="Account & Profile Settings"
          >
            <Settings className="w-4 h-4 text-[#f97316]" />
            <span>Settings</span>
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[#84cc16]" />
            <span>Browse Available Surplus</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Meals Distributed</span>
            <div className="p-2 rounded-xl bg-[#84cc16]/20 text-[#0f392b]">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0f392b] font-['Outfit'] mt-2">
            {totalDistributed.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {totalDistributed > 0 ? "Nutritious surplus served hot" : "No meals distributed yet"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Families Supported</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-800 font-['Outfit'] mt-2">
            {familiesSupported.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {familiesSupported > 0 ? "Across local community centers" : "No families served yet"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Budget Saved</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800 font-['Outfit'] mt-2">
            ${budgetSaved.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {budgetSaved > 0 ? "Reallocated to emergency shelter beds" : "No budget savings recorded"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Pending Pickups</span>
            <div className="p-2 rounded-xl bg-[#f97316]/10 text-[#f97316]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#f97316] font-['Outfit'] mt-2">
            {myClaimedDonations.length} Active
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Scheduled for collection today
          </div>
        </TiltCard>
      </div>

      {/* Section 1: Active Reserved Pickups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f392b] font-['Outfit'] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#f97316]" />
            <span>Active Reservations Scheduled for Collection</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">
            {myClaimedDonations.length} Scheduled
          </span>
        </div>

        {myClaimedDonations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-gray-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="font-bold text-gray-700">No active pickups pending</h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Explore open donations from nearby restaurants to claim for tonight's shelter service.
            </p>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl bg-[#0f392b] text-white text-xs font-bold"
            >
              Browse Surplus Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myClaimedDonations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#f97316]/15 text-[#f97316]">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 mt-1 font-['Outfit']">
                        {item.title}
                      </h3>
                      <div className="text-xs text-[#0f392b] font-semibold">
                        Donor: {item.donorName}
                      </div>
                    </div>

                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                  </div>

                  {/* Pickup Info */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-gray-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Portions: <strong className="text-gray-900">{item.servings} Meals ({item.weightKg} kg)</strong></span>
                      <span className="text-amber-700 font-bold">Pick up within {item.timeRemainingMins}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-[#84cc16] shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>

                  {/* Handoff Verification Token Banner */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#0f392b] text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-white/60 font-semibold uppercase">Volunteer Handoff Pass</div>
                      <div className="text-xs font-semibold text-[#84cc16] mt-0.5">
                        Code: {item.verificationCode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/60 font-semibold uppercase">Show OTP to Chef</div>
                      <div className="text-lg font-black text-[#f97316] font-mono tracking-widest">
                        {item.otpCode || "439201"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => cancelClaim(item.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Reservation
                  </button>

                  <button
                    onClick={() => setSelectedDonation(item)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors"
                  >
                    View Pass Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Open Nearby Donations Ready for Instant Claim */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f392b] font-['Outfit'] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#84cc16]" />
            <span>Open Surplus Available Nearby for Rescue</span>
          </h2>
          <Link to="/explore" className="text-xs font-bold text-[#0f392b] hover:underline">
            View All ({availableNearby.length})
          </Link>
        </div>

        {availableNearby.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center">
            <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="font-bold text-gray-700">No active food listings</h4>
            <p className="text-xs text-gray-500 mt-1">
              There are currently no surplus food batches available nearby. Check back soon or alert local food donors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableNearby.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-36 rounded-2xl object-cover mb-3"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#84cc16]/20 text-[#0f392b]">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-base text-gray-900 mt-1 font-['Outfit'] line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.donorName} • {item.distance}
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#0f392b]">
                    {item.servings} Servings Available
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDonation(item)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all"
                >
                  Claim This Surplus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default RecipientDashboard;
