import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Power, Cpu, Clock, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export default function PumpControlCard() {
  const { irrigation, togglePumpStatus, toggleIrrigationMode } = useApp();
  const isPumpOn = irrigation.pumpStatus === 'ON';
  const isAutoMode = irrigation.mode === 'Automatic';

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-xl ${isPumpOn ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-500'}`}>
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Smart Irrigation Control</h3>
            <p className="text-[11px] text-slate-400">4-Channel 5V Relay Actuator</p>
          </div>
        </div>

        {/* Mode Toggle Pills (Automatic vs Manual) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => toggleIrrigationMode('Automatic')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              isAutoMode ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auto AI
          </button>
          <button
            onClick={() => toggleIrrigationMode('Manual')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              !isAutoMode ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Main Pump Toggle Action Button */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePumpStatus}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isPumpOn
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
            }`}
          >
            <Power className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                Pump {isPumpOn ? 'RUNNING' : 'STOPPED'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPumpOn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {irrigation.mode}
              </span>
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">
              Flow Rate: {isPumpOn ? '18.5 L/min' : '0.0 L/min'}
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 hidden sm:block">
          Relay: GPIO14
        </span>
      </div>

      {/* Status Footer */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-100/60 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Last Active</span>
            <span className="font-semibold text-slate-700 truncate">{irrigation.lastActivated}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/60 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Today Runtime</span>
            <span className="font-semibold text-slate-700">{irrigation.pumpRuntimeToday} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
