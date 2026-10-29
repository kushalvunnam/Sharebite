import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  PlusCircle, 
  Utensils, 
  HeartHandshake, 
  ShieldCheck,
  RefreshCw,
  Zap,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';

export const Navbar = () => {
  const { 
    currentUser, 
    switchRole, 
    logout,
    resetDemoData,
    apiStatus,
    apiHealth,
    notifications,
    setIsNotificationOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleHowItWorksClick = (e) => {
    if (location.pathname === '/' || location.pathname === '/home') {
      const el = document.getElementById('how-it-works');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const unreadNotifsCount = notifications?.filter(n => !n.read)?.length || 0;

  return (
    <>
      {/* Slim, Clean Primary Navigation Bar (h-16) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFFDF8]/90 border-b border-[#145C3D]/10 transition-all shadow-[0_2px_15px_-3px_rgba(20,92,61,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="shrink-0 flex items-center">
            <Logo size="default" linkTo="/" showTagline={false} />
          </div>

          {/* Center: Desktop Clean Navigation Links (Never wrapping) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/')
                  ? 'text-[#145C3D] font-bold bg-[#F8F5EB]'
                  : 'text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB]/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/explore')
                  ? 'text-[#145C3D] font-bold bg-[#F8F5EB]'
                  : 'text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB]/60'
              }`}
            >
              Explore Food
            </Link>

            <a
              href="/#how-it-works"
              onClick={handleHowItWorksClick}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB]/60 transition-all cursor-pointer"
            >
              How It Works
            </a>

            <Link
              to="/impact"
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/impact')
                  ? 'text-[#145C3D] font-bold bg-[#F8F5EB]'
                  : 'text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB]/60'
              }`}
            >
              Impact
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#145C3D] transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-[#145C3D] hover:bg-[#0f442d] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Join ShareBite
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200/90 bg-white hover:border-[#48A82E] shadow-2xs transition-all text-xs font-semibold text-gray-800 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <img
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={currentUser?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#145C3D] hidden sm:inline">
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Logged in User Dropdown */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="font-bold text-xs text-gray-900 truncate">
                        {currentUser?.name}
                      </div>
                      <div className="text-[11px] text-gray-500 capitalize">
                        {currentUser?.role} • {currentUser?.organization || 'Individual'}
                      </div>
                    </div>

                    <Link
                      to={
                        currentUser?.role === 'donor'
                          ? '/donor-dashboard'
                          : currentUser?.role === 'recipient'
                          ? '/recipient-dashboard'
                          : '/admin'
                      }
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB] transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-[#145C3D]" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold text-gray-700 hover:text-[#145C3D] hover:bg-[#F8F5EB] transition-all"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer mt-1 border-t border-gray-100 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-[#F8F5EB]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF8] border-b border-gray-200/80 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#F8F5EB]"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#F8F5EB]"
            >
              Explore Food
            </Link>
            <a
              href="/#how-it-works"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleHowItWorksClick(e);
              }}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#F8F5EB]"
            >
              How It Works
            </a>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#F8F5EB]"
            >
              Impact
            </Link>

            {!currentUser ? (
              <div className="pt-3 border-t border-gray-200/60 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-[#F8F5EB]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#145C3D] text-white text-sm font-bold shadow-xs"
                >
                  Join ShareBite
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200/60 flex flex-col gap-2">
                <Link
                  to={
                    currentUser?.role === 'donor'
                      ? '/donor-dashboard'
                      : currentUser?.role === 'recipient'
                      ? '/recipient-dashboard'
                      : '/admin'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 rounded-xl text-sm font-bold text-[#145C3D] bg-[#F8F5EB]"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left py-2 px-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Discreet Secondary Demo & Connectivity Floating Utility Trigger (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="relative">
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg text-gray-700 hover:text-[#145C3D] text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
            title="Demo controls & role switcher"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-[#48A82E] animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[11px] font-bold">Demo Hub</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {demoMenuOpen && (
            <div 
              className="absolute bottom-10 right-0 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 p-3 z-50 text-xs animate-in fade-in slide-in-from-bottom-2"
              onClick={() => setDemoMenuOpen(false)}
            >
              <div className="pb-2 border-b border-gray-100 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Developer & Demo Hub</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    apiStatus === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {apiStatus === 'connected' ? 'Atlas Live' : 'Demo Local'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Quick 1-click role switcher for presentations</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => { switchRole('donor'); navigate('/donor-dashboard'); }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#F8F5EB] transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#145C3D] text-[#48A82E] flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Kushal (Donor)</div>
                    <div className="text-[10px] text-gray-400">Hotel Paradise Kitchen</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchRole('recipient'); navigate('/recipient-dashboard'); }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#F8F5EB] transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">NGO Care Foundation</div>
                    <div className="text-[10px] text-gray-400">Recipient Food Bank</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchRole('admin'); navigate('/admin'); }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#F8F5EB] transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Platform Admin</div>
                    <div className="text-[10px] text-gray-400">Moderation & Audit</div>
                  </div>
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <button
                  onClick={resetDemoData}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#145C3D]"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Demo
                </button>
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="flex items-center gap-1 text-[#145C3D] font-bold"
                >
                  <Bell className="w-3 h-3" /> Alerts ({unreadNotifsCount})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
