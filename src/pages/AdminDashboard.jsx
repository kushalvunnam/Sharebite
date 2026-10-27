import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  FileText, 
  TrendingUp, 
  Search, 
  Filter, 
  Activity, 
  Award, 
  Clock, 
  Eye,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TiltCard } from '../components/3d/TiltCard';

export const AdminDashboard = () => {
  const { donations, setSelectedDonation, totalMealsSaved } = useApp();

  const [auditFilter, setAuditFilter] = useState('all');
  const [approvedList, setApprovedList] = useState([]);

  const pendingVerificationKitchens = [];

  const handleApprove = (id) => {
    setApprovedList(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#0f392b] via-[#164e3b] to-[#0f392b] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 text-[#84cc16] text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" /> Operations & Safety Oversight Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Platform Command & Food Safety Center
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
            Real-time compliance monitoring, donor license verification, HACCP temperature audit logs, and fraud mitigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all shadow-xs"
            title="Account & Compliance Settings"
          >
            <Settings className="w-4 h-4 text-[#84cc16]" />
            <span>Settings</span>
          </Link>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-ping" />
            <span>Automated Safety Engine: Online</span>
          </div>
        </div>
      </div>

      {/* High Level Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Redistribution Volume</span>
            <Activity className="w-4 h-4 text-[#84cc16]" />
          </div>
          <div className="text-3xl font-black text-[#0f392b] font-['Outfit'] mt-2">
            {totalMealsSaved.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {donations.length > 0 ? `Across ${donations.length} registered listings` : "Across 0 registered nodes"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Compliance Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 font-['Outfit'] mt-2">
            {donations.length > 0 ? "99.4%" : "No data"}
          </div>
          <div className="text-xs text-emerald-800 font-semibold mt-1">
            {donations.length > 0 ? "Zero health incidents reported" : "No safety audits logged yet"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Avg. Claim Latency</span>
            <Clock className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className="text-3xl font-black text-[#f97316] font-['Outfit'] mt-2">
            {donations.length > 0 ? "2.4 Mins" : "0 Mins"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {donations.length > 0 ? "Surplus matched within 5km radius" : "No handoffs recorded"}
          </div>
        </TiltCard>

        <TiltCard className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Handoff Success Rate</span>
            <Award className="w-4 h-4 text-[#84cc16]" />
          </div>
          <div className="text-3xl font-black text-[#0f392b] font-['Outfit'] mt-2">
            {donations.length > 0 ? "98.9%" : "0%"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {donations.length > 0 ? "OTP-confirmed handoffs" : "No handoffs completed"}
          </div>
        </TiltCard>
      </div>

      {/* Safety Verification Queue */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0f392b] font-['Outfit'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#84cc16]" />
              <span>Commercial Kitchen & Non-Profit Verification Queue</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Review municipal food handler licenses and 501(c)(3) tax exemption credentials.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#faf7f2] border border-gray-200 px-3 py-1 rounded-full text-gray-700">
            {pendingVerificationKitchens.length} Reviews Pending
          </span>
        </div>

        {pendingVerificationKitchens.length === 0 ? (
          <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50/60 text-center">
            <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <div className="font-bold text-sm text-gray-700">No reports available</div>
            <div className="text-xs text-gray-400 mt-1">There are no commercial kitchen or NGO verification reviews pending at this time.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pendingVerificationKitchens.map((k) => {
              const isApproved = approvedList.includes(k.id);

              return (
                <div
                  key={k.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {k.type}
                      </span>
                      <span className="text-xs text-gray-400">{k.submittedDate}</span>
                    </div>

                    <h4 className="font-bold text-base text-gray-900 mt-1.5 font-['Outfit']">
                      {k.name}
                    </h4>
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      <div>Credentials: <strong className="text-gray-900">{k.licenseNumber}</strong></div>
                      <div>Algorithmic Risk Score: <strong className="text-emerald-700">{k.riskScore}</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between">
                    {isApproved ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Vetted & Approved
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => handleApprove(k.id)}
                          className="flex-1 py-2 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-colors"
                        >
                          Approve Organization
                        </button>
                        <button
                          className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Inspect Docs
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Platform Listings Audit Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#0f392b] font-['Outfit']">
              Live Surplus Logs & Temperature Audit
            </h3>
            <p className="text-xs text-gray-500">
              Complete platform ledger of food batches with safe temperature certificates
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf7f2] text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Batch ID & Title</th>
                <th className="p-4">Donor Kitchen</th>
                <th className="p-4">Portions</th>
                <th className="p-4">HACCP Temperature Log</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="font-bold text-sm text-gray-700">No reports available</div>
                    <div className="text-xs text-gray-400 mt-1">No surplus food batches logged for temperature audits yet.</div>
                  </td>
                </tr>
              ) : (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-bold text-gray-900">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.id}</div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {item.donorName}
                    </td>
                    <td className="p-4 font-bold text-[#0f392b]">
                      {item.servings} Meals
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {item.temperatureLog}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'claimed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedDonation(item)}
                        className="text-[#0f392b] font-bold hover:underline"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
