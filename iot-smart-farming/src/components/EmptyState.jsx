import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';

export default function EmptyState({
  title = 'No Telemetry Data Found',
  description = 'There are no active records matching your filter parameters.',
  icon: Icon = Inbox,
  actionText = 'Reset Filters',
  onAction,
}) {
  return (
    <div className="glass-card rounded-2xl p-10 border border-slate-200/80 text-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
