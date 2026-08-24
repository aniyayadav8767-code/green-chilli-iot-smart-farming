import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Moon, Sun, Bell, Sliders, User, Globe, Check } from 'lucide-react';

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useApp();
  const [saved, setSaved] = useState(false);

  const [thresholds, setThresholds] = useState({
    tempMax: 35,
    tempMin: 18,
    moistureMin: 35,
    humidityMax: 85,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings & Thresholds</h1>
        <p className="text-xs text-slate-500">Configure IoT sensor trigger limits, user profile, and application preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Sensor Threshold Alarms */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Sensor Alarm Trigger Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Max Temperature Trigger (°C)</label>
              <input
                type="number"
                value={thresholds.tempMax}
                onChange={(e) => setThresholds({ ...thresholds, tempMax: +e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Min Soil Moisture Trigger (%)</label>
              <input
                type="number"
                value={thresholds.moistureMin}
                onChange={(e) => setThresholds({ ...thresholds, moistureMin: +e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Theme & Language */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            Appearance & Locale
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Dashboard Visual Theme</label>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between font-bold"
              >
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode (Default)'}</span>
                {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-600" />}
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">System Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-bold"
              >
                <option value="English">English (US)</option>
                <option value="Spanish">Español</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-4 h-4" />
              Settings Saved Successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-md hover:bg-emerald-600 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
