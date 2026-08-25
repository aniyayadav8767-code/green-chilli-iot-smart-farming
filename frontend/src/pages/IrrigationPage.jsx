import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Power, Clock, CheckCircle2, ShieldAlert, Sliders, Activity } from 'lucide-react';

export default function IrrigationPage() {
  const { irrigation, togglePumpStatus, toggleIrrigationMode } = useApp();
  const isPumpOn = irrigation.pumpStatus === 'ON';
  const isAutoMode = irrigation.mode === 'Automatic';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Irrigation Control</h1>
          <p className="text-xs text-slate-500">Automated 5V Relay pump actuation, water tank telemetry, and scheduling.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200 text-xs font-bold">
          <button
            onClick={() => toggleIrrigationMode('Automatic')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isAutoMode ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auto AI Mode
          </button>
          <button
            onClick={() => toggleIrrigationMode('Manual')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              !isAutoMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Override
          </button>
        </div>
      </div>

      {/* Main Grid: Left Water Tank Visual | Right Pump Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Water Tank Graphic & Level */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reservoir Water Tank Level</h3>

          {/* Animated Water Tank Graphic */}
          <div className="w-36 h-52 rounded-3xl border-4 border-slate-300 bg-slate-100 relative overflow-hidden flex flex-col justify-end shadow-inner">
            <div
              className="bg-gradient-to-t from-blue-600 to-cyan-400 w-full transition-all duration-1000 relative"
              style={{ height: `${irrigation.tankLevel}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 animate-pulse" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-3xl text-slate-800 drop-shadow-md">
              {irrigation.tankLevel}%
            </div>
          </div>

          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-800">Capacity: 5,000 Liters</span>
            <p className="text-[11px] text-slate-400">Ultrasonic Distance Sensor Probe Active</p>
          </div>
        </div>

        {/* Right: Pump Switch & Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pump Actuator (Relay 1)</h3>
                <p className="text-xs text-slate-500">Mode: {irrigation.mode} • Relay Pin: GPIO14</p>
              </div>

              <button
                onClick={togglePumpStatus}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                  isPumpOn
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-rose-500/20'
                }`}
              >
                <Power className="w-8 h-8" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today Water Used</span>
                <span className="font-extrabold text-slate-900 text-base">{irrigation.waterUsageToday} L</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Runtime</span>
                <span className="font-extrabold text-slate-900 text-base">{irrigation.pumpRuntimeToday} m</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Flow Rate</span>
                <span className="font-extrabold text-emerald-600 text-base">{irrigation.flowRate}</span>
              </div>
            </div>
          </div>

          {/* Irrigation Schedule Timeline */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Automated Irrigation Schedule Log</h3>
            <div className="space-y-2">
              {irrigation.schedules.map((sch) => (
                <div key={sch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{sch.time} ({sch.duration})</span>
                    <p className="text-[11px] text-slate-500">{sch.zone} • Trigger: {sch.trigger}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sch.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {sch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
