import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Utensils, 
  HeartHandshake, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Building2, 
  Loader2, 
  LogOut, 
  Check,
  RefreshCw,
  Sliders,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TiltCard } from '../components/3d/TiltCard';

export const SettingsPage = () => {
  const { currentUser, updateUserProfile, logout, apiStatus, showToast } = useApp();
  const navigate = useNavigate();

  // Local state for editing profile
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Working preferences state
  const [preferences, setPreferences] = useState({
    urgentAlerts: true,
    soundAlerts: true,
    weeklyDigest: true,
    autoRefresh: false,
  });
  const [hasPreferencesChanged, setHasPreferencesChanged] = useState(false);

  // Sync state with current user
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setOrganization(currentUser.organization || '');
      if (currentUser.preferences) {
        setPreferences({
          urgentAlerts: currentUser.preferences.urgentAlerts ?? true,
          soundAlerts: currentUser.preferences.soundAlerts ?? true,
          weeklyDigest: currentUser.preferences.weeklyDigest ?? true,
          autoRefresh: currentUser.preferences.autoRefresh ?? false,
        });
      }
    }
  }, [currentUser]);

  // Compute initials fallback
  const getInitials = (str) => {
    if (!str || !str.trim()) return 'SB';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Web Audio chime test
  const playTestChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
      showToast('Audio notification chime played!', 'info');
    } catch {
      showToast('Audio playback not supported in this browser environment', 'error');
    }
  };

  // Preference toggle handler
  const handleTogglePreference = (key) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setHasPreferencesChanged(true);
      return updated;
    });
  };

  // Save profile changes (Name and Organization)
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Name validation
    if (!name || !name.trim()) {
      setErrorMessage('Full name cannot be empty. Please enter your name.');
      return;
    }

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setErrorMessage('Full name is too short. Minimum 2 characters required.');
      return;
    }

    if (trimmed.length > 60) {
      setErrorMessage('Full name cannot exceed 60 characters.');
      return;
    }

    setIsSaving(true);
    const res = await updateUserProfile({
      name: trimmed,
      organization: organization.trim(),
      preferences,
    });
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Your profile and name have been updated successfully!');
      setIsEditing(false);
      setHasPreferencesChanged(false);
      setTimeout(() => setSuccessMessage(''), 4500);
    } else {
      setErrorMessage(res.message || 'Failed to update profile. Please try again.');
    }
  };

  // Save preferences explicitly if toggled without name editing
  const handleSavePreferencesOnly = async () => {
    setIsSaving(true);
    const res = await updateUserProfile({
      name: currentUser.name,
      preferences,
    });
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Account preferences saved!');
      setHasPreferencesChanged(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(res.message || 'Failed to save preferences.');
    }
  };

  // Cancel unsaved changes
  const handleCancel = () => {
    if (currentUser) {
      setName(currentUser.name || '');
      setOrganization(currentUser.organization || '');
      if (currentUser.preferences) {
        setPreferences({
          urgentAlerts: currentUser.preferences.urgentAlerts ?? true,
          soundAlerts: currentUser.preferences.soundAlerts ?? true,
          weeklyDigest: currentUser.preferences.weeklyDigest ?? true,
          autoRefresh: currentUser.preferences.autoRefresh ?? false,
        });
      }
    }
    setIsEditing(false);
    setHasPreferencesChanged(false);
    setErrorMessage('');
  };

  const getDashboardPath = () => {
    if (currentUser?.role === 'recipient') return '/recipient-dashboard';
    if (currentUser?.role === 'admin') return '/admin';
    return '/donor-dashboard';
  };

  const getRoleBadge = (role) => {
    if (role === 'recipient') {
      return {
        label: 'Recipient Organization / NGO',
        bg: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: <HeartHandshake className="w-4 h-4 text-[#f97316]" />,
      };
    }
    if (role === 'admin') {
      return {
        label: 'Platform Compliance Administrator',
        bg: 'bg-purple-100 text-purple-900 border-purple-300',
        icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
      };
    }
    return {
      label: 'Verified Food Donor Kitchen',
      bg: 'bg-emerald-100 text-[#0f392b] border-emerald-300',
      icon: <Utensils className="w-4 h-4 text-[#84cc16]" />,
    };
  };

  const roleInfo = getRoleBadge(currentUser?.role);

  return (
    <div className="min-h-screen py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(getDashboardPath())}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f392b] hover:text-[#164e3b] transition-colors mb-2 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f392b] font-['Outfit'] tracking-tight flex items-center gap-2">
            <span>Account & Profile Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Manage your authenticated profile details, change your display name, and configure live platform preferences.
          </p>
        </div>

        {/* Backend status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs text-xs font-semibold self-start sm:self-center">
          <span className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-gray-700">
            {apiStatus === 'connected' ? 'Atlas MongoDB Sync' : 'Offline Prototype Session'}
          </span>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <TiltCard className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 text-center flex flex-col items-center">
            
            {/* Profile Avatar / Fallback Initials */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#0f392b]/10 group-hover:border-[#84cc16] transition-all shadow-md bg-[#faf7f2] flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                {/* Fallback Initials */}
                <span className="text-2xl font-black text-[#0f392b] font-['Outfit'] select-none">
                  {getInitials(name || currentUser?.name)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#84cc16] text-[#0f392b] border-2 border-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0f392b] font-['Outfit'] truncate max-w-[220px]">
                {currentUser?.name}
              </h2>
              <p className="text-xs text-gray-500 truncate max-w-[220px] mt-0.5">
                {currentUser?.organization || "ShareBite Partner"}
              </p>
            </div>

            {/* Role Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${roleInfo.bg}`}>
              {roleInfo.icon}
              <span className="uppercase text-[10px] tracking-wide font-extrabold">{currentUser?.role}</span>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 space-y-2 text-left text-xs">
              <div className="flex justify-between items-center text-gray-500">
                <span>Account Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Session
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>Email Identity:</span>
                <span className="font-mono text-[11px] text-gray-800 truncate max-w-[140px]" title={currentUser?.email}>
                  {currentUser?.email}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </TiltCard>

          {/* Prototype Security Notice */}
          <div className="p-4 rounded-3xl bg-[#0f392b]/5 border border-[#0f392b]/10 text-xs text-gray-600 space-y-1.5">
            <div className="font-bold text-[#0f392b] flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#84cc16]" />
              <span>Role & Email Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-600">
              For security compliance, user role and email are locked to your authentication identity. Display name updates propagate across all platform views immediately.
            </p>
          </div>
        </div>

        {/* Right Column: Editable Profile Information & Working Preferences */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Profile Information (With Working Name Edit) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0f392b] font-['Outfit'] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#84cc16]" />
                  <span>Personal Profile Details</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Update how your name appears on donation listings, receipts, and dashboards.
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setErrorMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#84cc16]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#84cc16] animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-[#84cc16]" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="user-fullname" className="text-xs font-bold text-gray-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {name.length} / 60
                  </span>
                </div>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="user-fullname"
                    type="text"
                    required
                    maxLength={60}
                    disabled={!isEditing || isSaving}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isEditing
                        ? 'bg-white border-[#0f392b] ring-2 ring-[#84cc16]/20 focus:outline-none text-gray-900'
                        : 'bg-gray-50/70 border-gray-200 text-gray-700 cursor-not-allowed'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Shown in navbar, claim verifications, and audit reports.
                </p>
              </div>

              {/* Organization Name Input */}
              <div>
                <label htmlFor="user-org" className="block text-xs font-bold text-gray-700 mb-1.5">
                  Organization / Establishment Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="user-org"
                    type="text"
                    maxLength={150}
                    disabled={!isEditing || isSaving}
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="e.g. Verde Artisan Trattoria"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isEditing
                        ? 'bg-white border-[#0f392b] ring-2 ring-[#84cc16]/20 focus:outline-none text-gray-900'
                        : 'bg-gray-50/70 border-gray-200 text-gray-700 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Read-Only Email Display */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Primary Email Address
                  </label>
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-xs font-medium cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Primary login email cannot be changed from profile settings.
                </p>
              </div>

              {/* Account Role Display */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Assigned Platform Role
                </label>
                <div className="p-3 rounded-2xl bg-[#faf7f2] border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {roleInfo.icon}
                    <span className="text-xs font-bold text-[#0f392b]">{roleInfo.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-500">
                    Immutable
                  </span>
                </div>
              </div>

              {/* Bottom Action Buttons if Editing */}
              {isEditing && (
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#84cc16] animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-[#84cc16]" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Account Preferences (Working Functional Controls) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0f392b] font-['Outfit'] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#84cc16]" />
                  <span>Notification & Live Experience Preferences</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Configure real-time alerts and interactive dashboard behaviors.
                </p>
              </div>

              {hasPreferencesChanged && (
                <button
                  type="button"
                  onClick={handleSavePreferencesOnly}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start cursor-pointer disabled:opacity-75"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#84cc16] animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-[#84cc16]" />
                  )}
                  <span>Save Preferences</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Option 1: Urgent Pickup Alerts */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>Urgent Food Rescue Alerts</span>
                    {preferences.urgentAlerts && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Display high-priority notifications when food surplus listings enter their final 90-minute pickup window.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePreference('urgentAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                    preferences.urgentAlerts ? 'bg-[#0f392b]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Urgent Food Rescue Alerts"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    preferences.urgentAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 2: Sound / Chime Notifications */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>Interactive Audio Chimes</span>
                    <button
                      type="button"
                      onClick={playTestChime}
                      className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-[#0f392b] hover:bg-[#84cc16]/20 transition-all flex items-center gap-1 cursor-pointer"
                      title="Test Audio Chime"
                    >
                      <Volume2 className="w-3 h-3 text-[#84cc16]" />
                      <span>Test Chime</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Play a subtle harmonic Web Audio chime upon completed claims and OTP handoffs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePreference('soundAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                    preferences.soundAlerts ? 'bg-[#0f392b]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Interactive Audio Chimes"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    preferences.soundAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 3: Weekly Environmental Digest */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>Weekly Impact & ESG Summary</span>
                    {preferences.weeklyDigest && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Enabled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Summarize rescued meals, carbon emissions avoided, and tax receipt estimations weekly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePreference('weeklyDigest')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                    preferences.weeklyDigest ? 'bg-[#0f392b]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Weekly Impact Summary"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 4: Live Listings Auto-Refresh */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>Live Directory Polling</span>
                    {preferences.autoRefresh && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#84cc16]/30 text-[#0f392b]">
                        Polling On
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Continuously update explore feeds with fresh food donations in the background.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePreference('autoRefresh')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                    preferences.autoRefresh ? 'bg-[#0f392b]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Live Directory Polling"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    preferences.autoRefresh ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {hasPreferencesChanged && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePreferencesOnly}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0f392b] hover:bg-[#164e3b] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#84cc16] animate-spin" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#84cc16]" />
                      <span>Save All Preferences</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
