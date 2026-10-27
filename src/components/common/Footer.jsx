import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Leaf
} from 'lucide-react';
import Logo from './Logo';

export const Footer = () => {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribedEmail) {
      setIsSubscribed(true);
      setSubscribedEmail('');
    }
  };

  return (
    <footer className="bg-[#092119] text-white pt-16 pb-12 border-t border-[#84cc16]/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#84cc16]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo lightMode={true} size="large" />
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mt-3">
              ShareBite is a mission-driven redistribution network bridging the gap between surplus commercial kitchen food and vulnerable community kitchens, food banks, and shelters.
            </p>
            
            <div className="pt-2 flex items-center gap-2 text-xs text-[#84cc16] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#84cc16]" />
              <span>Protected by the Bill Emerson Good Samaritan Food Act</span>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#84cc16]" /> Global Operations & Regional Hubs
              </span>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/explore" className="hover:text-[#84cc16] transition-colors">
                  Find Available Food
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-[#84cc16] transition-colors">
                  CO2 & Water Impact
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#84cc16] transition-colors">
                  Food Safety Standards
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-[#84cc16] transition-colors">
                  Donor Kitchen Portal
                </Link>
              </li>
              <li>
                <Link to="/recipient-dashboard" className="hover:text-[#84cc16] transition-colors">
                  NGO & Shelter Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Safety */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
              Safety & Governance
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/safety#haccp" className="hover:text-[#84cc16] transition-colors">
                  HACCP Temperature Protocol
                </Link>
              </li>
              <li>
                <Link to="/safety#samaritan" className="hover:text-[#84cc16] transition-colors">
                  Donor Legal Protection
                </Link>
              </li>
              <li>
                <Link to="/safety#tamper" className="hover:text-[#84cc16] transition-colors">
                  Tamper-Evident Handoff
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#84cc16] transition-colors">
                  Safety Board Audit Logs
                </Link>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">
                  24/7 Dispatch Hotline
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter & Fast Join */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
              Join the Movement
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Get real-time surplus notifications for your neighborhood.
            </p>

            {isSubscribed ? (
              <div className="p-3 rounded-xl bg-[#84cc16]/20 border border-[#84cc16]/30 text-[#84cc16] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed! Welcome to the zero-waste community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your kitchen or NGO email..."
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#84cc16]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#84cc16] text-[#0f392b] rounded-lg text-xs font-bold hover:bg-[#a3e635] transition-colors flex items-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-white/50">
                  Instant alerts for nearby restaurants and food banks.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span>© 2026 ShareBite Network. All rights reserved.</span>
            <span>•</span>
            <span className="text-[#84cc16]">Share more. Waste less.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Food Code Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
