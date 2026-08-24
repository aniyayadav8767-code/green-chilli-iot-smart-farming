import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Activity,
  Scan,
  CloudSun,
  LineChart,
  ArrowRight,
  Cpu,
  Server,
  Database,
  BrainCircuit,
  Radio,
  Camera,
  CheckCircle2,
  Send,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { techStackData } from '../services/mockData';

export default function LandingPage() {
  const navigate = useNavigate();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
    setFormData({ name: '', email: '', message: '' });
  };

  const featureCards = [
    {
      icon: Thermometer,
      title: 'Temperature Monitoring',
      desc: 'Precision DHT11 ambient thermal tracking with automated high-temperature threshold alerts.',
      color: 'emerald',
    },
    {
      icon: Droplets,
      title: 'Humidity Monitoring',
      desc: 'Continuous air moisture sampling to protect crops against fungal disease vectors.',
      color: 'blue',
    },
    {
      icon: Activity,
      title: 'Soil Moisture Monitoring',
      desc: 'Deep capacitive soil probe telemetry for micro-zone soil water retention measuring.',
      color: 'emerald',
    },
    {
      icon: Scan,
      title: 'AI Disease Analysis',
      desc: 'Automated ESP32-CAM foliage captures classified via MobileNetV2 Deep Learning.',
      color: 'amber',
    },
    {
      icon: CloudSun,
      title: 'Weather Forecast',
      desc: 'Local microclimate prediction modeling humidity, UV index, and rain probabilities.',
      color: 'sky',
    },
    {
      icon: Zap,
      title: 'Smart Irrigation',
      desc: 'Closed-loop 5V relay pump actuation triggered automatically by soil moisture levels.',
      color: 'emerald',
    },
  ];

  const workflowSteps = [
    { name: 'Sensors', desc: 'DHT11, Soil Probe, LDR', icon: Droplets },
    { name: 'ESP8266 / CAM', desc: 'Wi-Fi Edge Nodes', icon: Radio },
    { name: 'Flask Backend', desc: 'RESTful Microservices', icon: Server },
    { name: 'MySQL Database', desc: 'Telemetry Persistence', icon: Database },
    { name: 'AI Model', desc: 'MobileNetV2 Inference', icon: BrainCircuit },
    { name: 'SaaS Dashboard', desc: 'Realtime Executive Control', icon: Sprout },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-poppins selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navigation */}
      <PublicNavbar />

      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient Gradient Background & Floating Leaves Simulation */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/20 via-green-300/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Next-Gen B.Tech Project Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                IoT-Based <br />
                <span className="emerald-gradient-text">Smart Farming</span> System
              </h1>

              <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-wide uppercase">
                Smart Monitoring • Intelligent Irrigation • AI Disease Detection • Predictive Analytics
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                A next-generation smart farming platform integrating IoT sensors, artificial intelligence, weather monitoring, and predictive analytics to enable efficient irrigation, real-time monitoring, and intelligent farming decisions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#about"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 font-bold text-sm shadow-sm hover:border-emerald-300 transition-all flex items-center justify-center gap-2"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Hero Illustration & Floating Status Cards */}
            <div className="lg:col-span-6 relative flex justify-center">
              {/* Central SVG Smart Farm Diagram */}
              <div className="w-full max-w-lg aspect-square glass-card rounded-3xl p-6 border border-slate-200/90 shadow-2xl relative flex items-center justify-center bg-gradient-to-b from-white/90 to-slate-100/90">
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#15803d" />
                    </linearGradient>
                  </defs>
                  {/* Central Node */}
                  <circle cx="250" cy="250" r="65" fill="url(#greenGrad)" className="shadow-lg" />
                  <text x="250" y="245" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="Poppins">AgriCloud</text>
                  <text x="250" y="265" textAnchor="middle" fill="#dcfce7" fontSize="11" fontFamily="Poppins">Flask + AI</text>

                  {/* Satellite IoT Nodes */}
                  <g className="animate-pulse">
                    <line x1="250" y1="250" x2="120" y2="120" stroke="#22c55e" strokeWidth="3" strokeDasharray="6 6" />
                    <line x1="250" y1="250" x2="380" y2="120" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" />
                    <line x1="250" y1="250" x2="120" y2="380" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
                    <line x1="250" y1="250" x2="380" y2="380" stroke="#10b981" strokeWidth="3" strokeDasharray="6 6" />
                  </g>

                  {/* ESP8266 Node */}
                  <circle cx="120" cy="120" r="40" fill="#ffffff" stroke="#22c55e" strokeWidth="4" />
                  <text x="120" y="125" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">ESP8266</text>

                  {/* ESP32-CAM AI Node */}
                  <circle cx="380" cy="120" r="40" fill="#ffffff" stroke="#3b82f6" strokeWidth="4" />
                  <text x="380" y="125" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">ESP32-CAM</text>

                  {/* Pump Actuator */}
                  <circle cx="120" cy="380" r="40" fill="#ffffff" stroke="#f59e0b" strokeWidth="4" />
                  <text x="120" y="385" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">5V Pump</text>

                  {/* Dashboard Node */}
                  <circle cx="380" cy="380" r="40" fill="#ffffff" stroke="#10b981" strokeWidth="4" />
                  <text x="380" y="385" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Dashboard</text>
                </svg>

                {/* Floating Status Cards */}
                <div className="absolute -top-4 -left-4 glass-card p-3 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-slow">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Temperature</span>
                    <span className="text-xs font-extrabold text-slate-800">28.4 °C</span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-card p-3 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Humidity</span>
                    <span className="text-xs font-extrabold text-slate-800">65.2 %</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-slow" style={{ animationDelay: '2s' }}>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">AI Model Status</span>
                    <span className="text-xs font-extrabold text-emerald-600">96.8% Confidence</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 glass-card p-3 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-slow" style={{ animationDelay: '3s' }}>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Pump State</span>
                    <span className="text-xs font-extrabold text-emerald-600">AUTO ON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Project Architecture Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Intelligent Agronomic Ecosystem
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed as a final year capstone engineering project to bridge low-power hardware telemetry with state-of-the-art Deep Learning vision models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">IoT Telemetry Hardware</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ESP8266 microcontrollers interface with DHT11, capacitive soil probes, and ambient light sensors to collect microclimate data every 5 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Autonomous ESP32-CAM AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated camera module automatically captures foliage images and dispatches high-resolution streams to the Flask AI classification server.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Predictive Analytics & Pump Relay</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI algorithms calculate soil water depletion curves and trigger 5V relays to automate precision drip irrigation only when necessary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Core System Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Six Pillars of Smart Agriculture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="glass-card rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{feat.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="pt-2 flex items-center text-xs font-bold text-emerald-600 gap-1">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="workflow" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How the System Works
            </h2>
            <p className="text-sm text-slate-600">
              From physical sensor hardware in the field to edge AI inference and executive dashboard display.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mb-3 shadow-md shadow-emerald-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{step.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{step.desc}</span>

                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY SECTION ================= */}
      <section id="technology" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Full Technology Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built with Production-Grade Frameworks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                <Cpu className="w-5 h-5" />
                <span>Frontend Layer</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                {techStackData.frontend.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm">
                <Server className="w-5 h-5" />
                <span>Backend & Database</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                {techStackData.backend.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Engine */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
                <BrainCircuit className="w-5 h-5" />
                <span>Artificial Intelligence</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                {techStackData.ai.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                <Radio className="w-5 h-5" />
                <span>Hardware Components</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-600">
                {techStackData.hardware.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Project Team</h2>
            <p className="text-xs text-slate-500">Have questions about our B.Tech final year project design or hardware setup?</p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl">
            {contactSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Message Dispatched Successfully!</h3>
                <p className="text-xs text-slate-500">Thank you. Our project team will respond to your inquiry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Project Inquiry Message</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Enter your message regarding IoT hardware or AI models..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
