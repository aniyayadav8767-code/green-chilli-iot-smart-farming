import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Scan,
  CloudSun,
  LineChart,
  Droplets,
  History,
  FileText,
  Settings,
  User,
  LogOut,
  Sprout,
  Wifi,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Crop Health', path: '/ai-analysis', icon: Scan, badge: 'AI Live' },
  { name: 'Sensors & Monitoring', path: '/monitoring', icon: Activity },
  { name: 'Smart Irrigation', path: '/irrigation', icon: Droplets },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 glass-sidebar transition-transform duration-300 ease-in-out flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sprout className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-800 flex items-center gap-1.5">
              Agri<span className="emerald-gradient-text">Smart IoT</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">Cloud AI Farming</p>
          </div>
        </div>

        {/* Node Connection Pill */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-800">ESP Nodes: Active</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-white/80 px-1.5 py-0.5 rounded shadow-xs">
            2/2 Online
          </span>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/25 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-900 backdrop-blur-xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Bottom Section */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors cursor-pointer mb-1 border border-transparent hover:border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">Dr. A. Devan</p>
              <p className="text-[10px] text-slate-400 truncate">Lead Agronomist</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
