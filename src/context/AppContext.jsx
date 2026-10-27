import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_DONATIONS, 
  INITIAL_DONORS, 
  INITIAL_RECIPIENTS, 
  INITIAL_NOTIFICATIONS,
  IMPACT_METRICS 
} from '../data/demoData';
import api from '../services/api';

const AppContext = createContext();

export const DEMO_USERS = {
  donor: {
    id: "donor-1",
    name: "Chef Marco Rossi",
    email: "marco@verdeosteria.com",
    role: "donor",
    organization: "Verde Artisan Osteria",
    orgType: "Restaurant & Trattoria",
    address: "412 Mulberry St, Downtown",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    verified: false,
    safetyLicense: "Not verified",
  },
  recipient: {
    id: "recip-1",
    name: "Sarah Lin",
    email: "sarah@eastsidehope.org",
    role: "recipient",
    organization: "Eastside Hope Food Rescue & Shelter",
    orgType: "Emergency Shelter & Soup Kitchen",
    address: "320 Oak Ridge Rd, East District",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    verified: false,
    taxId: "Not verified",
  },
  admin: {
    id: "admin-1",
    name: "David Vance",
    email: "david.safety@sharebite.org",
    role: "admin",
    organization: "ShareBite Operations & Food Safety Board",
    orgType: "Platform Oversight",
    address: "ShareBite HQ, Innovation Way",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    verified: false,
  }
};

export const AppProvider = ({ children }) => {
  // Backend connectivity state
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
  const [apiHealth, setApiHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load donations from localStorage or fallback
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('sharebite_donations');
      if (saved) {
        const parsed = JSON.parse(saved);
        const sanitized = Array.isArray(parsed)
          ? parsed.filter(d => !['DON-101', 'DON-102', 'DON-103', 'DON-104', 'DON-105', 'DON-106'].includes(d.id))
          : [];
        return sanitized;
      }
      return INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sharebite_user');
      return savedUser ? JSON.parse(savedUser) : DEMO_USERS.donor;
    } catch {
      return DEMO_USERS.donor;
    }
  });

  // Notifications
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
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Active user's donation requests (from backend)
  const [myRequests, setMyRequests] = useState([]);

  // Modals & UI states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isPostWizardOpen, setIsPostWizardOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sharebite_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('sharebite_user', JSON.stringify(currentUser));
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

      // Fetch live listings if connected
      try {
        const res = await api.listings.getAll();
        if (res && res.data && res.data.length > 0) {
          // Normalize backend listings to frontend schema
          const normalized = res.data.map((l) => ({
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
            verificationCode: "SB-4892",
            otpCode: "749210",
            createdAt: l.createdAt,
          }));
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

  // Real or mock login
  const loginUser = async (credentials) => {
    setIsLoading(true);
    try {
      if (apiStatus === 'connected') {
        const res = await api.auth.login(credentials);
        if (res.user) {
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
          };
          setCurrentUser(userObj);
          showToast(`Welcome back, ${res.user.name}!`, 'success');
          setIsLoading(false);
          return { success: true, user: userObj };
        }
      }
    } catch (err) {
      if (!err.isOffline) {
        showToast(err.message || 'Login failed', 'error');
        setIsLoading(false);
        return { success: false, message: err.message };
      }
    }

    // Fallback: local demo login
    const foundDemo = Object.values(DEMO_USERS).find(u => u.email === credentials.email);
    const userToSet = foundDemo || {
      id: `user-${Date.now()}`,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: 'donor',
      organization: 'Local Kitchen Partner',
    };
    setCurrentUser(userToSet);
    showToast(`Signed in in Offline Demo Mode as ${userToSet.name}`, 'info');
    setIsLoading(false);
    return { success: true, user: userToSet };
  };

  // Real or mock registration
  const registerUser = async (registrationData) => {
    setIsLoading(true);
    try {
      if (apiStatus === 'connected') {
        const res = await api.auth.register(registrationData);
        if (res.user) {
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
          };
          setCurrentUser(userObj);
          showToast(`Account registered successfully on MongoDB!`, 'success');
          setIsLoading(false);
          return { success: true, user: userObj };
        }
      }
    } catch (err) {
      if (!err.isOffline) {
        showToast(err.message || 'Registration failed', 'error');
        setIsLoading(false);
        return { success: false, message: err.message };
      }
    }

    // Fallback: local demo registration
    const newUser = {
      id: `user-${Date.now()}`,
      name: registrationData.name,
      email: registrationData.email,
      role: registrationData.role || 'donor',
      organization: registrationData.organizationName || registrationData.organization || 'Community Member',
      address: registrationData.address || '',
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    };
    setCurrentUser(newUser);
    showToast(`Registered in Demo Mode as ${newUser.name}`, 'info');
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const customLogin = (userData) => {
    setCurrentUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logout = () => {
    api.auth.logout();
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Claim a donation
  const claimDonation = async (donationId, recipientName) => {
    const claimer = recipientName || currentUser?.organization || "Eastside Hope Food Rescue";
    const verificationCode = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const otpCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const targetDonation = donations.find(d => d.id === donationId || d._id === donationId);

    // Try real API if connected and has MongoDB _id
    if (apiStatus === 'connected' && targetDonation?._id) {
      try {
        await api.requests.create({
          listingId: targetDonation._id,
          requestedQuantity: targetDonation.servings || 10,
          notes: `Reserved by ${claimer}`,
        });
      } catch (err) {
        if (!err.isOffline) {
          showToast(`API: ${err.message}`, 'error');
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
          otpCode
        };
      }
      return item;
    }));

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
  };

  // Complete / Handoff verification
  const completeDonation = async (donationId, enteredOtp) => {
    const item = donations.find(d => d.id === donationId || d._id === donationId);
    if (!item) return { success: false, message: "Listing not found" };

    if (item.otpCode && enteredOtp && item.otpCode.trim() !== enteredOtp.trim()) {
      showToast('Invalid verification OTP code. Please verify with the recipient representative.', 'error');
      return { success: false, message: "Invalid OTP code" };
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

    let backendId = null;

    if (apiStatus === 'connected') {
      try {
        const res = await api.listings.create(payload);
        if (res && res.data) {
          backendId = res.data._id;
        }
      } catch (err) {
        if (!err.isOffline) {
          showToast(`Server note: ${err.message}`, 'info');
        }
      }
    }

    const id = backendId || `DON-${Math.floor(100 + Math.random() * 900)}`;
    const newDonation = {
      id,
      _id: backendId,
      ...payload,
      donorId: currentUser?.id || "donor-1",
      donorName: currentUser?.organization || "Verde Artisan Osteria",
      donorType: currentUser?.orgType || "Restaurant & Trattoria",
      servings: payload.quantity,
      status: "available",
      urgency: donationData.urgency || "urgent",
      timeRemainingMins: Number(donationData.timeRemainingMins) || 90,
      pickupWindow: donationData.pickupWindow || "Today, 6:00 PM - 8:00 PM",
      distance: "1.0 km away",
      address: payload.pickupAddress,
      verificationCode: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
      otpCode: `${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
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
    return newDonation;
  };

  // Cancel reservation
  const cancelClaim = (donationId) => {
    setDonations(prev => prev.map(item => {
      if (item.id === donationId || item._id === donationId) {
        return {
          ...item,
          status: 'available',
          claimedBy: null,
          claimTime: null
        };
      }
      return item;
    }));
    showToast('Reservation cancelled. The food is now available for other NGOs.', 'info');
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
