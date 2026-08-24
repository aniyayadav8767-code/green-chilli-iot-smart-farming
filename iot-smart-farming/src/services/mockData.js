// Comprehensive Mock Telemetry & AI Analytics Data for IoT Smart Farming System

export const initialSensorSummary = {
  temperature: {
    value: 28.4,
    unit: '°C',
    trend: '+1.2%',
    trendUp: true,
    status: 'Optimal',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    min: 18.0,
    max: 38.0,
  },
  humidity: {
    value: 65.2,
    unit: '%',
    trend: '-0.8%',
    trendUp: false,
    status: 'Good',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    min: 40.0,
    max: 85.0,
  },
  soilMoisture: {
    value: 42.8,
    unit: '%',
    trend: '+3.4%',
    trendUp: true,
    status: 'Optimal',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    min: 30.0,
    max: 70.0,
  },
  lightIntensity: {
    value: 850,
    unit: 'Lux',
    trend: '+5.1%',
    trendUp: true,
    status: 'High Sun',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    min: 200,
    max: 1200,
  },
  pumpStatus: {
    value: 'PUMP ON',
    mode: 'Automatic AI Mode',
    status: 'Active',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    lastActivated: '12 mins ago',
    runtimeToday: '1h 24m',
  },
  plantHealth: {
    value: '94%',
    score: 94,
    status: 'Healthy',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    riskLevel: 'Low Risk',
  },
};

