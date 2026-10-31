import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_DONATIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/demoData';
import api from '../services/api';

const AppContext = createContext();

export const DEMO_USERS = {
  donor: {
    id: "donor-kushal",
    name: "Kushal",
    email: "kushal@hotelparadise.com",
    role: "donor",
    organization: "Hotel Paradise",
    orgType: "Fine Dining & Hospitality",
    address: "Banjara Hills, Hyderabad, Telangana",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    verified: true,
    safetyLicense: "FSSAI-HYD-9812",
  },
  recipient: {
    id: "recip-care",
    name: "NGO Care Foundation",
    email: "care@ngofoundation.org",
    role: "recipient",
    organization: "NGO Care Foundation",
    orgType: "Community Food Relief & Shelter",
    address: "Banjara Hills, Hyderabad, Telangana",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    verified: true,
    taxId: "80G-HYD-5120",
  },
  admin: {
    id: "admin-1",
    name: "David Vance",
    email: "david.safety@sharebite.org",
    role: "admin",
    organization: "ShareBite Operations & Safety Board",
    orgType: "Platform Oversight",
    address: "ShareBite Global Hub, Innovation Way",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    verified: true,
  }
};

export const AppProvider = ({ children }) => {
  // Backend connectivity state
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
  const [apiHealth, setApiHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load donations from localStorage (empty baseline for fresh testing)
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('sharebite_donations_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Current active user - null by default for unauthenticated sessions
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sharebite_user');
      if (savedUser && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        return (parsed && parsed.id) ? parsed : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Notifications (empty baseline for fresh testing)
  const [notifications, setNotifications] = useState(() => {
    try {
      const savedNotifs = localStorage.getItem('sharebite_notifs');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        const sanitized = Array.isArray(parsed)
          ? parsed.filter(n => !['notif-1', 'notif-2', 'notif-3', 'notif-4'].includes(n.id) && !n.id?.startsWith('notif-demo-'))
          : [];
        return sanitized;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Modals & UI states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isPostWizardOpen, setIsPostWizardOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sharebite_donations_v2', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sharebite_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sharebite_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sharebite_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  // Check backend health and sync live data if available
  const checkBackend = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      setApiStatus('connected');
      setApiHealth(health);

      // Verify active session with backend if token exists in storage
      const token = api.getAuthToken();
      if (token) {
        try {
          const userRes = await api.users.getMe();
          if (userRes && userRes.user) {
            const userObj = {
              id: userRes.user._id,
              name: userRes.user.name,
              email: userRes.user.email,
              role: userRes.user.role,
              organization: userRes.user.organizationName || userRes.user.name,
              address: userRes.user.address,
              avatar: userRes.user.profileDetails?.avatar,
              safetyLicense: userRes.user.profileDetails?.safetyLicense,
              taxId: userRes.user.profileDetails?.taxId,
              isVerified: Boolean(userRes.user.isVerified),
              preferences: userRes.user.preferences,
            };
            setCurrentUser(userObj);
          }
        } catch (authErr) {
          // If token is expired or invalid (401), safely clear invalid session
          if (authErr.status === 401) {
            api.auth.logout();
            setCurrentUser(null);
            localStorage.removeItem('sharebite_user');
            localStorage.removeItem('sharebite_token');
          }
        }
      }

      // Fetch live listings if connected
      try {
        const res = await api.listings.getAll();
        if (res && Array.isArray(res.data)) {
          // Also fetch requests if user is authenticated to associate OTP and verification pass
          let userRequests = [];
          if (api.getAuthToken()) {
            try {
              const reqRes = await api.requests.getMy();
              if (reqRes && Array.isArray(reqRes.data)) {
                userRequests = reqRes.data;
              }
            } catch {
              // ignore
            }
          }

          // Normalize backend listings to frontend schema
          const normalized = res.data.map((l) => {
            const reqMatch = userRequests.find(r => (r.listingId?._id || r.listingId) === l._id);
            return {
              id: l._id || l.id,
              _id: l._id,
              title: l.title,
              category: l.category,
              donorId: l.donorId?._id || l.donorId,
              donorName: l.donorId?.organizationName || l.donorId?.name || "Verified Kitchen",
              donorType: l.donorId?.profileDetails?.orgType || "Food Establishment",
              servings: l.quantity,
              weightKg: l.weightKg || 0,
              status: l.status === 'fully_reserved' ? 'claimed' : l.status,
              claimedBy: reqMatch?.recipientId?.organizationName || reqMatch?.recipientId?.name,
              requestId: reqMatch?._id,
              urgency: 'urgent',
              timeRemainingMins: 90,
              pickupWindow: `${new Date(l.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(l.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              storageType: l.storageType,
              packaging: l.packaging,
              allergens: l.allergens || ['None'],
              dietaryTags: l.dietaryTags || [],
              description: l.description,
              temperatureLog: l.temperatureLog,
              distance: "1.2 km away",
              address: l.pickupAddress,
              imageUrl: l.imageUrl,
              verificationCode: reqMatch?.pickupConfirmationDetails?.verificationCode || "SB-4892",
              otpCode: reqMatch?.pickupConfirmationDetails?.otpCode || "749210",
              createdAt: l.createdAt,
            };
          });
          setDonations(normalized);
        }
      } catch {
        // use local cache if listings fetch fails
      }
    } catch {
      setApiStatus('offline');
      setApiHealth(null);
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
      showToast(`Switched demo account to ${DEMO_USERS[roleKey].name} (${DEMO_USERS[roleKey].role.toUpperCase()})`, 'info');
    }
  };

  // Real API login
  const loginUser = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(credentials);
      if (res && res.user) {
        const userObj = {
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          organization: res.user.organizationName || res.user.name,
          address: res.user.address,
          avatar: res.user.profileDetails?.avatar,
          safetyLicense: res.user.profileDetails?.safetyLicense,
          taxId: res.user.profileDetails?.taxId,
          isVerified: Boolean(res.user.isVerified),
          preferences: res.user.preferences,
        };
        setCurrentUser(userObj);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        setIsLoading(false);
        return { success: true, user: userObj };
      }
      setIsLoading(false);
      return { success: false, message: 'Invalid response received from server.' };
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please verify your email and password.';
      showToast(errorMsg, 'error');
      setIsLoading(false);
      return { success: false, message: errorMsg };
    }
  };

  // Real API registration
  const registerUser = async (registrationData) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(registrationData);
      if (res && res.user) {
        const userObj = {
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          organization: res.user.organizationName || res.user.name,
          address: res.user.address,
          avatar: res.user.profileDetails?.avatar,
          safetyLicense: res.user.profileDetails?.safetyLicense,
          taxId: res.user.profileDetails?.taxId,
          isVerified: Boolean(res.user.isVerified),
          preferences: res.user.preferences,
        };
        setCurrentUser(userObj);
        showToast('Account registered successfully on MongoDB!', 'success');
        setIsLoading(false);
        return { success: true, user: userObj };
      }
      setIsLoading(false);
      return { success: false, message: 'Registration failed.' };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed.';
      showToast(errorMsg, 'error');
      setIsLoading(false);
      return { success: false, message: errorMsg };
    }
  };

  const customLogin = (userData) => {
    setCurrentUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logout = () => {
    try {
      api.auth.logout();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('sharebite_user');
    localStorage.removeItem('sharebite_token');
    showToast('Logged out successfully', 'info');
  };

  // Update authenticated user's profile and preferences
  const updateUserProfile = async ({ name, preferences, organization }) => {
    setIsLoading(true);
    try {
      if (apiStatus === 'connected') {
        const updatePayload = {};
        if (name !== undefined) updatePayload.name = name;
        if (organization !== undefined) updatePayload.organizationName = organization;
        if (preferences !== undefined) updatePayload.preferences = preferences;

        const res = await api.users.updateMe(updatePayload);
        if (res && res.user) {
          const updatedUser = {
            ...currentUser,
            name: res.user.name,
            organization: res.user.organizationName || currentUser?.organization,
            preferences: res.user.preferences || preferences || currentUser?.preferences,
          };
          setCurrentUser(updatedUser);
          showToast('Profile updated successfully!', 'success');
          setIsLoading(false);
          return { success: true, user: updatedUser };
        }
      }
    } catch (err) {
      if (!err.isOffline) {
        showToast(err.message || 'Failed to update profile', 'error');
        setIsLoading(false);
        return { success: false, message: err.message };
      }
    }

    // Fallback: simulated update for demo/offline mode
    const updatedUser = {
      ...currentUser,
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(organization !== undefined ? { organization: organization.trim() } : {}),
      preferences: {
        ...(currentUser?.preferences || {
          urgentAlerts: true,
          soundAlerts: true,
          weeklyDigest: true,
          autoRefresh: false,
        }),
        ...(preferences || {}),
      },
    };

    setCurrentUser(updatedUser);
    showToast('Profile updated successfully!', 'success');
    setIsLoading(false);
    return { success: true, user: updatedUser };
  };

  // Claim a donation
  const claimDonation = async (donationId, recipientName) => {
    const claimer = recipientName || currentUser?.organization || "Eastside Hope Food Rescue";
    let verificationCode = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    let otpCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    let requestId = null;

    const targetDonation = donations.find(d => d.id === donationId || d._id === donationId);

    // Persist to MongoDB via real API if connected and has MongoDB _id
    if (apiStatus === 'connected' && targetDonation?._id) {
      try {
        const res = await api.requests.create({
          listingId: targetDonation._id,
          requestedQuantity: targetDonation.servings || 10,
          notes: `Reserved by ${claimer}`,
        });

        if (res && res.data) {
          requestId = res.data._id;
          if (res.data.pickupConfirmationDetails?.verificationCode) {
            verificationCode = res.data.pickupConfirmationDetails.verificationCode;
          }
          if (res.data.pickupConfirmationDetails?.otpCode) {
            otpCode = res.data.pickupConfirmationDetails.otpCode;
          }
        }
      } catch (err) {
        if (!err.isOffline) {
          showToast(`Reservation failed: ${err.message}`, 'error');
          return { success: false, message: err.message };
        }
      }
    }

    // Update local state
    setDonations(prev => prev.map(item => {
      if (item.id === donationId || item._id === donationId) {
        return {
          ...item,
          status: 'claimed',
          claimedBy: claimer,
          claimTime: new Date().toISOString(),
          verificationCode,
          otpCode,
          requestId,
        };
      }
      return item;
    }));

    if (selectedDonation && (selectedDonation.id === donationId || selectedDonation._id === donationId)) {
      setSelectedDonation(prev => ({
        ...prev,
        status: 'claimed',
        claimedBy: claimer,
        claimTime: new Date().toISOString(),
        verificationCode,
        otpCode,
        requestId,
      }));
    }

    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: '🎉 Surplus Reserved Successfully!',
      message: `${claimer} has reserved "${targetDonation?.title || 'Food listing'}". Pickup verification code is ${verificationCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
      link: '/recipient-dashboard'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Donation claimed! Pickup code: ${verificationCode}. OTP is ${otpCode}`, 'success');
    return { success: true, verificationCode, otpCode, requestId };
  };

  // Complete / Handoff verification
  const completeDonation = async (donationId, enteredOtp) => {
    const item = donations.find(d => d.id === donationId || d._id === donationId);
    if (!item) return { success: false, message: "Listing not found" };

    if (item.otpCode && enteredOtp && item.otpCode.trim() !== enteredOtp.trim()) {
      showToast('Invalid verification OTP code. Please verify with the recipient representative.', 'error');
      return { success: false, message: "Invalid OTP code" };
    }

    // Persist to MongoDB via real API if connected and has an associated requestId
    if (apiStatus === 'connected' && item.requestId) {
      try {
        await api.requests.complete(item.requestId, enteredOtp);
      } catch (err) {
        if (!err.isOffline) {
          showToast(`Handoff completion failed: ${err.message}`, 'error');
          return { success: false, message: err.message };
        }
      }
    }

    setDonations(prev => prev.map(d => {
      if (d.id === donationId || d._id === donationId) {
        return {
          ...d,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    if (selectedDonation && (selectedDonation.id === donationId || selectedDonation._id === donationId)) {
      setSelectedDonation(prev => ({
        ...prev,
        status: 'completed',
        completedAt: new Date().toISOString(),
      }));
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: '✅ Zero-Waste Handoff Completed!',
      message: `Handoff verified for "${item.title}". ${item.servings} meals successfully saved from waste!`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
      link: '/donor-dashboard'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Handoff verified! ${item.servings} meals preserved!`, 'success');
    return { success: true };
  };

  // Add a new surplus listing
  const addDonation = async (donationData) => {
    const now = Date.now();
    const payload = {
      title: donationData.title,
      description: donationData.description || "Fresh surplus prepared food safely packaged for donation.",
      category: donationData.category || "Prepared Meals",
      quantity: Number(donationData.servings) || 30,
      unit: "servings",
      weightKg: Number(donationData.weightKg) || 12,
      pickupAddress: currentUser?.address || donationData.address || "412 Mulberry St, Downtown",
      pickupStart: new Date(now + 1800000).toISOString(),
      pickupEnd: new Date(now + 14400000).toISOString(),
      handlingInstructions: donationData.storageType || "Refrigerated Chilled (< 40°F)",
      expiryGuidance: "Consume or refrigerate within 2 hours",
      allergens: Array.isArray(donationData.allergens) ? donationData.allergens : [donationData.allergens || "None"],
      dietaryTags: donationData.dietaryTags || ["Vegetarian"],
      storageType: donationData.storageType || "Refrigerated Chilled (< 40°F / 4°C)",
      temperatureLog: donationData.temperatureLog || "Safe temperature logged at preparation.",
      packaging: donationData.packaging || "Sanitized food-grade sealed containers",
      imageUrl: donationData.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    };

    let backendItem = null;

    if (apiStatus === 'connected') {
      try {
        const res = await api.listings.create(payload);
        if (res && res.data) {
          backendItem = res.data;
        }
      } catch (err) {
        if (!err.isOffline) {
          showToast(`Listing creation failed: ${err.message}`, 'error');
          return { success: false, message: err.message };
        }
      }
    }

    const id = backendItem?._id || `DON-${Math.floor(100 + Math.random() * 900)}`;
    const newDonation = {
      id,
      _id: backendItem?._id,
      ...payload,
      donorId: backendItem?.donorId?._id || backendItem?.donorId || currentUser?.id || "donor-1",
      donorName: backendItem?.donorId?.organizationName || currentUser?.organization || "Verde Artisan Osteria",
      donorType: backendItem?.donorId?.profileDetails?.orgType || currentUser?.orgType || "Restaurant & Trattoria",
      servings: payload.quantity,
      status: "available",
      urgency: donationData.urgency || "urgent",
      timeRemainingMins: Number(donationData.timeRemainingMins) || 90,
      pickupWindow: donationData.pickupWindow || "Today, 6:00 PM - 8:00 PM",
      distance: "1.0 km away",
      address: payload.pickupAddress,
      verificationCode: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
      otpCode: `${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: backendItem?.createdAt || new Date().toISOString()
    };

    setDonations(prev => [newDonation, ...prev]);

    // Create alert
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: '⚡ New Surplus Food Listed!',
      message: `${newDonation.donorName} just listed ${newDonation.servings} servings of "${newDonation.title}".`,
      timestamp: 'Just now',
      read: false,
      type: 'urgent',
      link: '/explore'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`"${newDonation.title}" listed successfully! Local NGOs notified.`, 'success');
    return { success: true, donation: newDonation };
  };

  // Cancel reservation
  const cancelClaim = async (donationId) => {
    const item = donations.find(d => d.id === donationId || d._id === donationId);
    if (apiStatus === 'connected' && item?.requestId) {
      try {
        await api.requests.cancel(item.requestId, 'Cancelled by user');
      } catch (err) {
        if (!err.isOffline) {
          showToast(`Cancel request failed: ${err.message}`, 'error');
          return { success: false, message: err.message };
        }
      }
    }

    setDonations(prev => prev.map(item => {
      if (item.id === donationId || item._id === donationId) {
        return {
          ...item,
          status: 'available',
          claimedBy: null,
          claimTime: null,
          requestId: null,
        };
      }
      return item;
    }));

    if (selectedDonation && (selectedDonation.id === donationId || selectedDonation._id === donationId)) {
      setSelectedDonation(prev => ({
        ...prev,
        status: 'available',
        claimedBy: null,
        claimTime: null,
        requestId: null,
      }));
    }

    showToast('Reservation cancelled. The food is now available for other NGOs.', 'info');
    return { success: true };
  };

  // Reset application data to zero / empty
  const resetDemoData = () => {
    setDonations([]);
    setNotifications([]);
    setCurrentUser(DEMO_USERS.donor);
    localStorage.removeItem('sharebite_donations');
    localStorage.removeItem('sharebite_user');
    localStorage.removeItem('sharebite_notifs');
    localStorage.removeItem('sharebite_token');
    showToast('All application data reset to empty state', 'info');
  };

  // Compute live metrics (starts strictly at 0)
  const totalMealsSaved = donations
    .filter(d => d.status === 'completed' || d.status === 'claimed')
    .reduce((acc, curr) => acc + (curr.servings || 0), 0);

  const availableListingsCount = donations.filter(d => d.status === 'available').length;

  return (
    <AppContext.Provider
      value={{
        donations,
        currentUser,
        notifications,
        selectedDonation,
        setSelectedDonation,
        isPostWizardOpen,
        setIsPostWizardOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        activeToast,
        showToast,
        switchRole,
        loginUser,
        registerUser,
        customLogin,
        logout,
        updateUserProfile,
        claimDonation,
        completeDonation,
        addDonation,
        cancelClaim,
        resetDemoData,
        totalMealsSaved,
        availableListingsCount,
        apiStatus,
        apiHealth,
        checkBackend,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
