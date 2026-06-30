import React, { useState, useEffect, useRef } from 'react';
import { db } from '../data/mockDatabase';
import type { Notification } from '../data/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Siren, X, BellOff } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(db.getNotifications());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setNotifications(db.getNotifications());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    db.markAllNotificationsRead();
  };

  const handleNotificationClick = (id: string) => {
    db.markNotificationRead(id);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'SOS':
        return <Siren className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-96 z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-100 font-sans"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Notification Center</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <BellOff className="w-6 h-6 mb-2" />
                  <span>No alerts or messages.</span>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-4 flex items-start gap-3 transition-colors duration-150 cursor-pointer ${
                      notif.isRead ? 'hover:bg-slate-850/50' : 'bg-indigo-600/5 hover:bg-indigo-600/10'
                    }`}
                  >
                    <div className="mt-0.5 p-1 bg-slate-950 rounded border border-slate-800">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold leading-none ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-none" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{notif.message}</p>
                      <p className="text-[9px] text-slate-600 font-mono">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
