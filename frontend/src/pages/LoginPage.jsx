import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('agronomist@smartfarming.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins relative overflow-hidden">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-slate-100 to-green-400/10 -z-10" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />

      {/* Main Split Glass Card Container */}
      <div className="w-full max-w-4xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 my-6">
        {/* LEFT SIDE: Brand Illustration */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="pt-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                <Sprout className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">AgriSmart Portal</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Executive Control Hub for IoT Sensors & ESP32-CAM AI Vision Pipelines.
              </p>
            </div>
          </div>

          <div className="space-y-3 relative z-10 pt-10">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span className="text-emerald-400 font-bold block">🔒 Secure SaaS Authentication</span>
              <span className="text-[11px] text-slate-300 mt-0.5 block">Encrypted JWT Token Handshake</span>
            </div>
            <p className="text-[10px] text-slate-400">Final Year B.Tech Engineering Project © 2026</p>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Sign In to Dashboard</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to manage smart farm hardware nodes.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-emerald-600 hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
