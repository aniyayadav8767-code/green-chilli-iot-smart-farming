import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Power, Clock, CheckCircle2 } from 'lucide-react';

export default function PumpControlCard() {
  const { irrigation, handleTogglePump, isLoading } = useApp();
  const pumpState = irrigation?.find((z) => z.zone === 'zone1') || { status: 'off' };
  const isPumpOn = pumpState.status === 'on';

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
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
      </div>

      {isLoading ? (
        <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center animate-pulse">Requesting Node Status...</div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <button
                onClick={() => handleTogglePump('zone1', pumpState.status)}
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
      )}

      {/* Status Footer */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-100/60 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Status Target</span>
            <span className="font-semibold text-slate-700 truncate">{pumpState.zone}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/60 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">Today Runtime</span>
            <span className="font-semibold text-slate-700">0 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
