import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function StatCard({ title, value, unit, trend, trendUp, status, badgeColor, icon: Icon, color = 'emerald' }) {
  const isPositive = trendUp;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 border border-slate-200/80 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-100 shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Main Metric Value Row */}
      <div className="mt-3 mb-2 flex items-baseline justify-between">
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-400 ml-1">{unit}</span>}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div
            className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Bottom Status Badge */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Activity className="w-3 h-3 text-slate-400" />
          Live Status
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
          {status}
        </span>
      </div>
    </motion.div>
  );
}
