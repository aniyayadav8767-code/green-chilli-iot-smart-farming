import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Telemetry Connection Interrupted',
  description = 'Unable to reach ESP8266 hardware gateway. Please check Wi-Fi connection and Flask API server status.',
  onRetry,
}) {
  return (
    <div className="glass-card rounded-2xl p-8 border border-rose-200 bg-rose-50/40 text-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-rose-900">{title}</h3>
        <p className="text-xs text-rose-700 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
