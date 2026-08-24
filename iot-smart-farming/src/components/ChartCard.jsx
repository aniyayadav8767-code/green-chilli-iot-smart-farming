import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import EmptyState from './EmptyState';
import { Thermometer, Droplets, Sun, Activity } from 'lucide-react';

export default function ChartCard() {
  const { timeSeries } = useApp();
  const [activeMetric, setActiveMetric] = useState('temp');
  const [timeRange, setTimeRange] = useState('24h');

  const configs = {
    temp: {
      name: 'Temperature (°C)',
      key: 'temp',
      color: '#22c55e',
      gradientId: 'tempGrad',
      icon: Thermometer,
      unit: '°C',
    },
    humidity: {
      name: 'Humidity (%)',
      key: 'humidity',
      color: '#3b82f6',
      gradientId: 'humGrad',
      icon: Droplets,
      unit: '%',
    },
    moisture: {
      name: 'Soil Moisture (%)',
      key: 'moisture',
      color: '#10b981',
      gradientId: 'moistGrad',
      icon: Activity,
      unit: '%',
    },
    light: {
      name: 'Light Intensity (Lux)',
      key: 'light',
      color: '#f59e0b',
      gradientId: 'lightGrad',
      icon: Sun,
      unit: 'Lux',
    },
  };

  const active = configs[activeMetric];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Metric Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs overflow-x-auto">
          {Object.keys(configs).map((key) => {
            const cfg = configs[key];
            const Icon = cfg.icon;
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                <span>{cfg.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1 text-xs">
          {['1H', '24H', '7D', '30D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range.toLowerCase())}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                timeRange === range.toLowerCase()
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {timeSeries && timeSeries.length > 0 ? (
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={active.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={active.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={active.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                }}
                formatter={(value) => [`${value} ${active.unit}`, active.name]}
              />
              <Area
                type="monotone"
                dataKey={active.key}
                stroke={active.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${active.gradientId})`}
              />
            </AreaChart>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-xs font-semibold">No telemetry available</span>
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
