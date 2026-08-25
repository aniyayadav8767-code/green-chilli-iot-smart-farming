import axios from 'axios';
import * as mockData from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for simulated network delay (mock fallback only)
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Sensors ───────────────────────────────────────────────
export const getSensorSummary = async () => {
  try {
    const response = await apiClient.get('/sensors/summary');
    return response.data;
  } catch (error) {
    console.warn('Backend API unavailable. Using mock sensor summary data.', error.message);
    await delay(300);
    return mockData.initialSensorSummary;
  }
};

export const getTimeSeriesData = async (period = '24h') => {
  try {
    const response = await apiClient.get(`/sensors/timeseries?period=${period}`);
    return response.data;
  } catch (error) {
    await delay(300);
    return mockData.hourlySensorTimeSeries;
  }
};

// ─── AI / ESP32-CAM ────────────────────────────────────────
export const getAICropHealth = async () => {
  try {
    const response = await apiClient.get('/ai/crop-health');
    return response.data;
  } catch (error) {
    console.warn('Backend API unavailable. Using mock AI crop health data.', error.message);
    await delay(400);
    return mockData.initialAICropHealth;
  }
};

/**
 * Production camera pathway: FastAPI fetches image from ESP32-CAM,
 * runs EfficientNet-B0 inference, saves to DB, returns prediction.
 */
export const captureAndPredict = async (espIp) => {
  try {
    const response = await apiClient.get(`/ai/capture`, {
      params: { ip: espIp },
      timeout: 15000, // ESP32-CAM might be slow
    });
    return response.data;
  } catch (error) {
    console.warn('ESP32-CAM capture via backend failed.', error.message);
    throw error; // Do NOT fallback to mock — this is a real hardware call
  }
};

/**
 * Manual image upload: user picks a local file, sends to FastAPI for inference.
 */
export const predictFromUpload = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await apiClient.post('/ai/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.warn('AI prediction upload failed.', error.message);
    throw error;
  }
};

export const getAIHistory = async (limit = 10) => {
  try {
    const response = await apiClient.get('/ai/history', { params: { limit } });
    return response.data;
  } catch (error) {
    console.warn('AI history unavailable.', error.message);
    return [];
  }
};

// ─── Weather ───────────────────────────────────────────────
export const getWeatherTelemetry = async () => {
  try {
    const response = await apiClient.get('/weather/telemetry');
    return response.data;
  } catch (error) {
    await delay(250);
    return mockData.weatherTelemetry;
  }
};

// ─── Irrigation ────────────────────────────────────────────
export const getIrrigationStatus = async () => {
  try {
    const response = await apiClient.get('/irrigation/status');
    return response.data;
  } catch (error) {
    await delay(300);
    return mockData.irrigationSystemData;
  }
};

export const togglePumpMode = async (zone = 'zone1', status) => {
  try {
    const response = await apiClient.post('/irrigation/toggle', { zone, status });
    return response.data;
  } catch (error) {
    await delay(300);
    return { success: true, zone, status };
  }
};

// ─── Predictive Analytics ──────────────────────────────────
export const getPredictiveAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics/predictive');
    return response.data;
  } catch (error) {
    await delay(300);
    return mockData.predictiveAnalyticsData;
  }
};

// ─── Devices ───────────────────────────────────────────────
export const getDevicesStatus = async () => {
  try {
    const response = await apiClient.get('/devices');
    return response.data;
  } catch (error) {
    await delay(200);
    return mockData.devicesStatus;
  }
};

export default apiClient;
