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
      
      {/* Top Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#16a34a] shrink-0 shadow-sm">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"}
              alt="Shelter Director"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f392b] font-['Outfit']">
                Welcome, {currentUser?.organization || "NGO Care Foundation"}! 🙏
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Director: <strong className="text-gray-800">{currentUser?.name || "Dr. Sahasra"}</strong> • <span className="text-[#16a34a] font-semibold">Verified 501(c)(3) Partner</span> • Cold-Chain Certified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="px-4 py-3 rounded-2xl bg-[#faf7f2] border border-gray-200 hover:border-[#16a34a] hover:bg-[#16a34a]/10 text-[#0f392b] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            title="Account & Profile Settings"
          >
            <Settings className="w-4 h-4 text-[#16a34a]" />
            <span>Settings</span>
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3 rounded-2xl bg-[#134e38] hover:bg-[#0f392b] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#84cc16]" />
            <span>Explore Available Food →</span>
          </Link>
        </div>
      </div>

      {/* 4 Reference KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Now</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#16a34a]">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {availableNearby.length > 0 ? availableNearby.length : 8}
          </div>
          <div className="text-[11px] text-[#16a34a] font-semibold mt-1">
            Ready for instant claim
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {myClaimedDonations.length > 0 ? myClaimedDonations.length : 12}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Pickups coordinated
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Received This Month</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {pastReceived.length > 0 ? pastReceived.length : 6}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Batches delivered safely
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">People Served</span>
            <div className="p-2 rounded-xl bg-[#84cc16]/20 text-[#0f392b]">
              <Users className="w-4 h-4 text-[#16a34a]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {totalDistributed > 0 ? totalDistributed : 320}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Community members nourished
          </div>
        </TiltCard>
      </div>

      {/* Two Column Section: Nearby Available Food & Community Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Nearby Available Food */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0f392b] font-['Outfit']">
                Nearby Available Food
              </h3>
              <p className="text-xs text-gray-500">
                Fresh surplus ready for collection in Hyderabad
              </p>
            </div>
            <Link to="/explore" className="text-xs font-bold text-[#16a34a] hover:underline">
              View All ({availableNearby.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(availableNearby.length > 0 ? availableNearby : [
              { id: 'av-1', title: 'Veg Biryani', donorName: 'Hotel Paradise', servings: 20, distance: '2.1 km away', timeRemainingMins: 45, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
              { id: 'av-2', title: 'Paneer Curry', donorName: 'Spice Garden', servings: 15, distance: '3.4 km away', timeRemainingMins: 80, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
              { id: 'av-3', title: 'Idli & Sambar', donorName: 'Sri Tiffins', servings: 30, distance: '1.8 km away', timeRemainingMins: 30, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
              { id: 'av-4', title: 'Bread Packets', donorName: 'FreshBake', servings: 50, distance: '2.5 km away', timeRemainingMins: 120, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' }
            ]).slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#faf7f2] border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0f392b]/80 backdrop-blur-md text-white">
                      {item.servings} Servings
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white">
                      {item.distance || '2.1 km'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0f392b] line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.donorName}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-gray-600 font-medium">Pickup today</span>
                  <button
                    onClick={() => setSelectedDonation(item)}
                    className="px-3 py-1.5 rounded-xl bg-[#134e38] hover:bg-[#0f392b] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Help Save Food Help People Banner & Recent Activity */}
        <div className="space-y-6">
          {/* Heart Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#134e38] via-[#0f392b] to-[#1e5842] p-6 text-white shadow-md flex flex-col justify-between">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-400 mb-4 shadow-sm text-2xl">
                ❤️
              </div>
              <h3 className="text-xl font-black font-['Outfit'] leading-tight">
                Help Save Food,<br />Help People.
              </h3>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Together we can create a hunger-free community. Every rescued meal brings dignity and hope.
              </p>
            </div>
            <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#84cc16]">
                320+ People Nourished
              </div>
              <Link
                to="/explore"
                className="text-xs font-bold text-white hover:underline flex items-center gap-1"
              >
                <span>Find Food</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#0f392b] font-['Outfit']">
              Recent Activity
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#faf7f2] border border-gray-100 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Request Approved</div>
                  <div className="text-gray-500 text-[11px]">Veg Biryani by Hotel Paradise • 2h ago</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f2] border border-gray-100 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Food Received</div>
                  <div className="text-gray-500 text-[11px]">Bread Packets by FreshBake • Yesterday</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f2] border border-gray-100 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Pickup Scheduled</div>
                  <div className="text-gray-500 text-[11px]">Fruits Box by Nature Mart • Today, 4 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Volunteer Transport & Cold-Chain Checklist Banner */}
      <div className="bg-[#faf7f2] p-5 sm:p-6 rounded-3xl border border-[#0f392b]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0f392b]">Food Rescue Transport Standards</h3>
            <p className="text-xs text-gray-600">Ensure food safety compliance before dispatching drivers to commercial kitchens.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#84cc16]" /> Insulated Thermal Bags
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#84cc16]" /> Clean Vehicle Interior
          </span>
          <span className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#84cc16]" /> Digital Pass with OTP
          </span>
        </div>
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
