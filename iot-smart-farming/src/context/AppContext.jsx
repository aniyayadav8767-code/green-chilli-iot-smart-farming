import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSensorSummary, 
  getTimeSeriesData, 
  getIrrigationStatus,
  getDevicesStatus,
  togglePumpMode,
  uploadAndPredict
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [sensorSummary, setSensorSummary] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [devices, setDevices] = useState([]);
  const [irrigation, setIrrigation] = useState([]);
  const [aiCropHealth, setAiCropHealth] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, tsRes, irRes, devRes] = await Promise.all([
        getSensorSummary(),
        getTimeSeriesData(),
        getIrrigationStatus(),
        getDevicesStatus()
      ]);
      
      setSensorSummary(summaryRes);
      setTimeSeries(tsRes);
      setIrrigation(irRes);
      setDevices(devRes);
    } catch (err) {
      setError(err.message || 'Failed to connect to FastAPI backend');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleTogglePump = async (zone, currentStatus) => {
    try {
      const newStatus = currentStatus === 'on' ? 'off' : 'on';
      await togglePumpMode(zone, newStatus);
      // Backend stub always returns pending_hardware_update.
      // Refresh to get state
      await fetchInitialData();
      addNotification({ id: Date.now(), type: 'info', title: 'Pump Control', message: `Actuated ${zone} to ${newStatus}.`, time: new Date().toLocaleTimeString() });
    } catch (err) {
      addNotification({ id: Date.now(), type: 'warning', title: 'Action Failed', message: 'Could not contact field relay.', time: new Date().toLocaleTimeString() });
    }
  };

  const processAIPrediction = async (file) => {
    try {
      setAiCropHealth({ processingStatus: 'Processing' });
      const result = await uploadAndPredict(file);
      setAiCropHealth({
        processingStatus: 'Completed',
        camera: {
            status: 'Offline',
            rssi: '-0dBm',
            imageUrl: URL.createObjectURL(file), // display local file
            lastCaptureTime: new Date().toLocaleTimeString(),
            imageId: 'M_CAPT_'+Math.floor(Math.random()*1000),
            nodeId: 'Manual Upload',
            resolution: 'Unknown',
            fps: '0'
        },
        aiResult: {
            diseaseName: result.disease,
            confidenceScore: (result.confidence * 100).toFixed(1),
            severity: result.disease.toLowerCase().includes('healthy') ? 'None' : 'Moderate',
            severityBadge: result.disease.toLowerCase().includes('healthy') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300',
            affectedPart: 'Leaf',
            overallPlantHealth: result.disease.toLowerCase().includes('healthy') ? 'Excellent' : 'At Risk',
            recommendedTreatment: 'See agronomic guides for specific fungal management.',
            recommendedMedicine: 'Standard Contact Fungicide',
            modelUsed: 'EfficientNet-B0',
            analysisTime: new Date().toLocaleTimeString()
        },
        recentScans: []
      });
      addNotification({ id: Date.now(), type: 'success', title: 'AI Prediction Complete', message: `Detected ${result.disease} with ${Math.round(result.confidence * 100)}% confidence`, time: new Date().toLocaleTimeString() });
    } catch (err) {
      setAiCropHealth({ processingStatus: 'Failed' });
      addNotification({ id: Date.now(), type: 'warning', title: 'AI Failed', message: err.message, time: new Date().toLocaleTimeString() });
    }
  }

  const addNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        sensorSummary,
        timeSeries,
        devices,
        irrigation,
        aiCropHealth,
        notifications,
        currentTime,
        isLoading,
        error,
        processAIPrediction,
        handleTogglePump,
        addNotification,
        dismissNotification,
        refreshBackend: fetchInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
