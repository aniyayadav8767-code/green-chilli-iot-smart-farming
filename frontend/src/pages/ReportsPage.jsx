import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Calendar, Sprout } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format) => {
    alert(`Downloading ${reportType.toUpperCase()} Smart Farming Executive Report in ${format} format...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Reports & Summaries</h1>
          <p className="text-xs text-slate-500">Automated agronomic summary generation for academic evaluation and farm logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('PDF')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
          <button
            onClick={() => handleDownload('CSV')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>CSV Data</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200 w-fit text-xs font-bold">
        {['daily', 'weekly', 'monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              reportType === type ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {type} Report
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-200/90 shadow-2xl space-y-6 max-w-4xl mx-auto bg-white">
        {/* Document Letterhead */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">AgriSmart IoT Executive Report</h2>
              <p className="text-xs text-slate-500">Department of Computer Science & Engineering • B.Tech Capstone</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-emerald-700 block uppercase font-mono">{reportType} Audit</span>
            <span className="text-slate-400">Date: 28 Jul 2026</span>
          </div>
        </div>

        {/* Summary Executive Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Avg Temperature</span>
            <span className="text-lg font-extrabold text-slate-900">26.8 °C</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Avg Humidity</span>
            <span className="text-lg font-extrabold text-slate-900">68.4 %</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">Total Water Pumped</span>
            <span className="text-lg font-extrabold text-emerald-700">420 Liters</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">AI Crop Health Index</span>
            <span className="text-lg font-extrabold text-emerald-700">94.2 %</span>
          </div>
        </div>

        {/* Report Narrative Section */}
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-1">1. Agronomic Assessment</h3>
          <p>
            During the {reportType} evaluation window, environmental parameters remained strictly within optimal thresholds for Solanaceous tomato cultivation. DHT11 temperature telemetry recorded a peak high of 30.2°C at 12:45 PM and a night minimum of 20.5°C.
          </p>

          <h3 className="text-sm font-bold text-slate-900 border-b pb-1 pt-2">2. ESP32-CAM AI Vision Diagnostics</h3>
          <p>
            Autonomous image captures processed by the MobileNetV2 Deep Neural Net identified 1 instance of Early Blight (Alternaria solani) at early stage 1. Automated treatment guidelines were recommended (Mancozeb 75% WP spray application).
          </p>
        </div>

        {/* Verification Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Report Generated Automatically by AgriSmart Platform</span>
          <span className="font-mono text-emerald-700 font-bold">Digest: SHA256-OK</span>
        </div>
      </div>
    </div>
  );
}
