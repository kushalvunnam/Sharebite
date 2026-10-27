import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Clock, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer = () => {
  const { 
    notifications, 
    isNotificationOpen, 
    setIsNotificationOpen 
  } = useApp();
  const navigate = useNavigate();

  if (!isNotificationOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNotificationOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-gray-100"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#0f392b] text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#84cc16]/20 text-[#84cc16]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-['Outfit']">Notifications</h3>
                <p className="text-xs text-white/70">Real-time rescue & dispatch updates</p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of alerts */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Bell className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
                <p className="font-semibold text-gray-600">No notifications</p>
                <p className="text-xs text-gray-400 mt-1">No pending notifications at this moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`pt-3 first:pt-0 p-3.5 rounded-2xl transition-all cursor-pointer ${
                    notif.read ? 'bg-gray-50/60 hover:bg-gray-50' : 'bg-[#faf7f2] border border-[#84cc16]/30 hover:border-[#84cc16]'
                  }`}
                  onClick={() => {
                    if (notif.link) {
                      navigate(notif.link);
                      setIsNotificationOpen(false);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      notif.type === 'urgent' 
                        ? 'bg-amber-100 text-amber-700' 
                        : notif.type === 'milestone'
                        ? 'bg-emerald-100 text-[#0f392b]'
                        : 'bg-[#84cc16]/20 text-[#0f392b]'
                    }`}>
                      {notif.type === 'urgent' ? (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      ) : notif.type === 'milestone' ? (
                        <Sparkles className="w-4 h-4 text-[#84cc16]" />
                      ) : (
                        <CheckCheck className="w-4 h-4 text-[#0f392b]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900">{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f392b] hover:text-[#84cc16] mt-2 transition-colors">
                          View details <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Automatic alert frequency: Real-time</span>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-[#0f392b] font-bold hover:underline"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDrawer;
