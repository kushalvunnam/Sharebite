import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, LogIn, Search, Sparkles, Home } from 'lucide-react';
import { TiltCard } from '../components/3d/TiltCard';
import Logo from '../components/common/Logo';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-10rem)] py-12 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden bg-[#faf7f2]">
      {/* 3D ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#84cc16]/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0f392b]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 text-center">
        
        {/* Brand Logo */}
        <div className="inline-block mb-2">
          <Logo size="large" showTagline={true} />
        </div>

        {/* 3D Not Found Card */}
        <TiltCard className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
              404 • Route Not Found
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit']">
              Looking for Fresh Food?
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              The page or surplus batch you are trying to reach doesn't exist, has expired, or the link may have changed.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to="/login"
              className="py-3 px-4 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#84cc16]" />
              <span>Go to Sign In</span>
            </Link>

            <Link
              to="/explore"
              className="py-3 px-4 rounded-2xl bg-[#faf7f2] hover:bg-[#84cc16]/15 border border-gray-200 text-[#0f392b] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#84cc16]" />
              <span>Explore Listings</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hover:text-[#0f392b] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>

            <Link
              to="/home"
              className="hover:text-[#0f392b] font-semibold flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Hub</span>
            </Link>
          </div>
        </TiltCard>

      </div>
    </div>
  );
};

export default NotFoundPage;
