import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  PlusCircle, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  User, 
  HeartHandshake,
  Utensils,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';

export const Navbar = () => {
  const { 
    currentUser, 
    switchRole, 
    notifications, 
    setIsNotificationOpen, 
    availableListingsCount,
    setIsPostWizardOpen,
    resetDemoData,
    apiStatus,
    apiHealth,
    checkBackend
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  const handlePostClick = () => {
    if (currentUser?.role === 'donor') {
      setIsPostWizardOpen(true);
    } else {
      switchRole('donor');
      setIsPostWizardOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-[#0f392b]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Logo />

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/explore"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/explore')
                ? 'bg-[#0f392b] text-white shadow-sm'
                : 'text-gray-700 hover:text-[#0f392b] hover:bg-gray-100/70'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Food</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-[#84cc16] text-[#0f392b] font-extrabold">
              {availableListingsCount}
            </span>
          </Link>

          <Link
            to="/impact"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/impact')
                ? 'bg-[#0f392b] text-white shadow-sm'
                : 'text-gray-700 hover:text-[#0f392b] hover:bg-gray-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#84cc16]" />
            <span>Impact Calculator</span>
          </Link>

          <Link
            to="/safety"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/safety')
                ? 'bg-[#0f392b] text-white shadow-sm'
                : 'text-gray-700 hover:text-[#0f392b] hover:bg-gray-100/70'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#0f392b]" />
            <span>Safety & Shield</span>
          </Link>

          {/* Quick link to current user's role dashboard */}
          {currentUser?.role === 'donor' && (
            <Link
              to="/donor-dashboard"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/donor-dashboard')
                  ? 'bg-[#0f392b] text-white'
                  : 'text-[#0f392b] font-bold hover:bg-[#84cc16]/15'
              }`}
            >
              Donor Hub
            </Link>
          )}

          {currentUser?.role === 'recipient' && (
            <Link
              to="/recipient-dashboard"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/recipient-dashboard')
                  ? 'bg-[#0f392b] text-white'
                  : 'text-[#f97316] font-bold hover:bg-[#f97316]/15'
              }`}
            >
              NGO Hub
            </Link>
          )}

          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/admin')
                  ? 'bg-[#0f392b] text-white'
                  : 'text-[#0f392b] font-bold hover:bg-gray-100'
              }`}
            >
              Admin Board
            </Link>
          )}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Backend Connectivity Status Badge */}
          <button
            onClick={checkBackend}
            title={
              apiStatus === 'connected'
                ? `Connected to MongoDB Atlas (${apiHealth?.database || 'live'})`
                : 'Backend is offline. Using local simulated demo data. Click to reconnect.'
            }
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
              apiStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{apiStatus === 'connected' ? 'MongoDB Live' : 'Demo Mode (Offline)'}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2.5 rounded-xl text-gray-700 hover:text-[#0f392b] hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#f97316] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill (Crucial for Instant Hackathon Testing) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#84cc16] shadow-xs transition-all text-xs font-semibold text-gray-800"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#0f392b] leading-tight flex items-center gap-1">
                  {currentUser?.name?.split(' ')[0]}
                  <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-extrabold ${
                    currentUser?.role === 'donor' 
                      ? 'bg-emerald-100 text-[#0f392b]' 
                      : currentUser?.role === 'recipient'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {currentUser?.role}
                  </span>
                </span>
                <span className="text-[10px] text-gray-500 truncate max-w-[110px]">
                  {currentUser?.organization}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Role Switcher Menu */}
            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Switch Demo Account
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    1-Click Hackathon Role Switching
                  </div>
                </div>

                {/* Donor Role */}
                <button
                  onClick={() => { switchRole('donor'); navigate('/donor-dashboard'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    currentUser?.role === 'donor' ? 'bg-[#84cc16]/20 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-[#0f392b] text-[#84cc16]">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-gray-900">Chef Marco (Donor)</div>
                    <div className="text-[10px] text-gray-500">Verde Artisan Trattoria</div>
                  </div>
                </button>

                {/* Recipient NGO Role */}
                <button
                  onClick={() => { switchRole('recipient'); navigate('/recipient-dashboard'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    currentUser?.role === 'recipient' ? 'bg-amber-50 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-[#f97316] text-white">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-gray-900">Sarah Lin (Recipient NGO)</div>
                    <div className="text-[10px] text-gray-500">Eastside Hope Shelter</div>
                  </div>
                </button>

                {/* Admin Role */}
                <button
                  onClick={() => { switchRole('admin'); navigate('/admin'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    currentUser?.role === 'admin' ? 'bg-purple-50 font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-gray-900 text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-gray-900">David Vance (Admin)</div>
                    <div className="text-[10px] text-gray-500">Safety & Compliance Ops</div>
                  </div>
                </button>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between px-2 text-[11px]">
                  <button
                    onClick={resetDemoData}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#0f392b] font-medium"
                    title="Reset all demo data to default"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Demo
                  </button>
                  <Link
                    to="/login"
                    className="text-[#0f392b] font-bold hover:underline"
                  >
                    Custom Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Donate Surplus Food */}
          <button
            onClick={handlePostClick}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4 text-[#84cc16]" />
            <span>Donate Surplus</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 font-semibold text-gray-900"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#0f392b]" /> Browse Available Food
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#84cc16] text-[#0f392b] font-bold">
              {availableListingsCount}
            </span>
          </Link>

          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-900"
          >
            <Sparkles className="w-4 h-4 text-[#84cc16]" /> Impact Calculator
          </Link>

          <Link
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-900"
          >
            <ShieldCheck className="w-4 h-4 text-[#0f392b]" /> Food Safety & Legal Shield
          </Link>

          <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
            <Link
              to="/donor-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-center bg-[#0f392b]/10 text-[#0f392b] text-xs font-bold"
            >
              Donor Hub
            </Link>
            <Link
              to="/recipient-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-center bg-[#f97316]/10 text-[#f97316] text-xs font-bold"
            >
              NGO Hub
            </Link>
          </div>

          <button
            onClick={() => { setMobileMenuOpen(false); handlePostClick(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f392b] text-white text-sm font-bold shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#84cc16]" />
            <span>Donate Surplus Food</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
