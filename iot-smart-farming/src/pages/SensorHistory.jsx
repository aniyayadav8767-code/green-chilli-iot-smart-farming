import React, { useState } from 'react';
import { hourlySensorTimeSeries } from '../services/mockData';
import { History, Download, Calendar, Search, Filter } from 'lucide-react';

export default function SensorHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('2026-07-28');

  const handleExportCSV = () => {
    alert('Exporting full historical telemetry data to CSV file...');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sensor Telemetry History</h1>
          <p className="text-xs text-slate-500">Searchable historical log table of all environmental sensor readings.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search time or readings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
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
              {hourlySensorTimeSeries.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold font-mono text-slate-900">{dateFilter} {row.time}</td>
                  <td className="px-6 py-3.5 font-semibold text-emerald-700">{row.temp} °C</td>
                  <td className="px-6 py-3.5 font-semibold text-blue-700">{row.humidity} %</td>
                  <td className="px-6 py-3.5 font-semibold text-emerald-700">{row.moisture} %</td>
                  <td className="px-6 py-3.5 font-semibold text-amber-700">{row.light} Lux</td>
                  <td className="px-6 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Synced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
