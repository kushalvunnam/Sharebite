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
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from '../components/common/Logo';

export const RegisterPage = () => {
  const { registerUser, isLoading } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter a valid representative name (at least 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.organization.trim() || formData.organization.trim().length < 2) {
      setErrorMessage('Please enter your organization or business name.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide a physical address for food pickups.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: role,
      organizationName: formData.organization.trim(),
      address: formData.address.trim(),
      profileDetails: {
        orgType: formData.orgType,
        safetyLicense: formData.licenseNumber.trim() || (role === 'donor' ? "FDA-Verified" : "501c3-Verified"),
        taxId: formData.licenseNumber.trim() || "EIN-Verified",
        dailyCapacity: Number(formData.dailyCapacity) || 200,
        hasRefrigeration: formData.hasColdStorage,
        avatar: role === 'donor'
          ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      }
    };

    const res = await registerUser(payload);
    if (res.success) {
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        if (role === 'donor') navigate('/donor-dashboard', { replace: true });
        else navigate('/recipient-dashboard', { replace: true });
      }, 700);
    } else {
      setErrorMessage(res.message || 'Registration failed. Please check the information and try again.');
    }
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

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

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
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
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
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
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
                  onChange={(e) => {
                    setFormData({ ...formData, organization: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
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
                  onChange={(e) => {
                    setFormData({ ...formData, licenseNumber: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
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
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  setErrorMessage('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Account Password *
                </label>
                <span className="text-[10px] text-gray-400">Min. 6 characters</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Choose a secure password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#84cc16] shrink-0 mt-0.5" />
              <span>
                By registering, you agree to the Good Samaritan Food Safety guidelines and adhere to mandatory temperature logging.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#84cc16] animate-spin" />
                  <span>Creating Organization Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#84cc16]" />
                  <span>Complete Registration & Enter Hub</span>
                </>
              )}
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
