import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProfileDropdown from './ProfileDropdown';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  const {
    isDarkMode,
    toggleDarkMode,
    currentTime,
    notifications,
    dismissNotification,
    triggerCamAutoRefresh,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    triggerCamAutoRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-navbar px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sensors, AI logs, telemetry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Date/Time, Live Sim Action, Notifications, Theme & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Date & Time pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-mono text-emerald-700 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Live ESP32 Sync Button */}
        <button
          onClick={handleManualRefresh}
          title="Simulate ESP32-CAM Auto-Sync"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync Nodes</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl p-4 shadow-xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">System Notifications</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                    {notifications.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 hover:bg-white transition-colors relative group"
                    >
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                      {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
