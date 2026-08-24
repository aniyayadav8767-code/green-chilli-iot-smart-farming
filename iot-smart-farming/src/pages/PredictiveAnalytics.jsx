import React from 'react';
import { predictiveAnalyticsData } from '../services/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { LineChart, Sparkles, BrainCircuit, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PredictiveAnalytics() {
  const p = predictiveAnalyticsData;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Predictive Analytics</h1>
        <p className="text-xs text-slate-500">Machine Learning projection models for crop health, disease risk, and soil moisture depletion.</p>
      </div>

      {/* Top 3 Analytics Dials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Crop Health Score</span>
          <div className="w-28 h-28 rounded-full border-4 border-emerald-500 mx-auto flex items-center justify-center bg-emerald-50 text-emerald-800 font-extrabold text-3xl">
            {p.healthIndex}
          </div>
          <span className="text-xs font-bold text-emerald-600">Excellent Condition</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Disease Risk Rating</span>
          <div className="w-28 h-28 rounded-full border-4 border-amber-400 mx-auto flex items-center justify-center bg-amber-50 text-amber-800 font-extrabold text-3xl">
            {p.diseaseRiskScore}%
          </div>
          <span className="text-xs font-bold text-amber-600">Low Pathogen Risk</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Water Requirement</span>
          <div className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto flex items-center justify-center bg-blue-50 text-blue-800 font-extrabold text-xl">
            {p.waterRequirement}
          </div>
          <span className="text-xs font-bold text-blue-600">Scheduled for 18:00</span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-50/60 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">AI Predictive Insight</h3>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">{p.aiRecommendation}</p>
        </div>
      </div>

      {/* Projected Soil Moisture Depletion Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Predicted Soil Moisture Depletion Curve (Next 12 Hours)</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            ML Forecast Model
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={p.soilDepletionForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[20, 70]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Predicted Moisture']} />
              <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} fill="url(#predGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
