import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { Camera, ShieldCheck, Pill, Cpu, Zap, CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react';

export default function AIDiseaseAnalysis() {
  const { aiCropHealth, processAIPrediction } = useApp();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processAIPrediction(file);
    }
  };

  if (!aiCropHealth || !aiCropHealth.aiResult) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
            <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Crop Disease Analysis</h1>
            <p className="text-xs text-slate-500">ESP32-CAM foliage captures processed via Deep Learning model.</p>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/jpeg, image/png" />
            <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Leaf Image</span>
            </button>
        </div>

        {aiCropHealth?.processingStatus === 'Processing' ? (
          <div className="glass-card rounded-2xl p-10 text-center animate-pulse">Running Neural Network Inference on FastAPI backend...</div>
        ) : (
          <EmptyState 
            title="Waiting for Edge Node Capture" 
            description="The ESP32-CAM has not captured any foliage anomalies. You may upload a test image manually to run inference against the PyTorch backend model."
            actionText="Upload Test Image"
            onAction={() => fileInputRef.current.click()}
          />
        )}
      </div>
    );
  }

  const { camera, aiResult, processingStatus } = aiCropHealth;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Crop Disease Analysis</h1>
          <p className="text-xs text-slate-500">Autonomous ESP32-CAM foliage captures processed via Deep Learning model.</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/jpeg, image/png" />
        <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 transition-all flex items-center gap-2"
        >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Selected Image View */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-800">ESP32-CAM Feed Inspection</h2>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 shadow-md bg-slate-950">
              <img
                src={camera.imageUrl}
                alt="Scan"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Scan Timestamp</span>
                <span className="font-bold text-slate-800">{camera.lastCaptureTime}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">AI Model Score</span>
                <span className="font-bold text-emerald-600">{aiResult.confidenceScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Diagnosis Area */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{aiResult.diseaseName}</h3>
                <p className="text-xs text-slate-500">Confidence: {aiResult.confidenceScore}% • Severity: {aiResult.severity}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                Inference Model used from FastAPI
              </span>
              <p className="text-slate-700 font-semibold">{aiResult.modelUsed}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">AI Pipeline Status:</span>
            <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${processingStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30' : 'text-slate-400 opacity-50'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
                <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${processingStatus === 'Processing' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30' : 'text-slate-400 opacity-40'}`}>
                <Zap className="w-3.5 h-3.5" /> Processing
                </span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