// ESP32-CAM AI Crop Health Automated Feed Mock Data
export const initialAICropHealth = {
  camera: {
    status: 'Online',
    nodeId: 'ESP32_CAM_NODE_01',
    resolution: '1600 x 1200 (UXGA)',
    rssi: '-42 dBm (Excellent)',
    lastCaptureTime: 'Just now (Auto-refreshed)',
    imageId: 'CAM_CAPT_20260728_0094',
    fps: '15 FPS Live Feed',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb179a5?auto=format&fit=crop&w=800&q=80',
  },
  aiResult: {
    diseaseName: 'Green Chilli Early Blight (Alternaria solani)',
    confidenceScore: 96.8,
    severity: 'Mild (Stage 1 Detected)',
    severityBadge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    affectedPart: 'Lower Foliage (Leaves L2 & L4)',
    recommendedTreatment: 'Apply Copper Hydroxide fungicide spray. Ensure adequate spacing between crop rows to improve air circulation and prevent moisture buildup.',
    recommendedMedicine: 'Mancozeb 75% WP or Chlorothalonil 75% WP (2.5g / Liter of water)',
    analysisTime: '2026-07-28 14:46:12',
    modelUsed: 'MobileNetV2 (TensorFlow Lite Deep Neural Net)',
    overallPlantHealth: '94.2%',
    processingStatus: 'Completed', // 'Processing', 'Completed', 'Failed'
    aiStatusBadge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  recentScans: [
    { id: 1, time: '14:46:12', result: 'Green Chilli Early Blight', confidence: '96.8%', status: 'Mild', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb179a5?auto=format&fit=crop&w=400&q=80' },
    { id: 2, time: '12:30:00', result: 'Healthy Plant', confidence: '99.1%', status: 'Optimal', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80' },
    { id: 3, time: '10:15:22', result: 'Healthy Plant', confidence: '98.5%', status: 'Optimal', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80' },
    { id: 4, time: '08:00:10', result: 'Maize Leaf Spot', confidence: '92.4%', status: 'Low', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80' },
  ],
};

// Hourly Sensor Telemetry for Recharts
export const hourlySensorTimeSeries = [
  { time: '00:00', temp: 22.1, humidity: 78, moisture: 48, light: 0 },
  { time: '02:00', temp: 21.4, humidity: 82, moisture: 47, light: 0 },
  { time: '04:00', temp: 20.8, humidity: 85, moisture: 46, light: 0 },
  { time: '06:00', temp: 22.5, humidity: 79, moisture: 45, light: 150 },
  { time: '08:00', temp: 25.2, humidity: 72, moisture: 44, light: 520 },
  { time: '10:00', temp: 27.8, humidity: 68, moisture: 41, light: 780 },
  { time: '12:00', temp: 29.5, humidity: 62, moisture: 38, light: 950 },
  { time: '14:00', temp: 28.4, humidity: 65, moisture: 42, light: 850 },
  { time: '16:00', temp: 27.1, humidity: 67, moisture: 44, light: 610 },
  { time: '18:00', temp: 25.3, humidity: 71, moisture: 46, light: 290 },
  { time: '20:00', temp: 23.8, humidity: 75, moisture: 47, light: 0 },
  { time: '22:00', temp: 22.9, humidity: 77, moisture: 48, light: 0 },
];

// Disease Distribution Breakdown
export const diseaseDistributionData = [
  { name: 'Healthy Crops', value: 68, color: '#22c55e' },
  { name: 'Early Blight', value: 18, color: '#f59e0b' },
  { name: 'Leaf Spot', value: 9, color: '#3b82f6' },
  { name: 'Rust Disease', value: 5, color: '#ef4444' },
];

// Microclimate Weather Data
export const weatherTelemetry = {
  location: 'Greenfield Smart Farm Station - Field A',
  temp: 28.4,
  condition: 'Partly Cloudy & Sunny',
  high: 30.2,
  low: 20.5,
  humidity: 65,
  windSpeed: 14,
  windDirection: 'NE',
  pressure: 1012,
  rainProbability: 15,
  uvIndex: '6 (High)',
  visibility: '10 km',
  dewPoint: '19.2°C',
  hourlyForecast: [
    { time: '15:00', temp: 29, pop: 10, icon: 'sun' },
    { time: '16:00', temp: 28, pop: 15, icon: 'cloud-sun' },
    { time: '17:00', temp: 27, pop: 20, icon: 'cloud-sun' },
    { time: '18:00', temp: 25, pop: 10, icon: 'sun' },
    { time: '19:00', temp: 24, pop: 5, icon: 'moon' },
    { time: '20:00', temp: 23, pop: 5, icon: 'moon' },
  ],
  weeklyForecast: [
    { day: 'Mon', high: 30, low: 21, condition: 'Sunny', rain: '10%' },
    { day: 'Tue', high: 28, low: 20, condition: 'Partly Cloudy', rain: '15%' },
    { day: 'Wed', high: 27, low: 19, condition: 'Moderate Rain', rain: '65%' },
    { day: 'Thu', high: 26, low: 18, condition: 'Thunderstorm', rain: '80%' },
    { day: 'Fri', high: 29, low: 20, condition: 'Clear Sky', rain: '5%' },
    { day: 'Sat', high: 31, low: 22, condition: 'Hot & Clear', rain: '0%' },
    { day: 'Sun', high: 30, low: 21, condition: 'Partly Cloudy', rain: '20%' },
  ],
};

// Smart Irrigation & Pump System Data
export const irrigationSystemData = {
  pumpStatus: 'ON',
  mode: 'Automatic', // 'Automatic' or 'Manual'
  tankLevel: 78, // %
  waterUsageToday: 420, // Liters
  pumpRuntimeToday: 84, // Minutes
  flowRate: '18.5 L/min',
  lastActivated: '2026-07-28 14:34:00',
  nextScheduledRun: '18:00:00 (AI Condition-Triggered)',
  schedules: [
    { id: 1, time: '06:30 AM', duration: '20 mins', zone: 'Zone A (Green Chillies)', trigger: 'Moisture < 35%', status: 'Completed' },
    { id: 2, time: '02:30 PM', duration: '15 mins', zone: 'Zone A (Green Chillies)', trigger: 'Moisture < 40%', status: 'Completed' },
    { id: 3, time: '06:00 PM', duration: '25 mins', zone: 'Zone B (Maize)', trigger: 'Scheduled AI Run', status: 'Pending' },
  ],
};

// Predictive Analytics Data
export const predictiveAnalyticsData = {
  healthIndex: 94,
  diseaseRiskScore: 12, // %
  waterRequirement: '140 Liters',
  aiRecommendation: 'Soil moisture is projected to drop below 35% at 17:45. Automatic drip irrigation will be activated for 20 minutes.',
  soilDepletionForecast: [
    { hour: 'Now', actual: 42.8, predicted: 42.8 },
    { hour: '+2h', actual: null, predicted: 39.5 },
    { hour: '+4h', actual: null, predicted: 36.2 },
    { hour: '+6h', actual: null, predicted: 33.0 },
    { hour: '+8h (Irrigated)', actual: null, predicted: 55.0 },
    { hour: '+10h', actual: null, predicted: 52.4 },
    { hour: '+12h', actual: null, predicted: 49.8 },
  ],
};

// System Devices / Nodes Status
export const devicesStatus = [
  { id: 'ESP8266_MAIN', name: 'ESP8266 Telemetry Gateway', type: 'Sensor Gateway', status: 'Online', ip: '192.168.1.104', uptime: '14 days', signal: '94%' },
  { id: 'ESP32_CAM_AI', name: 'ESP32-CAM AI Vision Node', type: 'AI Vision Camera', status: 'Online', ip: '192.168.1.108', uptime: '6 days', signal: '98%' },
  { id: 'RELAY_MODULE', name: '4-Channel 5V Relay Board', type: 'Pump Actuator', status: 'Active (Pump ON)', ip: 'N/A (GPIO 14)', uptime: '14 days', signal: 'Wire Link' },
  { id: 'DHT11_SENSOR', name: 'DHT11 Temp & Humidity Sensor', type: 'Environmental Sensor', status: 'Healthy', ip: 'GPIO 4', uptime: '14 days', signal: 'Wire Link' },
];

// Recent Alerts & Logs
export const recentAlerts = [
  { id: 1, type: 'info', title: 'Automated Irrigation Triggered', message: 'Relay turned ON pump for Zone A due to soil moisture dropping below threshold (38%).', time: '12 mins ago' },
  { id: 2, type: 'warning', title: 'Early Blight Detected by AI', message: 'ESP32-CAM captured leaf spot. MobileNetV2 flagged Green Chilli Early Blight with 96.8% confidence.', time: '2 mins ago' },
  { id: 3, type: 'success', title: 'Sensor Telemetry Sync', message: 'All 4 IoT nodes synced successfully with Flask Cloud API.', time: '30 mins ago' },
];

// Technology matrix for Landing Page
export const techStackData = {
  frontend: [
    { name: 'React (Vite)', desc: 'Component UI library', icon: 'Atom' },
    { name: 'Tailwind CSS', desc: 'SaaS Design System & Glassmorphism', icon: 'Palette' },
    { name: 'Framer Motion', desc: 'Fluid UI micro-animations', icon: 'Sparkles' },
    { name: 'Recharts', desc: 'Responsive interactive telemetry charts', icon: 'BarChart3' },
  ],
  backend: [
    { name: 'Flask (Python)', desc: 'RESTful API Services', icon: 'Server' },
    { name: 'MySQL Database', desc: 'Telemetry & log persistence', icon: 'Database' },
    { name: 'Axios Client', desc: 'Async HTTP service layer', icon: 'Globe' },
  ],
  ai: [
    { name: 'TensorFlow Lite', desc: 'Edge AI inference framework', icon: 'BrainCircuit' },
    { name: 'MobileNetV2', desc: 'Transfer learning vision model', icon: 'Cpu' },
  ],
  hardware: [
    { name: 'ESP8266 NodeMCU', desc: 'Wi-Fi Telemetry Microcontroller', icon: 'Radio' },
    { name: 'ESP32-CAM', desc: 'AI Vision Camera Module', icon: 'Camera' },
    { name: 'DHT11 Sensor', desc: 'Temperature & Humidity Sensor', icon: 'Thermometer' },
    { name: 'Soil Moisture Sensor', desc: 'Capacitive Soil Probe', icon: 'Droplets' },
    { name: '5V Relay & Pump', desc: 'High-current Water Actuator', icon: 'Zap' },
  ],
};
