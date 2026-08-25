import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAIHistory } from '../services/api';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Scan,
  Sparkles,
  Camera,
  ShieldCheck,
  Pill,
  Search,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';

// ─── 8-Class Treatments Map (matching backend and health card) ────
const TREATMENTS = {
  'Chilli__Whitefly': {
    label: 'Chilli Whitefly Infestation',
    treatment: 'Install yellow sticky traps (15/acre). Use neem oil spray. Remove heavily infested leaves.',
    medicine: 'Spray Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.',
    severity: 'High Warning',
    color: '#f43f5e', // rose-500
  },
  'Chilli__Yellowish': {
    label: 'Chilli Yellowing / Chlorosis',
    treatment: 'Check for nutrient deficiency (Iron, Nitrogen). Improve soil drainage. Test soil pH.',
    medicine: 'Apply Ferrous Sulphate foliar spray @ 0.5% + Urea @ 1% solution.',
    severity: 'Moderate Risk',
    color: '#f59e0b', // amber-500
  },
  'Chilli__Anthracnose': {
    label: 'Chilli Anthracnose / Fruit Rot',
    treatment: 'Destroy infected pods immediately. Ensure proper soil drainage and ventilation.',
    medicine: 'Spray Azoxystrobin 23% SC @ 1 ml/L or Copper Oxychloride 50% WP @ 2.5g/L.',
    severity: 'Critical Threat',
    color: '#e11d48', // rose-600
  },
  'Chilli__Damping_Off': {
    label: 'Chilli Damping Off',
    treatment: 'Avoid overwatering seedlings. Improve air circulation. Use sterilized soil for nurseries.',
    medicine: 'Drench with Metalaxyl 35% WS @ 1g/L or Copper Oxychloride 50% WP @ 3g/L.',
    severity: 'High Warning',
    color: '#fda4af', // rose-300
  },
  'Chilli__Leaf_Curl_Virus': {
    label: 'Chilli Leaf Curl Virus (ChLCV)',
    treatment: 'Control vector whiteflies immediately using yellow sticky traps (15 traps/acre).',
    medicine: 'Spray Imidacloprid 17.8% SL @ 0.5 ml/L or Diafenthiuron 50% WP @ 1g/L.',
    severity: 'High Warning',
    color: '#fb7185', // rose-400
  },
  'Chilli__Leaf_Spot': {
    label: 'Chilli Leaf Spot (Cercospora)',
    treatment: 'Remove and destroy infected leaves. Avoid overhead irrigation. Ensure proper spacing.',
    medicine: 'Spray Mancozeb 75% WP @ 2.5g/L or Carbendazim 50% WP @ 1g/L.',
    severity: 'Moderate Risk',
    color: '#fbbf24', // amber-400
  },
  'Chilli__Veinal_Mottle_Virus': {
    label: 'Chilli Veinal Mottle Virus (ChiVMV)',
    treatment: 'Remove infected plants immediately. Control aphid vectors with sticky traps.',
    medicine: 'Spray Acetamiprid 20% SP @ 0.2g/L to control aphid vector population.',
    severity: 'Critical Threat',
    color: '#be123c', // rose-700
  },
  'Chilli___healthy': {
    label: 'Healthy Chilli Plant',
    treatment: 'Continue balanced irrigation and periodic bio-fertilizer application.',
    medicine: 'No chemical pesticide required. Maintain preventive neem oil sprays.',
    severity: 'Optimal',
    color: '#10b981', // emerald-500
  },
};

const DEFAULT_DISTRIBUTION = [
  { name: 'Healthy Chilli', value: 65, color: '#10b981' },
  { name: 'Leaf Curl Virus', value: 15, color: '#fb7185' },
  { name: 'Whitefly Infestation', value: 12, color: '#f43f5e' },
  { name: 'Anthracnose Rot', value: 8, color: '#e11d48' },
];

