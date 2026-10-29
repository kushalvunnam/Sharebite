import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Utensils, 
  FileText, 
  Key,
  Users,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TiltCard } from '../components/3d/TiltCard';
import confetti from 'canvas-confetti';

export const DonorDashboard = () => {
  const { 
    currentUser, 
    donations, 
    setIsPostWizardOpen, 
    completeDonation, 
    setSelectedDonation 
  } = useApp();

  const [verifyingDonation, setVerifyingDonation] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filter donor's listings
  const donorListings = donations.filter(d => 
    d.donorId === currentUser?.id || (currentUser?.organization && d.donorName === currentUser.organization)
  );

  const activeClaimed = donorListings.filter(d => d.status === 'claimed');
  const availableListings = donorListings.filter(d => d.status === 'available');
  const completedListings = donorListings.filter(d => d.status === 'completed');

  const totalPortionsDonated = donorListings.reduce((sum, d) => sum + (d.servings || 0), 0);
  const totalTaxSavedUsd = Math.round(totalPortionsDonated * 3.8);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!verifyingDonation) return;

    const res = completeDonation(verifyingDonation.id, enteredOtp);
    if (res.success) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      setVerifyingDonation(null);
      setEnteredOtp('');
    }
  };

  const handleDownloadTaxCert = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#16a34a] shrink-0 shadow-sm">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"}
              alt="Kitchen Manager"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f392b] font-['Outfit']">
                Welcome back, {currentUser?.name || "Kushal"}! 👋
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {currentUser?.organization || "Hotel Paradise, Banjara Hills"} • <span className="text-[#16a34a] font-semibold">Active Donor</span> • License: {currentUser?.safetyLicense || "FSSAI Verified"}
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

          <button
            onClick={() => setIsPostWizardOpen(true)}
            className="px-6 py-3 rounded-2xl bg-[#134e38] hover:bg-[#0f392b] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#84cc16]" />
            <span>+ Create Donation</span>
          </button>
        </div>
      </div>

      {/* 4 Reference KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Donations</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#16a34a]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {donorListings.length > 0 ? donorListings.length : 24}
          </div>
          <div className="text-[11px] text-[#16a34a] font-semibold mt-1 flex items-center gap-1">
            <span>↑ +4 this week</span>
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meals Shared</span>
            <div className="p-2 rounded-xl bg-[#84cc16]/15 text-[#0f392b]">
              <Utensils className="w-4 h-4 text-[#16a34a]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {totalPortionsDonated > 0 ? totalPortionsDonated : 186}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Nutritious portions distributed
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">NGOs Supported</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            12
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Verified local shelter partners
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Food Saved</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0f392b] font-['Outfit'] mt-3">
            {Math.round(totalPortionsDonated * 0.45) > 0 ? `${Math.round(totalPortionsDonated * 0.45)} kg` : '45 kg'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Zero edible waste diverted
          </div>
        </TiltCard>
      </div>

      {/* Promo Banner: Turn Surplus Food into Smiles */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#134e38] via-[#0f392b] to-[#1e5842] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#84cc16] text-xs font-bold mb-3 border border-white/10">
            <span>✨ ShareBite Impact Partner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] leading-tight">
            Turn Surplus Food into Smiles
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
            Your donations have fed over 120 people this week alone. Every listed batch connects instantly with verified shelters across Hyderabad.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setIsPostWizardOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Donate Now</span>
              <span>→</span>
            </button>
            <button
              onClick={handleDownloadTaxCert}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              {downloadSuccess ? 'Downloaded Certificate!' : 'IRS Tax Certificate'}
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#16a34a]/20 to-transparent pointer-events-none" />
      </div>

      {/* Two Column Grid: Recent Donations & Impact Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Donations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0f392b] font-['Outfit']">
                Recent Donations
              </h3>
              <p className="text-xs text-gray-500">
                Track status of your surplus listings in real time
              </p>
            </div>
            <button
              onClick={() => setIsPostWizardOpen(true)}
              className="text-xs font-bold text-[#16a34a] hover:underline"
            >
              + Add New
            </button>
          </div>

          <div className="space-y-3">
            {(donorListings.length > 0 ? donorListings : [
              { id: 'rec-1', title: 'Veg Biryani', servings: 20, weightKg: 8, status: 'claimed', claimedBy: 'NGO Care Foundation', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
              { id: 'rec-2', title: 'Paneer Curry', servings: 15, weightKg: 5, status: 'available', claimedBy: null, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
              { id: 'rec-3', title: 'Veg Pulav', servings: 18, weightKg: 6, status: 'completed', claimedBy: 'City Shelter Network', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' }
            ]).slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDonation(item)}
                className="p-4 rounded-2xl bg-[#faf7f2] hover:bg-emerald-50/50 border border-gray-100 transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#0f392b] group-hover:text-[#16a34a] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.servings} Servings • {item.claimedBy || "Awaiting shelter claim"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                    item.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'claimed'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-[#16a34a]/15 text-[#0f392b]'
                  }`}>
                    {item.status === 'claimed' ? 'Picked Up' : item.status === 'available' ? 'Scheduled' : 'Completed'}
                  </span>
                  <span className="text-gray-400 group-hover:text-[#0f392b] group-hover:translate-x-0.5 transition-all text-sm">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Impact Overview Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0f392b] font-['Outfit']">
              Impact Overview
            </h3>
            <p className="text-xs text-gray-500">
              Monthly community contribution
            </p>
          </div>

          <div className="space-y-4 my-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Meals Shared</span>
                <span className="text-[#16a34a]">186</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#16a34a]" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Food Saved</span>
                <span className="text-[#0f392b]">45 kg</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#0f392b]" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                <span>People Helped</span>
                <span className="text-purple-600">120</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-purple-500" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                <span>NGOs Supported</span>
                <span className="text-amber-600">12</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#0f392b]/10 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Estimated Tax Deductions</div>
            <div className="text-xl font-black text-emerald-800 font-['Outfit'] mt-0.5">
              ${totalTaxSavedUsd > 0 ? totalTaxSavedUsd.toLocaleString() : '706'}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">IRS 170(e)(3) deduction eligible</div>
          </div>
        </div>

      </div>

      {/* Urgent Handoff Notice: Items Claimed by Shelters */}
      {activeClaimed.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600 animate-spin-slow" />
              <span>Pending Volunteer Pickups Requiring Verification</span>
            </div>
            <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
              {activeClaimed.length} Action Needed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeClaimed.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                      <p className="text-xs text-amber-800 font-semibold mt-0.5">
                        Claimed by: {item.claimedBy || "Eastside Hope Food Rescue"}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-[#0f392b] bg-[#84cc16]/20 px-2 py-0.5 rounded-md">
                      {item.servings} Servings
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <span>Code: <strong className="text-gray-900">{item.verificationCode}</strong></span>
                    <span>•</span>
                    <span>Expected OTP: <strong className="text-amber-800 font-mono tracking-wider">{item.otpCode}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setVerifyingDonation(item);
                    setEnteredOtp(item.otpCode || '');
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-3.5 h-3.5 text-[#84cc16]" />
                  <span>Verify Volunteer Handoff (Input OTP)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table: Kitchen Surplus Inventory */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#0f392b] font-['Outfit']">
              Kitchen Surplus Inventory & History
            </h3>
            <p className="text-xs text-gray-500">
              Live status of all batches ({availableListings.length} available, {activeClaimed.length} claimed, {completedListings.length} completed)
            </p>
          </div>

          {/* Download Tax Compliance Summary */}
          <button
            onClick={handleDownloadTaxCert}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:border-[#84cc16] text-xs font-bold text-gray-700 hover:text-[#0f392b] flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#84cc16]" />
            <span>{downloadSuccess ? 'Downloaded IRS Certificate!' : 'Export IRS 170(e)(3) Certificate'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf7f2] text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Food Batch Title</th>
                <th className="p-4">Portions</th>
                <th className="p-4">Storage Protocol</th>
                <th className="p-4">Status</th>
                <th className="p-4">Recipient NGO</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donorListings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="font-bold text-sm text-gray-700">No donations yet</div>
                    <div className="text-xs text-gray-400 mt-1">You haven't listed any surplus food batches yet. Post your first surplus batch above!</div>
                  </td>
                </tr>
              ) : (
                donorListings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          Logged: {item.createdAt?.split('T')[0] || 'Today'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#0f392b]">
                      {item.servings} meals ({item.weightKg} kg)
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {item.storageType}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'claimed'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">
                      {item.claimedBy || "—"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedDonation(item)}
                        className="text-[#0f392b] font-bold hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {verifyingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#84cc16]" />
                <h3 className="font-bold text-base text-[#0f392b]">Verify Volunteer Handoff</h3>
              </div>
              <button
                onClick={() => setVerifyingDonation(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              The NGO volunteer has arrived for <strong>"{verifyingDonation.title}"</strong>. Enter the 6-digit confirmation OTP shown on their pass.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  6-Digit Handoff OTP *
                </label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="e.g. 749210"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full text-center text-2xl font-black tracking-widest px-4 py-3 rounded-2xl border border-gray-300 focus:border-[#84cc16] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 text-[11px] text-gray-500 space-y-1">
                <div>• Donor Pickup Reference: <strong>{verifyingDonation.verificationCode}</strong></div>
                <div>• Recipient: <strong>{verifyingDonation.claimedBy}</strong></div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVerifyingDonation(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0f392b] text-white text-xs font-bold hover:bg-[#164e3b]"
                >
                  Confirm Handoff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DonorDashboard;
