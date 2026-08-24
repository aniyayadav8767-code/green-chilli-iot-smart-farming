import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-poppins">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        {/* App Footer */}
        <footer className="px-6 py-4 border-t border-slate-200/80 text-center text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <p>© 2026 IoT-Based Smart Farming System. Final Year B.Tech Project.</p>
            <p className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>Hardware Nodes: ESP8266 & ESP32-CAM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>AI Engine: MobileNetV2</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
