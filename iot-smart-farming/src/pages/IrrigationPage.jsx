import React from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { Power } from 'lucide-react';

export default function IrrigationPage() {
  const { irrigation, handleTogglePump, isLoading, refreshBackend } = useApp();

  const pumpState = irrigation?.find((z) => z.zone === 'zone1');
  const isPumpOn = pumpState?.status === 'on';

  if (!pumpState && !isLoading) {
      return <EmptyState title="Relays Not Found" description="The FastAPI backend did not return any valid irrigation zones." onAction={refreshBackend} actionText="Query Hardware" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Irrigation Control</h1>
          <p className="text-xs text-slate-500">Automated 5V Relay pump actuation, water tank telemetry, and scheduling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Water Tank Graphic & Level */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reservoir Water Tank Level</h3>

          {/* Animated Water Tank Graphic */}
          <div className="w-36 h-52 rounded-3xl border-4 border-slate-300 bg-slate-100 relative overflow-hidden flex flex-col justify-end shadow-inner">
            <div className="bg-gradient-to-t from-blue-600 to-cyan-400 w-full transition-all duration-1000 relative" style={{ height: `0%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-3xl text-slate-800 drop-shadow-md">
              Empty
            </div>
          </div>
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-800">Hardware Disconnected</span>
            <p className="text-[11px] text-slate-400">Wait for Ultrasonic Sensor</p>
          </div>
        </div>

        {/* Right: Pump Switch & Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pump Actuator (Relay 1)</h3>
                <p className="text-xs text-slate-500">Relay Pin: GPIO14</p>
              </div>

              <button
                onClick={() => handleTogglePump('zone1', pumpState.status)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                  isPumpOn
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-rose-500/20'
                }`}
              >
                <Power className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
