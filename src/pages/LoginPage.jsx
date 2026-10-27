import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Utensils, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Info,
  LogOut
} from 'lucide-react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import Logo from '../components/common/Logo';

export const LoginPage = () => {
  const { currentUser, switchRole, loginUser, logout, isLoading, apiStatus } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('donor');
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('sharebite_saved_email') || 'marco@verdeosteria.com';
  });
  const [password, setPassword] = useState('DonorPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('sharebite_remember_me') !== 'false';
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Sync role tab selection with demo credentials for convenience
  const handleRoleTabClick = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage('');
    if (roleKey === 'donor') {
      setEmail('marco@verdeosteria.com');
      setPassword('DonorPassword123!');
    } else if (roleKey === 'recipient') {
      setEmail('sarah@eastsidehope.org');
      setPassword('ShelterPassword123!');
    } else {
      setEmail('david.safety@sharebite.org');
      setPassword('AdminPassword123!');
    }
  };

  // Helper to redirect to destination or role dashboard
  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login') && !from.includes('/register')) {
      // Avoid redirecting donor into recipient dashboard or vice versa
      if (from === '/donor-dashboard' && role !== 'donor') {
        // Fall back to actual role dashboard
      } else if (from === '/recipient-dashboard' && role !== 'recipient') {
        // Fall back to actual role dashboard
      } else if (from === '/admin' && role !== 'admin') {
        // Fall back to actual role dashboard
      } else {
        navigate(from, { replace: true });
        return;
      }
    }

    if (role === 'recipient') {
      navigate('/recipient-dashboard', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/donor-dashboard', { replace: true });
    }
  };

  // 1-Click Fast Hackathon Demo Login with real backend token acquisition
  const handleDemoLogin = async (roleKey) => {
    setErrorMessage('');
    let creds = { email: 'marco@verdeosteria.com', password: 'DonorPassword123!' };
    if (roleKey === 'recipient') {
      creds = { email: 'sarah@eastsidehope.org', password: 'ShelterPassword123!' };
    } else if (roleKey === 'admin') {
      creds = { email: 'david.safety@sharebite.org', password: 'AdminPassword123!' };
    }

    const res = await loginUser(creds);
    if (res.success) {
      redirectAfterLogin(roleKey);
    } else {
      // Offline fallback if backend server is not active
      switchRole(roleKey);
      redirectAfterLogin(roleKey);
    }
  };

  // Traditional credentials login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    if (!email || !email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password (minimum 4 characters).');
      return;
    }

    // Save or clear remembered email
    if (rememberMe) {
      localStorage.setItem('sharebite_saved_email', email.trim());
      localStorage.setItem('sharebite_remember_me', 'true');
    } else {
      localStorage.removeItem('sharebite_saved_email');
      localStorage.setItem('sharebite_remember_me', 'false');
    }

    const res = await loginUser({ email: email.trim(), password });
    if (res.success) {
      const userRole = res.user?.role || selectedRole;
      redirectAfterLogin(userRole);
    } else {
      setErrorMessage(res.message || 'Invalid email or password. Please try again or use a demo profile.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden bg-[#faf7f2]">
      {/* 3D background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#84cc16]/12 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0f392b]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo size="large" showTagline={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight">
            Sign In to ShareBite
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Food surplus donation & redistribution network
          </p>
        </div>

        {/* Existing Active Session Banner (if user already logged in) */}
        {currentUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-300 shrink-0">
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0f392b] flex items-center gap-1.5">
                  <span>Currently logged in:</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold bg-[#0f392b] text-[#84cc16]">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-xs text-gray-700 font-medium truncate max-w-[180px]">
                  {currentUser.name} ({currentUser.organization})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => redirectAfterLogin(currentUser.role)}
                className="px-3 py-1.5 rounded-xl bg-[#0f392b] text-white text-xs font-bold hover:bg-[#164e3b] transition-all shadow-xs"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Fast Hackathon Demo Login Buttons */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0f392b]">
              <Zap className="w-3.5 h-3.5 text-[#84cc16]" /> Instant 1-Click Demo Profiles
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Ready for evaluation</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('donor')}
              className="p-3 rounded-2xl bg-[#faf7f2] border border-gray-200 hover:border-[#84cc16] hover:bg-white shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0f392b] text-[#84cc16] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">Chef Marco</span>
              <span className="text-[9px] text-[#0f392b] font-extrabold uppercase bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
                Donor
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('recipient')}
              className="p-3 rounded-2xl bg-[#faf7f2] border border-gray-200 hover:border-[#f97316] hover:bg-white shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#f97316] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">Sarah Lin</span>
              <span className="text-[9px] text-[#f97316] font-extrabold uppercase bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                NGO Shelter
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-3 rounded-2xl bg-[#faf7f2] border border-gray-200 hover:border-purple-600 hover:bg-white shadow-xs text-center transition-all hover:scale-102 flex flex-col items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 leading-tight">David Vance</span>
              <span className="text-[9px] text-purple-700 font-extrabold uppercase bg-purple-100/80 px-1.5 py-0.5 rounded-md">
                Admin
              </span>
            </button>
          </div>
        </div>

        {/* Credentials Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-xl space-y-5">
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#faf7f2] border border-gray-200">
              <button
                type="button"
                onClick={() => handleRoleTabClick('donor')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'donor'
                    ? 'bg-[#0f392b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('recipient')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'recipient'
                    ? 'bg-[#0f392b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                NGO / Shelter
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('admin')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#0f392b] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#0f392b]'
                }`}
              >
                Admin
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
                className="text-rose-500 hover:text-rose-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. marco@verdeosteria.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-[#0f392b] hover:text-[#164e3b] font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0f392b] focus:ring-[#84cc16] accent-[#0f392b] cursor-pointer"
                />
                <span className="text-gray-600 font-medium">Remember my email</span>
              </label>

              <span className="text-[10px] text-gray-400 font-medium">
                {apiStatus === 'connected' ? 'Atlas Connected' : 'Simulated / Demo'}
              </span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-[#0f392b] hover:bg-[#164e3b] active:scale-[0.99] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#84cc16] animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4 text-[#84cc16]" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="pt-2 text-center text-xs text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#0f392b] hover:underline">
              Register New Organization
            </Link>
          </div>
        </div>

        {/* Prototype Disclaimer Notice */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#0f392b]/5 border border-[#0f392b]/10 text-gray-600">
          <Info className="w-4 h-4 text-[#84cc16] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-[#0f392b]">Prototype Notice:</strong> MongoDB Atlas live authentication is active when the backend is running. In offline mode, password validation and role switching are fully simulated for instant hackathon evaluation.
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f392b] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#84cc16]" />
                <span>Password Recovery Notice</span>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              In this prototype release, live outbound SMTP email password resets are disabled to avoid external dependencies. 
            </p>

            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-gray-200 text-xs space-y-1.5">
              <div className="font-bold text-[#0f392b]">Recommended prototype options:</div>
              <ul className="list-disc pl-4 text-gray-600 text-[11px] space-y-1">
                <li>Use the <strong>1-Click Instant Profiles</strong> above.</li>
                <li>Sign in with standard demo password: <code className="bg-white px-1.5 py-0.5 rounded border text-[#0f392b] font-mono">DonorPassword123!</code></li>
                <li>Or register a new account via the registration page.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(false);
                setEmail('marco@verdeosteria.com');
                setPassword('DonorPassword123!');
              }}
              className="w-full py-2.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all"
            >
              Fill Demo Credentials & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
