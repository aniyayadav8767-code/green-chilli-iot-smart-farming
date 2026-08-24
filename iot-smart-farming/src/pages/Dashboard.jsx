import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import AICropHealthCard from '../components/AICropHealthCard';
import ChartCard from '../components/ChartCard';
import PumpControlCard from '../components/PumpControlCard';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/Skeleton';
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
} from 'lucide-react';

export default function Dashboard() {
  const { sensorSummary, notifications, isLoading, error } = useApp();

  if (isLoading) return <div className="p-10 space-y-4"><CardSkeleton /><CardSkeleton /></div>;
  if (error) return <EmptyState title="Backend Unreachable" description={error} actionText="Retry" />;
  
  const hasSensors = sensorSummary?.temperature?.value !== undefined;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive IoT Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time hardware telemetry and automated ESP32-CAM AI vision analytics.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Telemetry Stream Live
          </span>
        </div>
      </div>

      {/* TOP SENSOR SUMMARY: 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {hasSensors ? (
          <>
            <StatCard
              title="Temperature"
              value={sensorSummary.temperature.value}
              unit={sensorSummary.temperature.unit}
              trend={sensorSummary.temperature.trend}
              trendUp={sensorSummary.temperature.trendUp}
              status={sensorSummary.temperature.status}
              badgeColor={sensorSummary.temperature.badgeColor}
              icon={Thermometer}
              color="emerald"
            />

            <StatCard
              title="Humidity"
              value={sensorSummary.humidity.value}
              unit={sensorSummary.humidity.unit}
              trend={sensorSummary.humidity.trend}
              trendUp={sensorSummary.humidity.trendUp}
              status={sensorSummary.humidity.status}
              badgeColor={sensorSummary.humidity.badgeColor}
              icon={Droplets}
              color="blue"
            />

            <StatCard
              title="Soil Moisture"
              value={sensorSummary.soilMoisture.value}
              unit={sensorSummary.soilMoisture.unit}
              trend={sensorSummary.soilMoisture.trend}
              trendUp={sensorSummary.soilMoisture.trendUp}
              status={sensorSummary.soilMoisture.status}
              badgeColor={sensorSummary.soilMoisture.badgeColor}
              icon={Activity}
              color="emerald"
            />

            <StatCard
              title="Light Intensity"
              value={sensorSummary.lightIntensity.value}
              unit={sensorSummary.lightIntensity.unit}
              trend={sensorSummary.lightIntensity.trend}
              trendUp={sensorSummary.lightIntensity.trendUp}
              status={sensorSummary.lightIntensity.status}
              badgeColor={sensorSummary.lightIntensity.badgeColor}
              icon={Sun}
              color="amber"
            />

            <StatCard
              title="Pump Status"
              value={sensorSummary.pumpStatus.value}
              unit=""
              trend={sensorSummary.pumpStatus.mode}
              trendUp={true}
              status={sensorSummary.pumpStatus.status}
              badgeColor={sensorSummary.pumpStatus.badgeColor}
              icon={Zap}
              color="emerald"
            />

            <StatCard
              title="Plant Health"
              value={sensorSummary.plantHealth.value}
              unit=""
              trend={sensorSummary.plantHealth.riskLevel}
              trendUp={true}
              status={sensorSummary.plantHealth.status}
              badgeColor={sensorSummary.plantHealth.badgeColor}
              icon={Sprout}
              color="emerald"
            />
          </>
        ) : (
          <div className="col-span-full">
            <EmptyState title="Connecting to Field Nodes..." description="Waiting for first telemetry payload from ESP8266 via FastAPI." />
          </div>
        )}
      </div>

      {/* MAIN FEATURE SECTION: 🌿 AI Crop Health Analysis (Automated ESP32-CAM) */}
      <AICropHealthCard />

      {/* BELOW AI SECTION: Telemetry Charts, Pump Control & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Charts & Alerts) */}
        <div className="lg:col-span-8 space-y-6">
          <ChartCard />

          {/* Recent Alerts Feed */}
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

        {/* Right Column (Weather & Pump Control Widgets) */}
        <div className="lg:col-span-4 space-y-6">
          <PumpControlCard />
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}
