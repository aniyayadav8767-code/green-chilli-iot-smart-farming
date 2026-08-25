import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import AICropHealthCard from '../components/AICropHealthCard';
import ChartCard from '../components/ChartCard';
import WeatherWidget from '../components/WeatherWidget';
import PumpControlCard from '../components/PumpControlCard';
import {
  Thermometer,
  Droplets,
  Sun,
  Activity,
  Zap,
  Sprout,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wifi,
} from 'lucide-react';

export default function Dashboard() {
  const { sensorSummary: initialSummary, notifications } = useApp();
  
  // Set default IP printed on NodeMCU Serial Monitor
  const [nodeIp, setNodeIp] = useState('10.95.60.189');
  const [isConnected, setIsConnected] = useState(false);
  const [liveSensors, setLiveSensors] = useState(initialSummary);

  // Poll NodeMCU live endpoint
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const cleanIp = nodeIp.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        const res = await fetch(`http://${cleanIp}/readings`, { method: 'GET' });
        
        if (res.ok) {
          const data = await res.json();
          setIsConnected(true);
          setLiveSensors((prev) => ({
            ...prev,
            temperature: { ...prev.temperature, value: String(data.temperature) },
            humidity: { ...prev.humidity, value: String(data.humidity) },
            soilMoisture: { 
              ...prev.soilMoisture, 
              value: String(data.soilMoisture),
              status: data.soilMoisture >= 60 ? 'Wet' : data.soilMoisture <= 30 ? 'Dry' : 'Moist' 
            },
            lightIntensity: { ...prev.lightIntensity, value: String(data.lightIntensity) },
            pumpStatus: { ...prev.pumpStatus, value: data.pumpStatus || 'OFF' },
          }));
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); 
    return () => clearInterval(interval);
  }, [nodeIp]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive IoT Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time hardware telemetry and automated ESP32-CAM AI vision analytics.</p>
        </div>

        {/* Dynamic IP Input and Network Connection Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 text-xs rounded-lg shadow-sm">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={nodeIp}
              onChange={(e) => setNodeIp(e.target.value)}
              placeholder="NodeMCU IP"
              className="w-28 text-slate-800 font-mono bg-transparent outline-none"
            />
          </div>

          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            isConnected 
              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            {isConnected ? 'NodeMCU Connected' : 'Connecting NodeMCU...'}
          </span>
        </div>
      </div>

      {/* Live Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Temperature"
          value={liveSensors.temperature.value}
          unit={liveSensors.temperature.unit}
          trend={liveSensors.temperature.trend}
          trendUp={liveSensors.temperature.trendUp}
          status={liveSensors.temperature.status}
          badgeColor={liveSensors.temperature.badgeColor}
          icon={Thermometer}
          color="emerald"
        />

        <StatCard
          title="Humidity"
          value={liveSensors.humidity.value}
          unit={liveSensors.humidity.unit}
          trend={liveSensors.humidity.trend}
          trendUp={liveSensors.humidity.trendUp}
          status={liveSensors.humidity.status}
          badgeColor={liveSensors.humidity.badgeColor}
          icon={Droplets}
          color="blue"
        />

        <StatCard
          title="Soil Moisture"
          value={liveSensors.soilMoisture.value}
          unit={liveSensors.soilMoisture.unit}
          trend={liveSensors.soilMoisture.trend}
          trendUp={liveSensors.soilMoisture.trendUp}
          status={liveSensors.soilMoisture.status}
          badgeColor={liveSensors.soilMoisture.badgeColor}
          icon={Activity}
          color="emerald"
        />

        <StatCard
          title="Light Intensity"
          value={liveSensors.lightIntensity.value}
          unit=" Lux"
          trend={liveSensors.lightIntensity.trend}
          trendUp={liveSensors.lightIntensity.trendUp}
          status={liveSensors.lightIntensity.status}
          badgeColor={liveSensors.lightIntensity.badgeColor}
          icon={Sun}
          color="amber"
        />

        <StatCard
          title="Pump Status"
          value={liveSensors.pumpStatus.value}
          unit=""
          trend={liveSensors.pumpStatus.mode}
          trendUp={true}
          status={liveSensors.pumpStatus.status}
          badgeColor={liveSensors.pumpStatus.badgeColor}
          icon={Zap}
          color="emerald"
        />

        <StatCard
          title="Plant Health"
          value={liveSensors.plantHealth.value}
          unit=""
          trend={liveSensors.plantHealth.riskLevel}
          trendUp={true}
          status={liveSensors.plantHealth.status}
          badgeColor={liveSensors.plantHealth.badgeColor}
          icon={Sprout}
          color="emerald"
        />
      </div>

      {/* AI Crop Vision Card */}
      <AICropHealthCard />

      {/* Analytics & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ChartCard />

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Recent System Telemetry Events
            </h3>

            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    <div>
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PumpControlCard />
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}