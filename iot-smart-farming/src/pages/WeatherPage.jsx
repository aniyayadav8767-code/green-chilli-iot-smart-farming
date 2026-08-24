import React from 'react';
import { weatherTelemetry } from '../services/mockData';
import { CloudSun, Wind, Droplets, Gauge, CloudRain, Sun, Compass } from 'lucide-react';

export default function WeatherPage() {
  const w = weatherTelemetry;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Microclimate Weather Insights</h1>
        <p className="text-xs text-slate-500">Local farm weather station telemetry and 7-day precipitation forecasts.</p>
      </div>

      {/* Weather Main Hero Card */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">{w.location}</span>
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-extrabold tracking-tight">{w.temp}°C</span>
            <span className="text-lg font-medium text-emerald-200">{w.condition}</span>
          </div>
          <p className="text-xs text-slate-300">High: {w.high}°C • Low: {w.low}°C • Dew Point: {w.dewPoint}</p>
        </div>

        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">Wind Speed</span>
            <span className="font-bold text-white text-sm">{w.windSpeed} km/h {w.windDirection}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">Humidity</span>
            <span className="font-bold text-white text-sm">{w.humidity}%</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">Air Pressure</span>
            <span className="font-bold text-white text-sm">{w.pressure} hPa</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">Rain Probability</span>
            <span className="font-bold text-emerald-400 text-sm">{w.rainProbability}%</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">UV Index</span>
            <span className="font-bold text-amber-300 text-sm">{w.uvIndex}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
            <span className="text-[10px] text-slate-300 block">Visibility</span>
            <span className="font-bold text-white text-sm">{w.visibility}</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Hourly Temperature & Rain Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {w.hourlyForecast.map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs font-bold text-slate-700 block">{item.time}</span>
              <CloudSun className="w-6 h-6 text-amber-500 mx-auto my-1" />
              <span className="text-sm font-extrabold text-slate-900 block">{item.temp}°C</span>
              <span className="text-[10px] text-blue-600 font-semibold block">{item.pop}% Rain</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">7-Day Agricultural Forecast</h3>
        <div className="space-y-2.5">
          {w.weeklyForecast.map((day, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 w-16">{day.day}</span>
              <span className="text-slate-600 flex-1">{day.condition}</span>
              <span className="text-blue-600 font-semibold w-20 text-right">Rain: {day.rain}</span>
              <span className="font-extrabold text-slate-900 w-24 text-right">H: {day.high}° / L: {day.low}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
