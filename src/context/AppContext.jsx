import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_DONATIONS, 
  INITIAL_DONORS, 
  INITIAL_RECIPIENTS, 
  INITIAL_NOTIFICATIONS,
  IMPACT_METRICS 
} from '../data/demoData';

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
    verified: true,
    safetyLicense: "FSSAI / FDA-NYC #8841-A",
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
    verified: true,
    taxId: "EIN-82-4910291 (501c3)",
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
    verified: true,
  }
};

export const AppProvider = ({ children }) => {
  // Load donations from localStorage or fallback
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('sharebite_donations');
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
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
      return savedNotifs ? JSON.parse(savedNotifs) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

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

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
      showToast(`Switched account to ${DEMO_USERS[roleKey].name} (${DEMO_USERS[roleKey].role.toUpperCase()})`, 'info');
    }
  };

  const customLogin = (userData) => {
    setCurrentUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Claim a donation
  const claimDonation = (donationId, recipientName) => {
    const claimer = recipientName || currentUser?.organization || "Eastside Hope Food Rescue";
    const verificationCode = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const otpCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    setDonations(prev => prev.map(item => {
      if (item.id === donationId) {
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
      message: `${claimer} has reserved "${donations.find(d => d.id === donationId)?.title}". Pickup verification code is ${verificationCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
      link: '/recipient-dashboard'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Donation claimed! Pickup code: ${verificationCode}. OTP is ${otpCode}`, 'success');
  };

  // Complete / Handoff verification
  const completeDonation = (donationId, enteredOtp) => {
    const item = donations.find(d => d.id === donationId);
    if (!item) return { success: false, message: "Listing not found" };

    if (item.otpCode && enteredOtp && item.otpCode.trim() !== enteredOtp.trim()) {
      showToast('Invalid verification OTP code. Please verify with the recipient representative.', 'error');
      return { success: false, message: "Invalid OTP code" };
    }

    setDonations(prev => prev.map(d => {
      if (d.id === donationId) {
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
  const addDonation = (donationData) => {
    const id = `DON-${Math.floor(100 + Math.random() * 900)}`;
    const newDonation = {
      id,
      title: donationData.title,
      category: donationData.category || "Prepared Meals",
      donorId: currentUser?.id || "donor-1",
      donorName: currentUser?.organization || "Verde Artisan Osteria",
      donorType: currentUser?.orgType || "Restaurant & Trattoria",
      servings: Number(donationData.servings) || 30,
      weightKg: Number(donationData.weightKg) || 12,
      status: "available",
      urgency: donationData.urgency || "urgent",
      timeRemainingMins: Number(donationData.timeRemainingMins) || 90,
      pickupWindow: donationData.pickupWindow || "Today, 6:00 PM - 8:00 PM",
      storageType: donationData.storageType || "Refrigerated Chilled (< 40°F)",
      packaging: donationData.packaging || "Sanitized food-grade sealed containers",
      allergens: donationData.allergens || ["None"],
      dietaryTags: donationData.dietaryTags || ["Vegetarian"],
      description: donationData.description || "Fresh surplus prepared food safely packaged for donation.",
      temperatureLog: donationData.temperatureLog || "Safe temperature logged at preparation.",
      distance: "1.0 km away",
      address: currentUser?.address || "412 Mulberry St, Downtown",
      imageUrl: donationData.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      claimedBy: null,
      claimTime: null,
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
      if (item.id === donationId) {
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

  // Reset demo data
  const resetDemoData = () => {
    setDonations(INITIAL_DONATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS.donor);
    localStorage.removeItem('sharebite_donations');
    localStorage.removeItem('sharebite_user');
    localStorage.removeItem('sharebite_notifs');
    showToast('Demo data restored to initial state', 'info');
  };

  // Compute live metrics
  const totalMealsSaved = donations
    .filter(d => d.status === 'completed' || d.status === 'claimed')
    .reduce((acc, curr) => acc + (curr.servings || 0), IMPACT_METRICS.totalMealsRescued);

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
        customLogin,
        logout,
        claimDonation,
        completeDonation,
        addDonation,
        cancelClaim,
        resetDemoData,
        totalMealsSaved,
        availableListingsCount,
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
