import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import Logo from '../components/common/Logo';

export const LoginPage = () => {
  const { customLogin, switchRole } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('donor');
  const [email, setEmail] = useState('marco@verdeosteria.com');
  const [password, setPassword] = useState('••••••••••');

  const handleDemoLogin = (roleKey) => {
    switchRole(roleKey);
    if (roleKey === 'donor') navigate('/donor-dashboard');
    else if (roleKey === 'recipient') navigate('/recipient-dashboard');
    else navigate('/admin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const demoProfile = DEMO_USERS[selectedRole];
    customLogin({
      ...demoProfile,
      email: email || demoProfile.email
    });

    if (selectedRole === 'donor') navigate('/donor-dashboard');
    else if (selectedRole === 'recipient') navigate('/recipient-dashboard');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#84cc16]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#0f392b]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="large" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
            Sign In to ShareBite
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Select your account type or use one-click hackathon demo credentials.
          </p>
        </div>

        {/* 1-Click Fast Hackathon Demo Login Buttons */}
        <div className="bg-[#faf7f2] p-4 rounded-3xl border border-gray-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0f392b]">
            <Zap className="w-3.5 h-3.5 text-[#84cc16]" /> Instant 1-Click Demo Profiles
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('donor')}
              className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-[#84cc16] shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <div className="w-7 h-7 rounded-xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">Chef Marco</span>
              <span className="text-[9px] text-[#0f392b] font-semibold uppercase">Donor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('recipient')}
              className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-[#f97316] shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <div className="w-7 h-7 rounded-xl bg-[#f97316] text-white flex items-center justify-center">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">Sarah Lin</span>
              <span className="text-[9px] text-[#f97316] font-semibold uppercase">NGO Shelter</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-purple-600 shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">David Vance</span>
              <span className="text-[9px] text-purple-700 font-semibold uppercase">Admin Ops</span>
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-5">
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#faf7f2] border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('donor');
                  setEmail('marco@verdeosteria.com');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'donor'
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('recipient');
                  setEmail('sarah@eastsidehope.org');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'recipient'
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                NGO / Shelter
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('david.safety@sharebite.org');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#0f392b] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <span className="text-[11px] text-[#0f392b] hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4 text-[#84cc16]" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#0f392b] hover:underline">
              Register New Organization
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
