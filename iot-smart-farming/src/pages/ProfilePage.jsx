import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, ShieldCheck, Check, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Dr. A. Devan',
    title: 'Lead Agronomist & Research Supervisor',
    email: 'agronomist@smartfarming.edu',
    phone: '+91 98765 43210',
    department: 'Department of Computer Science & Agricultural Engineering',
    institution: 'National Institute of Technology & Research',
    location: 'Field Station Zone A, Punjab',
    bio: 'Specializing in precision farming, IoT sensor array networks, and edge AI plant disease detection using MobileNetV2 architecture.',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agronomist Profile & Credentials</h1>
        <p className="text-xs text-slate-500">Manage research profile, academic affiliation, and system administrator role.</p>
      </div>

      {/* Hero Banner */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-slate-900 to-emerald-950 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 border-4 border-white/20 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
          AD
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
              <p className="text-xs text-emerald-400 font-semibold">{profile.title}</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 w-fit mx-auto sm:mx-0">
              Verified Administrator
            </span>
          </div>

          <p className="text-xs text-slate-300 pt-1 font-medium">{profile.department}</p>
          <p className="text-[11px] text-slate-400">{profile.institution} • {profile.location}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Edit Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Designation / Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1 text-xs">Research Focus & Bio</label>
          <textarea
            rows="3"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="w-4 h-4" />
              Profile Updated Successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-md hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
