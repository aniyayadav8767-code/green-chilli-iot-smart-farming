import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { Radio, Cpu, RefreshCw, Download, Calendar, Search } from 'lucide-react';

export default function LiveMonitoring() {
  const { sensorSummary, devices, timeSeries, refreshBackend, isLoading } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const handleExportCSV = () => {
    alert('Export telemetry not implemented yet');
  };

  const hasSensors = sensorSummary?.temperature?.value !== undefined;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sensors & Monitoring</h1>
          <p className="text-xs text-slate-500">Real-time telemetry and historical logs from field nodes.</p>
        </div>

        <button
          onClick={refreshBackend}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {!hasSensors ? (
        <EmptyState title="Waiting for Node Telemetry" description="ESP8266 has not pushed data to the backend yet." actionText="Force Sync" onAction={refreshBackend} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Temperature Node</span>
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto flex items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">{sensorSummary.temperature.value}°C</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
              Optimal
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Air Humidity</span>
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 border-t-blue-500 mx-auto flex items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">{sensorSummary.humidity.value}%</span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full inline-block">
              Good
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Soil Moisture</span>
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto flex items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">{sensorSummary.soilMoisture.value}%</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
              Optimal
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ambient Sunlight</span>
            <div className="w-24 h-24 rounded-full border-4 border-amber-500/30 border-t-amber-500 mx-auto flex items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">{sensorSummary.lightIntensity.value}</span>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full inline-block">
              High Sun
            </span>
          </div>
        </div>
      )}

      {/* Hardware Node Status Matrix */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-600" />
          Field Node Network Connection Matrix
        </h3>

        {(!devices || devices.length === 0) ? (
          <div className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl">No devices connected to the network.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div key={dev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{dev.name}</h4>
                    <p className="text-[11px] text-slate-400">Node ID: {dev.id}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px] block">
                    Online
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Last sync: {new Date(dev.last_telemetry_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sensor History Section integrated */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Historical Logs</h2>
            <p className="text-xs text-slate-500">Track and filter past telemetry parameters.</p>
          </div>
        </div>

        {(!timeSeries || timeSeries.length === 0) ? (
            <EmptyState title="No Historical Data" description="No previous sensor logs found in database." icon={Search} />
        ) : (
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                    <th className="px-6 py-3.5">Time Log</th>
                    <th className="px-6 py-3.5">Temperature (°C)</th>
                    <th className="px-6 py-3.5">Humidity (%)</th>
                    <th className="px-6 py-3.5">Soil Moisture (%)</th>
                    <th className="px-6 py-3.5">Light (Lux)</th>
                    <th className="px-6 py-3.5">System Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                    {timeSeries.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-bold font-mono text-slate-900">{new Date(row.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-3.5 font-semibold text-emerald-700">{row.temperature} °C</td>
                        <td className="px-6 py-3.5 font-semibold text-blue-700">{row.humidity} %</td>
                        <td className="px-6 py-3.5 font-semibold text-emerald-700">{row.soil_moisture} %</td>
                        <td className="px-6 py-3.5 font-semibold text-amber-700">{row.light_intensity || 0} Lux</td>
                        <td className="px-6 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Logged
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        )}
      </div>
    </div>
  );
}
