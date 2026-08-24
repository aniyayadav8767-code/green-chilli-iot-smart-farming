import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import LiveMonitoring from '../pages/LiveMonitoring';
import AIDiseaseAnalysis from '../pages/AIDiseaseAnalysis';
import WeatherPage from '../pages/WeatherPage';
import PredictiveAnalytics from '../pages/PredictiveAnalytics';
import IrrigationPage from '../pages/IrrigationPage';
import SensorHistory from '../pages/SensorHistory';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* SaaS Dashboard Pages (MainLayout Wrapper) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<LiveMonitoring />} />
        <Route path="/ai-analysis" element={<AIDiseaseAnalysis />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
        <Route path="/irrigation" element={<IrrigationPage />} />
        <Route path="/history" element={<Navigate to="/monitoring" replace />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
