import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Thermometer, 
  Package, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  BookOpen, 
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { TiltCard } from '../components/3d/TiltCard';

export const SafetyGuidelinesPage = () => {
  const [checklist, setChecklist] = useState({
    tempLogged: true,
    tamperSealed: true,
    allergensNoted: true,
    goodFaith: true,
    twoHourRule: false,
    sanitizedCrates: true
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#84cc16]/20 text-[#0f392b] text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-[#84cc16]" /> Food Safety Compliance & Legal Protection
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
          Food Safety Standards & Legal Shield
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Zero waste should never mean compromising hygiene. Learn how the Good Samaritan Food Act protects your establishment and how our HACCP protocols ensure recipient safety.
        </p>
      </div>

      {/* Bill Emerson Good Samaritan Act Deep Dive */}
      <div id="samaritan" className="bg-[#0f392b] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#84cc16]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#84cc16] text-[#0f392b] flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#84cc16]">Federal Law Protection</span>
            <h2 className="text-2xl font-bold font-['Outfit']">The Bill Emerson Good Samaritan Food Donation Act</h2>
            <p className="text-xs text-white/70">Codified under 42 U.S. Code § 1791</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h4 className="font-bold text-sm text-[#84cc16]">Civil & Criminal Immunity</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Food donors are shielded from all civil and criminal liabilities when donating food in good faith to a non-profit organization for ultimate distribution to needy individuals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h4 className="font-bold text-sm text-[#84cc16]">Direct-to-Individual Coverage</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Updated under the Food Donation Improvement Act (FDIA) to explicitly extend liability protection to direct donations and food offered at deeply discounted or zero pricing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h4 className="font-bold text-sm text-[#84cc16]">Qualified Non-Profit Status</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Recipients on ShareBite are pre-verified 501(c)(3) entities, ensuring every transaction fulfills all statutory requirements of federal protection.
            </p>
          </div>
        </div>
      </div>

      {/* Temperature Control & The Danger Zone */}
      <div id="haccp" className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#84cc16]">HACCP Standards</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
            Temperature Danger Zone & Cold Chain Preservation
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Pathogenic bacteria multiply fastest between 40°F and 140°F (4°C - 60°C). ShareBite mandates continuous temperature recording.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Thermometer className="w-5 h-5 text-rose-600" />
              <span>Hot Holding Protocol</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-['Outfit']">
              &gt; 140°F (60°C)
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cooked entrees must remain above 140°F throughout holding in commercial steam tables or cambros before handoff.
            </p>
          </TiltCard>

          <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Thermometer className="w-5 h-5 text-blue-600" />
              <span>Cold Holding & Refrigeration</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-['Outfit']">
              &lt; 40°F (4°C)
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Produce, dairy, and blast-chilled foods must remain below 40°F. Insulated coolers required for volunteer transit over 30 minutes.
            </p>
          </TiltCard>

          <TiltCard className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Thermometer className="w-5 h-5 text-amber-600" />
              <span>Two-Stage Cooling Rule</span>
            </div>
            <div className="text-2xl font-black text-gray-900 font-['Outfit']">
              135°F → 70°F in 2 hrs
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Foods must cool from 135°F to 70°F within 2 hours, and to 41°F or below within an additional 4 hours using ice baths or blast chillers.
            </p>
          </TiltCard>
        </div>
      </div>

      {/* Interactive Kitchen Safety Self-Audit Checklist */}
      <div id="tamper" className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#0f392b] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#0f392b] font-['Outfit']">
                Commercial Kitchen Self-Audit Checklist
              </h3>
              <p className="text-xs text-gray-500">
                Interactive pre-handoff verification for kitchen supervisors
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-[#0f392b] bg-[#84cc16]/20 px-3 py-1.5 rounded-xl">
            {completedCount} of {totalCount} Requirements Met
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { key: 'tempLogged', label: 'Internal temperature measured with calibrated probe thermometer' },
            { key: 'tamperSealed', label: 'Containers sealed with tamper-evident security tape or tight lids' },
            { key: 'allergensNoted', label: 'All 9 major allergens explicitly declared on the batch container' },
            { key: 'goodFaith', label: 'Food was wholesome, unserved, and handled in certified commercial kitchen' },
            { key: 'twoHourRule', label: 'Surplus was chilled within the strict FDA two-stage cooling window' },
            { key: 'sanitizedCrates', label: 'Transit crates and cambros sanitized before loading dock pickup' },
          ].map(({ key, label }) => (
            <div
              key={key}
              onClick={() => toggleCheck(key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                checklist[key]
                  ? 'bg-[#84cc16]/10 border-[#84cc16] text-[#0f392b]'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                checklist[key] ? 'bg-[#0f392b] text-[#84cc16]' : 'border border-gray-400'
              }`}>
                {checklist[key] ? '✓' : ''}
              </div>
              <span className="text-xs font-semibold leading-relaxed">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SafetyGuidelinesPage;
