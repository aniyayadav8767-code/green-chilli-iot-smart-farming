import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { captureAndPredict, predictFromUpload } from '../services/api';
import {
  Sparkles,
  Camera,
  Upload,
  RefreshCw,
  Clock,
  Cpu,
  ShieldAlert,
  Pill,
  MapPin,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  Layers,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

// ─── 8-Class Treatment Map (matches backend EfficientNet-B0 model) ────
const TREATMENTS = {
  'Chilli__Whitefly': {
    label: 'Chilli Whitefly Infestation',
    treatment: 'Install yellow sticky traps (15/acre). Use neem oil spray. Remove heavily infested leaves.',
    medicine: 'Spray Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.',
    severity: 'High Warning',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  },
  'Chilli__Yellowish': {
    label: 'Chilli Yellowing / Chlorosis',
    treatment: 'Check for nutrient deficiency (Iron, Nitrogen). Improve soil drainage. Test soil pH.',
    medicine: 'Apply Ferrous Sulphate foliar spray @ 0.5% + Urea @ 1% solution.',
    severity: 'Moderate Risk',
    badge: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  },
  'Chilli__Anthracnose': {
    label: 'Chilli Anthracnose / Fruit Rot',
    treatment: 'Destroy infected pods immediately. Ensure proper soil drainage and ventilation.',
    medicine: 'Spray Azoxystrobin 23% SC @ 1 ml/L or Copper Oxychloride 50% WP @ 2.5g/L.',
    severity: 'Critical Threat',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  },
  'Chilli__Damping_Off': {
    label: 'Chilli Damping Off',
    treatment: 'Avoid overwatering seedlings. Improve air circulation. Use sterilized soil for nurseries.',
    medicine: 'Drench with Metalaxyl 35% WS @ 1g/L or Copper Oxychloride 50% WP @ 3g/L.',
    severity: 'High Warning',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  },
  'Chilli__Leaf_Curl_Virus': {
    label: 'Chilli Leaf Curl Virus (ChLCV)',
    treatment: 'Control vector whiteflies immediately using yellow sticky traps (15 traps/acre).',
    medicine: 'Spray Imidacloprid 17.8% SL @ 0.5 ml/L or Diafenthiuron 50% WP @ 1g/L.',
    severity: 'High Warning',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  },
  'Chilli__Leaf_Spot': {
    label: 'Chilli Leaf Spot (Cercospora)',
    treatment: 'Remove and destroy infected leaves. Avoid overhead irrigation. Ensure proper spacing.',
    medicine: 'Spray Mancozeb 75% WP @ 2.5g/L or Carbendazim 50% WP @ 1g/L.',
    severity: 'Moderate Risk',
    badge: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  },
  'Chilli__Veinal_Mottle_Virus': {
    label: 'Chilli Veinal Mottle Virus (ChiVMV)',
    treatment: 'Remove infected plants immediately. Control aphid vectors with sticky traps.',
    medicine: 'Spray Acetamiprid 20% SP @ 0.2g/L to control aphid vector population.',
    severity: 'Critical Threat',
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
  },
  'Chilli___healthy': {
    label: 'Healthy Chilli Plant',
    treatment: 'Continue balanced irrigation and periodic bio-fertilizer application.',
    medicine: 'No chemical pesticide required. Maintain preventive neem oil sprays.',
    severity: 'Optimal',
    badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  },
};

export default function AICropHealthCard() {
  const { sensorSummary } = useApp();

  const [espIp, setEspIp] = useState('10.95.60.188');
  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
  );
  const [camStatus, setCamStatus] = useState('Idle');
  const imageRef = useRef(null);

  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [isPredicting, setIsPredicting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ─── Weather Telemetry (external API — no backend needed) ──────
  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      setLoadingWeather(true);
      let locationLabel = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;

      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const city = geoData.locality || geoData.city || geoData.principalSubdivision;
          if (city) locationLabel = `${city}, ${geoData.countryName || ''}`;
        }
      } catch {}

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      if (weatherRes.ok) {
        const data = await weatherRes.json();
        setWeatherData({
          location: locationLabel,
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          pressure: data.current.surface_pressure,
          rainProbability: data.hourly.precipitation_probability[0] ?? 0,
        });
      }
    } catch (err) {
      console.error('Weather error:', err);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(21.1458, 79.0882);
  }, [fetchWeather]);

  // ─── Dev fallback: direct ESP32-CAM frame display ──────
  const triggerCameraCapture = () => {
    const cleanIp = espIp.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const directImageUrl = `http://${cleanIp}/capture?t=${Date.now()}`;
    setSelectedImage(directImageUrl);
    setCamStatus('Requesting ESP32 Frame...');
  };

  const handleImageLoaded = () => {
    setCamStatus('Frame Loaded');
  };

  const handleImageError = () => {
    setCamStatus('ESP32 Unreachable');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setCamStatus('Local Image Uploaded');
    }
  };

  // ─── PRODUCTION: Predict via FastAPI backend ──────
  const handlePredict = async () => {
    setIsPredicting(true);
    setErrorMessage('');

    try {
      let result;

      // Check if the current image is a local upload (blob URL)
      if (selectedImage.startsWith('blob:')) {
        // Manual upload path: send image file to POST /api/ai/predict
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], 'upload.jpg', { type: blob.type });
        result = await predictFromUpload(file);
      } else {
        // Production path: FastAPI fetches from ESP32-CAM → runs inference
        setCamStatus('Backend capturing from ESP32-CAM...');
        result = await captureAndPredict(espIp);

        // Update displayed image with base64 from backend
        if (result.image_base64) {
          setSelectedImage(result.image_base64);
        }
      }

      // Map backend disease name to treatment info
      const info = TREATMENTS[result.disease] || {
        label: result.disease,
        treatment: 'Consult an agronomist for diagnosis.',
        medicine: 'Pending identification.',
        severity: 'Unknown',
        badge: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
      };

      setAiResult({
        diseaseName: info.label,
        rawDisease: result.disease,
        confidenceScore: (result.confidence * 100).toFixed(1),
        severity: info.severity,
        severityBadge: info.badge,
        recommendedTreatment: info.treatment,
        recommendedMedicine: info.medicine,
        modelUsed: 'EfficientNet-B0 (PyTorch Server)',
        analysisTime: new Date().toLocaleTimeString(),
        source: result.source || 'manual_upload',
      });
      setCamStatus('Diagnosis Complete');
    } catch (err) {
      console.error('Prediction error:', err);
      const detail = err?.response?.data?.detail || err.message || 'Prediction failed';
      setErrorMessage(detail);
      setCamStatus('Prediction Failed');
    } finally {
      setIsPredicting(false);
    }
  };

  // ─── Sensor data from context (real API data) ──────
  const sensorData = {
    soilMoisture: sensorSummary?.soilMoisture?.value ?? '--',
    temperature: sensorSummary?.temperature?.value ?? '--',
    humidity: sensorSummary?.humidity?.value ?? '--',
    phLevel: '--', // pH not available from current sensor setup
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 p-2 font-sans">
      <div className="w-full bg-[#38A968] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-md gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-white" />
          <div>
            <h1 className="text-2xl tracking-tight">🌶️ Chilli Crop Health Dashboard</h1>
            <p className="text-xs text-emerald-100">EfficientNet-B0 AI Model via FastAPI Backend</p>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={isPredicting}
          className="w-full sm:w-auto px-6 py-2.5 bg-black text-white hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isPredicting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Zap className="w-4 h-4 text-amber-400" />
          )}
          <span>{isPredicting ? 'Running AI Model...' : 'Predict AI Diagnosis'}</span>
        </button>
      </div>

      <div className="w-full border border-emerald-100 bg-white shadow-md p-6 space-y-6">

        {errorMessage && (
          <div className="p-3.5 text-xs text-rose-900 bg-rose-50 border border-rose-200 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* ESP32 Display Section */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-100 pb-5 lg:pb-0 lg:pr-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#38A968] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#38A968]" /> ESP32 Camera Frame
              </span>
              <span className="text-xs text-slate-500 font-mono">{camStatus}</span>
            </div>

            <div className="relative border border-slate-200 bg-slate-950 aspect-4/3 overflow-hidden shadow-inner flex items-center justify-center">
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Chilli Field"
                className="w-full h-full object-cover"
                onLoad={handleImageLoaded}
                onError={handleImageError}
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#38A968]" /> Active Stream
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={espIp}
                  onChange={(e) => setEspIp(e.target.value)}
                  placeholder="ESP32 IP (e.g. 10.95.60.188)"
                  className="flex-1 px-3 py-2 border border-slate-200 text-black text-xs outline-none focus:border-[#38A968]"
                />
                <button
                  onClick={triggerCameraCapture}
                  className="px-3 py-2 bg-[#38A968] text-white hover:bg-[#2f8f57] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Get Frame
                </button>
              </div>

              <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer text-xs">
                <Upload className="w-3.5 h-3.5 text-[#38A968]" /> Upload Local Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Weather Box */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-5 lg:pb-0 lg:pr-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#38A968] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#38A968]" /> Weather Telemetry
            </span>

            {loadingWeather ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-[#38A968]" />
              </div>
            ) : weatherData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">{weatherData.location}</span>
                    <span className="text-4xl text-black block mt-0.5">{weatherData.temp}°C</span>
                  </div>
                  <Sun className="w-12 h-12 text-[#38A968]" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Wind className="w-3 h-3 text-[#38A968]" /> Wind
                    </span>
                    <span className="text-black text-sm block mt-0.5">{weatherData.windSpeed} km/h</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-[#38A968]" /> Humidity
                    </span>
                    <span className="text-black text-sm block mt-0.5">{weatherData.humidity}%</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-[#38A968]" /> Pressure
                    </span>
                    <span className="text-black text-sm block mt-0.5">{weatherData.pressure} hPa</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/40 border border-emerald-100">
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Sun className="w-3 h-3 text-[#38A968]" /> Rain Prob.
                    </span>
                    <span className="text-black text-sm block mt-0.5">{weatherData.rainProbability}%</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* IoT Telemetry — live from AppContext */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#38A968] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#38A968]" /> Field Sensors
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#38A968]" /> Soil Moisture
                </span>
                <span className="text-black text-sm">{sensorData.soilMoisture}{sensorData.soilMoisture !== '--' ? '%' : ''}</span>
              </div>

              <div className="p-3 bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#38A968]" /> Temperature
                </span>
                <span className="text-black text-sm">{sensorData.temperature}{sensorData.temperature !== '--' ? '°C' : ''}</span>
              </div>

              <div className="p-3 bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#38A968]" /> Soil pH Level
                </span>
                <span className="text-black text-sm">{sensorData.phLevel}</span>
              </div>

              <div className="p-3 bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#38A968]" /> Air Humidity
                </span>
                <span className="text-black text-sm">{sensorData.humidity}{sensorData.humidity !== '--' ? '%' : ''}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Prediction Results */}
        {aiResult ? (
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#38A968]">
                  AI Model Diagnosis
                </span>
                <span className={`text-[10px] px-2 py-0.5 border ${aiResult.severityBadge}`}>
                  {aiResult.severity}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Analyzed: {aiResult.analysisTime}</span>
            </div>

            <div className="bg-slate-900 text-white p-5 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase">Predicted Disease</span>
                  <h3 className="text-lg text-white mt-0.5">{aiResult.diseaseName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Model Confidence</span>
                  <span className="text-lg text-emerald-400 font-mono">{aiResult.confidenceScore}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
                <div className="bg-[#38A968] h-full" style={{ width: `${aiResult.confidenceScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
                <span className="text-black flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#38A968]" /> Agronomic Action
                </span>
                <p className="text-slate-700 leading-relaxed mt-1">{aiResult.recommendedTreatment}</p>
              </div>

              <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
                <span className="text-black flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-[#38A968]" /> Prescribed Fungicide
                </span>
                <p className="text-slate-700 leading-relaxed mt-1">{aiResult.recommendedMedicine}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-mono">
                <Cpu className="w-3 h-3 text-slate-400" /> Engine: {aiResult.modelUsed}
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-[#38A968]" /> Diagnosis Complete
              </span>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400 py-6">
            Click <strong>Get Frame</strong> to preview or <strong>Predict AI Diagnosis</strong> to process via FastAPI.
          </div>
        )}

      </div>
    </div>
  );
}