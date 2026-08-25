import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Cpu, FileText, LogOut, ChevronDown } from 'lucide-react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          AY
        </div>
        <div className="hidden xl:block text-left">
          <span className="text-xs font-bold text-slate-800 block -mb-0.5">Aniya Yadav</span>
          {/* <span className="text-[10px] text-slate-400 font-medium">Lead Agronomist</span> */}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 shadow-xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 space-y-1">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-extrabold text-slate-900">Aniya Yadav</p>
            <p className="text-[10px] text-slate-400 truncate">aniya@gmail.com</p>
          </div>

          <button
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>View Agronomist Profile</span>
          </button>

          <button
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>System Threshold Settings</span>
          </button>

          <button
            onClick={() => handleNavigate('/monitoring')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>Hardware Node Matrix</span>
          </button>

          <button
            onClick={() => handleNavigate('/reports')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Academic Capstone Reports</span>
          </button>

          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={() => handleNavigate('/login')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
