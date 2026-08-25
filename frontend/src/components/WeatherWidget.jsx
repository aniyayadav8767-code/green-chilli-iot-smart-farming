import React from 'react';
import { CloudSun, Wind, Droplets, Gauge, CloudRain, Sun, Compass } from 'lucide-react';
import { weatherTelemetry } from '../services/mockData';

export default function WeatherWidget() {
  const w = weatherTelemetry;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">Farm Microclimate Station</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
          Field A Station
        </span>
      </div>

      {/* Main Temperature Hero */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-500 text-white p-4 rounded-xl shadow-md">
        <div>
          <span className="text-3xl font-extrabold tracking-tight">{w.temp}°C</span>
          <p className="text-xs font-medium text-emerald-100 mt-0.5">{w.condition}</p>
        </div>
        <div className="text-right text-xs text-emerald-100">
          <p>H: {w.high}°C  L: {w.low}°C</p>
          <p className="text-[11px] opacity-90 mt-1">UV Index: {w.uvIndex}</p>
        </div>
      </div>

      {/* 4 Microclimate Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
          <Wind className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-[10px] text-slate-400 block">Wind</span>
          <span className="font-bold text-slate-800">{w.windSpeed} km/h</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
          <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <span className="text-[10px] text-slate-400 block">Humidity</span>
          <span className="font-bold text-slate-800">{w.humidity}%</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
          <Gauge className="w-4 h-4 text-purple-500 mx-auto mb-1" />
          <span className="text-[10px] text-slate-400 block">Pressure</span>
          <span className="font-bold text-slate-800">{w.pressure} hPa</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
          <CloudRain className="w-4 h-4 text-sky-500 mx-auto mb-1" />
          <span className="text-[10px] text-slate-400 block">Rain Prob</span>
          <span className="font-bold text-slate-800">{w.rainProbability}%</span>
        </div>
      </div>
    </div>
  );
}
