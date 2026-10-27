import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotificationDrawer from './components/common/NotificationDrawer';
import DonationDetailModal from './components/donation/DonationDetailModal';
import PostDonationWizard from './components/donation/PostDonationWizard';

import LandingPage from './pages/LandingPage';
import ExploreDonationsPage from './pages/ExploreDonationsPage';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ImpactPage from './pages/ImpactPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top component on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route protection component: guards private routes from unauthenticated users
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    // Preserve the attempted URL in location.state.from so login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role does not match allowed roles for this route, redirect to their role dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'donor') return <Navigate to="/donor-dashboard" replace />;
    if (currentUser.role === 'recipient') return <Navigate to="/recipient-dashboard" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Global Toast Banner
const ToastAlert = () => {
  const { activeToast } = useApp();
  if (!activeToast) return null;

  const isError = activeToast.type === 'error';
  const isInfo = activeToast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 backdrop-blur-md ${
        isError
          ? 'bg-rose-900 text-white border-rose-700'
          : isInfo
          ? 'bg-[#0f392b] text-white border-[#84cc16]/40'
          : 'bg-[#0f392b] text-[#84cc16] border-[#84cc16]'
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-ping" />
        <span className="text-white">{activeToast.message}</span>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1a2e26]">
      <ScrollToTop />
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Default entry route: / redirects immediately to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Landing / Home marketing pages */}
          <Route path="/home" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Public authentication and exploration routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<ExploreDonationsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/safety" element={<SafetyGuidelinesPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient-dashboard"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <RecipientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Account & Profile Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['donor', 'recipient', 'admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for unknown application paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <NotificationDrawer />
      <DonationDetailModal />
      <PostDonationWizard />
      <ToastAlert />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
