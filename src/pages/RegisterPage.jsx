import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  MapPin, 
  FileText, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from '../components/common/Logo';

export const RegisterPage = () => {
  const { customLogin } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    orgType: 'Restaurant & Trattoria',
    address: '',
    licenseNumber: '',
    dailyCapacity: 200,
    hasColdStorage: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name || "Kitchen Representative",
      email: formData.email,
      role: role,
      organization: formData.organization || (role === 'donor' ? "Gourmet Bistro" : "Community Kitchen"),
      orgType: formData.orgType,
      address: formData.address || "123 Civic Center Way",
      safetyLicense: formData.licenseNumber || "FDA-NYC-Pending",
      taxId: formData.licenseNumber || "EIN-Pending",
      avatar: role === 'donor'
        ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
        : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    };

    customLogin(newUser);
    if (role === 'donor') navigate('/donor-dashboard');
    else navigate('/recipient-dashboard');
  };

  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#84cc16]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="large" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
            Join the Zero-Waste Network
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Register your kitchen or charitable organization to begin donating or receiving surplus food today.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-5">
          
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Select Organization Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#faf7f2] border border-gray-200">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'donor'
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#84cc16]" />
                <span>Food Donor (Kitchen/Grocer)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recipient')}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'recipient'
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-[#f97316]" />
                <span>Non-Profit / Food Bank</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Representative Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Marco / Sarah Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Organization / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verde Osteria / Eastside Shelter"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {role === 'donor' ? 'Food Safety / Handler License' : '501(c)(3) EIN Tax ID'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'donor' ? "FDA / FSSAI #2910-A" : "EIN-82-4910291"}
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Physical Address for Food Pickups *
              </label>
              <input
                type="text"
                required
                placeholder="Street address, Suite, City, State"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Account Password *
              </label>
              <input
                type="password"
                required
                placeholder="Choose a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#84cc16] shrink-0 mt-0.5" />
              <span>
                By registering, you agree to the Good Samaritan Food Safety guidelines and adhere to mandatory temperature logging.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#84cc16]" />
              <span>Complete Registration & Enter Hub</span>
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#0f392b] hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
