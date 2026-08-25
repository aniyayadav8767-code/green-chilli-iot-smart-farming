import React from 'react';
import { Sprout, Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Agri<span className="emerald-gradient-text">Smart IoT</span>
                </span>
                <p className="text-xs text-slate-400">IoT & AI Smart Farming Platform</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A comprehensive Final Year B.Tech project integrating IoT sensors, ESP32-CAM AI vision, microclimate weather tracking, and predictive analytics to revolutionize modern agriculture.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@smartfarming.edu"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About System</a></li>
              <li><a href="#workflow" className="hover:text-emerald-400 transition-colors">IoT Workflow</a></li>
              <li><a href="#technology" className="hover:text-emerald-400 transition-colors">Tech Matrix</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Team</a></li>
            </ul>
          </div>

          {/* Technology Summary */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by ESP8266 & ESP32-CAM edge hardware nodes, Flask REST APIs, MySQL persistence, and MobileNetV2 Deep Learning transfer models.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-emerald-400 font-mono">
              🟢 Status: Hardware Nodes & AI Pipelines Active
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 IoT-Based Smart Farming System. Final Year B.Tech Capstone Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Agriculture
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
