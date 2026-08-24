import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSensorSummary = async () => {
  const response = await apiClient.get('/sensors/summary');
  return response.data;
};

export const getAICropHealth = async () => {
  // Backend relies solely on POST predictions
  return null;
};

export const getTimeSeriesData = async (period = '24h') => {
  const response = await apiClient.get(`/sensors/timeseries`);
  return response.data;
};

export const getIrrigationStatus = async () => {
  const response = await apiClient.get('/irrigation/status');
  return response.data;
};

export const togglePumpMode = async (zone, status, duration = null) => {
  const payload = { zone, status };
  if (duration) payload.duration_minutes = duration;
  const response = await apiClient.post('/irrigation/toggle', payload);
  return response.data;
};

export const getDevicesStatus = async () => {
  const response = await apiClient.get('/devices');
  return response.data;
};

export const uploadAndPredict = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/ai/predict', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export default apiClient;