export default function AIDiseaseAnalysis() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchHistory = async () => {
    try {
      const data = await getAIHistory(20);
      setHistory(data);
      if (data.length > 0 && !selectedScan) {
        setSelectedScan(data[0]);
      }
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadReport = () => {
    alert('Exporting AI Crop Health Laboratory Report (PDF format)...');
  };

  // Compute distribution based on actual loaded history
  const getDistributionData = () => {
    if (history.length === 0) return DEFAULT_DISTRIBUTION;

    const counts = {};
    history.forEach((scan) => {
      const name = TREATMENTS[scan.disease_name]?.label || scan.disease_name;
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, val]) => {
      // Find matching color
      const key = Object.keys(TREATMENTS).find((k) => TREATMENTS[k].label === name);
      const color = TREATMENTS[key]?.color || '#64748b'; // slate-500
      return { name, value: val, color };
    });
  };

  // Get info for selected scan or keep placeholder
  const getSelectedInfo = () => {
    if (!selectedScan) {
      return {
        diseaseName: 'No Diagnosis Selected',
        confidenceScore: '--',
        severity: 'Optimal',
        recommendedTreatment: 'Run a diagnosis or select a historical scan to inspect.',
        recommendedMedicine: 'None prescribed.',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        timestamp: 'N/A',
      };
    }

    const t = TREATMENTS[selectedScan.disease_name] || {
      label: selectedScan.disease_name,
      treatment: 'Consult an expert.',
      medicine: 'Identify first.',
      severity: 'Unknown',
    };

    return {
      diseaseName: t.label,
      confidenceScore: (selectedScan.confidence * 100).toFixed(1),
      severity: t.severity,
      recommendedTreatment: t.treatment,
      recommendedMedicine: t.medicine,
      image: selectedScan.image_path && selectedScan.image_path.startsWith('data:')
        ? selectedScan.image_path
        : 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
      timestamp: new Date(selectedScan.timestamp).toLocaleString(),
    };
  };

  const selectedInfo = getSelectedInfo();
  const distributionData = getDistributionData();

  // Filter history list based on search term
  const filteredHistory = history.filter((scan) => {
    const label = TREATMENTS[scan.disease_name]?.label || scan.disease_name;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Crop Disease Analysis</h1>
          <p className="text-xs text-slate-500">Autonomous ESP32-CAM foliage captures processed via PyTorch EfficientNet-B0.</p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export AI Diagnosis Report</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-slate-200/80 rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#38A968]" />
          <p className="text-xs text-slate-500 font-extrabold">Loading clinical analysis records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Selected Image View */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-800">ESP32-CAM Automated Feed Inspection</h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Resolution: UXGA
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 shadow-md bg-slate-950">
                <img
                  src={selectedInfo.image}
                  alt="Selected Scan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-emerald-400 font-mono text-xs border border-white/10">
                  {selectedInfo.diseaseName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Scan Timestamp</span>
                  <span className="font-bold text-slate-800">{selectedInfo.timestamp}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">AI Model Score</span>
                  <span className="font-bold text-emerald-600">
                    {selectedInfo.confidenceScore !== '--' ? `${selectedInfo.confidenceScore}%` : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Diagnosis & Disease Frequency Pie Chart */}
          <div className="lg:col-span-6 space-y-6">
            {/* Detailed Agronomic Treatment Card */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#38A968] text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedInfo.diseaseName}</h3>
                  <p className="text-xs text-slate-500">
                    Confidence: {selectedInfo.confidenceScore}% • Severity: {selectedInfo.severity}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block">Recommended Agronomic Action Plan:</span>
                <p className="text-slate-700 leading-relaxed">{selectedInfo.recommendedTreatment}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Prescribed Chemical/Biological Remedy:
                </span>
                <p className="text-slate-700 font-semibold">{selectedInfo.recommendedMedicine}</p>
              </div>
            </div>

            {/* Disease Distribution Pie Chart */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Crop Health Distribution</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} scan(s)`, 'Count']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Image Captures Gallery */}
      {!loading && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800">ESP32-CAM Scan History Gallery</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter disease name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:bg-white text-black"
              />
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-[#94a3b8] text-xs border border-dashed border-slate-200 rounded-xl space-y-1">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-extrabold">No scans found</p>
              <p>Try running AI Diagnosis or adjusting your search term filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredHistory.map((scan) => {
                const info = TREATMENTS[scan.disease_name] || {
                  label: scan.disease_name,
                };
                const displayImg = scan.image_path && scan.image_path.startsWith('data:')
                  ? scan.image_path
                  : 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedScan?.id === scan.id
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200/80 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <img
                      src={displayImg}
                      alt={info.label}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                    <h4 className="text-xs font-bold text-slate-800 truncate">{info.label}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="font-bold text-emerald-600">{(scan.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
