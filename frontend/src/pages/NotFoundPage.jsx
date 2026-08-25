import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200/90 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/30">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested telemetry route or system view does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
