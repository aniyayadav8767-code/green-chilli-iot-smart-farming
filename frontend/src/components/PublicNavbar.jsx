import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogIn, Menu, X, ArrowRight } from 'lucide-react';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'How It Works', href: '#workflow' },
    { name: 'Technology', href: '#technology' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-navbar py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Agri<span className="emerald-gradient-text">Smart IoT</span>
            </span>
            <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-widest -mt-1">
              B.Tech Project
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-extrabold shadow-md shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-card m-4 p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex flex-col space-y-3 font-semibold text-sm text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-slate-100 hover:text-emerald-600"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/login');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
