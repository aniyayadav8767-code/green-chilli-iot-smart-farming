import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialSensorSummary, initialAICropHealth, irrigationSystemData, recentAlerts } from '../services/mockData';
import { getSensorSummary, getIrrigationStatus, togglePumpMode as apiTogglePump } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sensorSummary, setSensorSummary] = useState(initialSensorSummary);
  const [aiCropHealth, setAiCropHealth] = useState(initialAICropHealth);
  const [irrigation, setIrrigation] = useState(irrigationSystemData);
  const [notifications, setNotifications] = useState(recentAlerts);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme Syncing
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

  // ─── Fetch from API on mount, fallback to mock ──────────
  const fetchSensorSummary = useCallback(async () => {
    try {
      const data = await getSensorSummary();
      // Check if data is from real backend (not mock) by checking for "No Data" pattern
      const isReal = data?.temperature?.value !== undefined && data.temperature.value !== '--';
      if (isReal || data?.temperature?.status !== 'No Data') {
        setSensorSummary(data);
        setIsBackendConnected(true);
      } else {
        // Backend returned empty sensor data — keep mock for display
        setIsBackendConnected(true);
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, []);

  const fetchIrrigationStatus = useCallback(async () => {
    try {
      const data = await getIrrigationStatus();
      if (data && data.pumpStatus !== undefined) {
        setIrrigation(data);
      }
    } catch {
      // keep mock
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSensorSummary(),
        fetchIrrigationStatus(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchSensorSummary, fetchIrrigationStatus]);

  // Poll sensor summary every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorSummary();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchSensorSummary]);

  // ─── Actions ────────────────────────────────────────────

  const triggerCamAutoRefresh = () => {
    setAiCropHealth((prev) => ({
      ...prev,
      camera: {
        ...prev.camera,
        lastCaptureTime: 'Just now (' + new Date().toLocaleTimeString() + ')',
        imageId: 'CAM_CAPT_20260728_' + Math.floor(1000 + Math.random() * 9000),
      },
      aiResult: {
        ...prev.aiResult,
        analysisTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        processingStatus: 'Completed',
      },
    }));
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'ESP32-CAM Image Processed',
      message: 'New crop image analyzed by EfficientNet-B0 AI model.',
      time: 'Just now',
    });
  };

  const togglePumpStatus = async () => {
    const nextStatus = irrigation.pumpStatus === 'ON' ? 'OFF' : 'ON';

    // Optimistic local update
    setIrrigation((prev) => ({
      ...prev,
      pumpStatus: nextStatus,
      lastActivated: 'Just now (' + new Date().toLocaleTimeString() + ')',
    }));
    setSensorSummary((prev) => ({
      ...prev,
      pumpStatus: {
        ...prev.pumpStatus,
        value: nextStatus === 'ON' ? 'PUMP ON' : 'PUMP OFF',
        status: nextStatus === 'ON' ? 'Active' : 'Standby',
      },
    }));

    // Call backend API
    try {
      await apiTogglePump('zone1', nextStatus.toLowerCase());
    } catch {
      // Backend call failed — local state already updated optimistically
    }
  };

  const toggleIrrigationMode = (mode) => {
    setIrrigation((prev) => ({ ...prev, mode }));
  };

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
        setSensorSummary,
        aiCropHealth,
        setAiCropHealth,
        irrigation,
        notifications,
        currentTime,
        isLoading,
        isBackendConnected,
        triggerCamAutoRefresh,
        togglePumpStatus,
        toggleIrrigationMode,
        addNotification,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
