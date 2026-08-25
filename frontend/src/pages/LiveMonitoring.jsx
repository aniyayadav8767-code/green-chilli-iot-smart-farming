import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDevicesStatus } from '../services/api';
import { Activity, Wifi, Radio, Cpu, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function LiveMonitoring() {
  const { sensorSummary, triggerCamAutoRefresh } = useApp();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const data = await getDevicesStatus();
      setDevices(data);
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(() => {
      fetchDevices();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    triggerCamAutoRefresh(); // Simulate the auto refresh trigger locally
    await fetchDevices(true);
  };

  // Helper to determine device status styles
  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('online') || s.includes('active') || s.includes('healthy')) {
      return 'text-emerald-600 bg-emerald-50 border-emerald-200/65';
    }
    if (s.includes('offline') || s.includes('inactive') || s.includes('error')) {
      return 'text-rose-600 bg-rose-50 border-rose-200/65';
    }
    return 'text-amber-600 bg-amber-50 border-amber-200/65';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Sensor Telemetry</h1>
          <p className="text-xs text-slate-500">Real-time HTTP polling and gateway statuses from ESP8266 and ESP32-CAM nodes.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Force Telemetry Sync'}</span>
        </button>
      </div>

      {/* Live Telemetry Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Temperature Node</span>
          <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900">
              {sensorSummary.temperature.value !== '--' ? `${sensorSummary.temperature.value}°C` : '--'}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
            {sensorSummary.temperature.status || 'Optimal'} (Range: 18 - 38°C)
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Air Humidity</span>
          <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 border-t-blue-500 mx-auto flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900">
              {sensorSummary.humidity.value !== '--' ? `${sensorSummary.humidity.value}%` : '--'}
            </span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full inline-block">
            {sensorSummary.humidity.status || 'Good'} (Range: 40 - 85%)
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Soil Moisture</span>
          <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900">
              {sensorSummary.soilMoisture.value !== '--' ? `${sensorSummary.soilMoisture.value}%` : '--'}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
            {sensorSummary.soilMoisture.status || 'Optimal'} (Threshold: 35%)
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ambient Sunlight</span>
          <div className="w-24 h-24 rounded-full border-4 border-amber-500/30 border-t-amber-500 mx-auto flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900">
              {sensorSummary.lightIntensity.value !== '--' ? sensorSummary.lightIntensity.value : '--'}
            </span>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full inline-block">
            {sensorSummary.lightIntensity.status || 'High Sun'} (Lux)
          </span>
        </div>
      </div>

      {/* Hardware Node Status Matrix */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-600" />
          Field Node Network Connection Matrix
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-1">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-extrabold">No active devices registered</p>
            <p>Ready for ESP8266 or ESP32-CAM nodes to register via API.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div key={dev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{dev.name || dev.id}</h4>
                    <p className="text-[11px] text-slate-400">
                      {dev.type} • IP: {dev.ip_address || 'GPIO/Local'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className={`font-bold border px-2 py-0.5 rounded text-[10px] block ${getStatusBadge(dev.status)}`}>
                    {dev.status}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Signal: {dev.signal_strength ? `${dev.signal_strength}%` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
