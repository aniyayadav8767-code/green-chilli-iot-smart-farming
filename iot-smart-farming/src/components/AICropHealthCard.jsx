import React from 'react';
import { motion } from 'framer-motion';
import EmptyState from './EmptyState';
import { useApp } from '../context/AppContext';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  ShieldAlert,
  Pill,
  Sparkles,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

export default function AICropHealthCard() {
  const { aiCropHealth } = useApp();
  
  if (!aiCropHealth) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
        <EmptyState title="Waiting for ESP32-CAM" description="No crop image has been captured or processed by the ML model yet." />
      </div>
    );
  }

  const { camera, aiResult } = aiCropHealth;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl p-6 border border-emerald-500/30 emerald-glow-sm relative overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">🌿 AI Crop Health Analysis</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                Automated ESP32-CAM Feed
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous edge vision inference via MobileNetV2 Deep Learning</p>
          </div>
        </div>

        {/* Camera Live Status Badge */}
        <div className="flex items-center gap-2 bg-slate-100/90 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">Camera: {camera.status}</span>
          <span className="text-[10px] text-slate-400">({camera.rssi})</span>
        </div>
      </div>

      {/* Split Grid: Left (ESP32 Camera Image) | Right (AI Disease Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* LEFT SIDE: Latest ESP32-CAM Image */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 group shadow-md">
            <img
              src={camera.imageUrl}
              alt="ESP32-CAM Crop Capture"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />

            {/* AI Scanning Visual Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

            {/* Bounding Box Visual Simulation */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-emerald-400/90 rounded-lg pointer-events-none flex items-start p-1.5">
              <span className="bg-emerald-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shadow-xs">
                Foliage Inspection Zone (96.8%)
              </span>
            </div>

            {/* Top Left Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono border border-white/10">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>{camera.nodeId}</span>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-mono bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span>{camera.resolution}</span>
              <span className="text-emerald-400 font-bold">{camera.fps}</span>
            </div>
          </div>

          {/* Camera Telemetry Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Capture Time</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {camera.lastCaptureTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Image ID</span>
              <span className="font-bold text-slate-800 font-mono mt-0.5 block truncate">{camera.imageId}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AI Disease Analysis */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Main Disease Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Detected Diagnosis
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">{aiResult.diseaseName}</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${aiResult.severityBadge}`}>
                {aiResult.severity}
              </span>
            </div>

            {/* Confidence Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-300">AI Confidence Rating</span>
                <span className="text-emerald-400 font-bold">{aiResult.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${aiResult.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Diagnostic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-600" />
                Affected Part
              </span>
              <p className="font-semibold text-slate-800 mt-1">{aiResult.affectedPart}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-600" />
                Overall Plant Health
              </span>
              <p className="font-bold text-emerald-700 text-sm mt-1">{aiResult.overallPlantHealth}</p>
            </div>
          </div>

          {/* Recommended Treatment & Medicine Cards */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Recommended Agronomic Treatment</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{aiResult.recommendedTreatment}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-950">
              <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Prescribed Fungicide Medicine</span>
              </div>
              <p className="text-slate-700 font-semibold text-[11px]">{aiResult.recommendedMedicine}</p>
            </div>
          </div>

          {/* Inference Model Footnote */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3 h-3 text-slate-400" />
              {aiResult.modelUsed}
            </span>
            <span>Analyzed at {aiResult.analysisTime}</span>
          </div>
        </div>
      </div>

      {/* AI Processing Status Badges (Processing / Completed / Failed) */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">AI Pipeline Status:</span>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                aiResult.processingStatus === 'Completed'
                  ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                  : 'text-slate-400 opacity-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Completed
            </span>

            <span
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                aiResult.processingStatus === 'Processing'
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                  : 'text-slate-400 opacity-40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              Processing
            </span>

            <span
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                aiResult.processingStatus === 'Failed'
                  ? 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
                  : 'text-slate-400 opacity-40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Failed
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          ✨ Images are captured & processed automatically by ESP32-CAM hardware node.
        </p>
      </div>
    </motion.div>
  );
}
