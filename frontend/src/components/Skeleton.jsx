import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="w-8 h-8 rounded-xl bg-slate-200" />
      </div>
      <div className="h-8 w-28 bg-slate-200 rounded mt-2" />
      <div className="pt-2 border-t border-slate-100 flex justify-between">
        <div className="h-2.5 w-16 bg-slate-200 rounded" />
        <div className="h-3 w-12 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-3 w-16 bg-slate-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-3 w-16 bg-slate-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-3 w-16 bg-slate-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-3 w-16 bg-slate-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-3 w-12 bg-slate-200 rounded" /></td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4 animate-pulse">
      <div className="h-4 w-40 bg-slate-200 rounded" />
      <div className="h-40 w-full bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
