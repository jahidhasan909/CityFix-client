"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, CheckCircle, DollarSign, ShieldAlert, ArrowUpRight } from 'lucide-react';

const fundingData = [
  { name: 'S', amount: 4000 },
  { name: 'M', amount: 5000 },
  { name: 'T', amount: 7500 },
  { name: 'W', amount: 6000 },
  { name: 'T', amount: 9000 },
  { name: 'F', amount: 4500 },
  { name: 'S', amount: 3000 },
];


const activeOfficers = [
  { id: 1, name: "Alexandra Deff", email: "alex@city.gov", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 2, name: "Edwin Adamike", email: "edwin@city.gov", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
];

const suspendedOfficers = [
  { id: 1, name: "Isaac Oluwatobiloba", email: "isaac@city.gov", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { id: 2, name: "David Oshodi", email: "david@city.gov", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100" },
];

const AdminHomeClient = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

      {/* THREE STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Citizen Card (Highlighting Style matching image) */}
        <div className="bg-[#1b4332] text-white p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-80">Total Citizens</span>
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight">24,580</h2>
            <p className="text-[11px] mt-1 opacity-70 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> +12% Increased from last month
            </p>
          </div>
        </div>

        {/* Solved Reports Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Solved Reports</span>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">1,240</h2>
            <p className="text-[11px] mt-1 text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" /> 84% Resolution Efficiency
            </p>
          </div>
        </div>

        {/* Total Funding Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Funding</span>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-full">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">$48,250</h2>
            <p className="text-[11px] mt-1 text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-blue-500" /> +8.2% Received this week
            </p>
          </div>
        </div>

      </div>

      {/* LOWER GRID: VISUAL CHART & OFFICERS MANAGEMENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project/Funding Analytics Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Funding Analytics</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly distribution breakdown of dynamic state funds.</p>
          </div>
          
          <div className="w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingData} barGap={8}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis hide={true} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#1b4332" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team/Officers Statistics Box Side-by-Side View */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Officers Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Overview of team states & accountability.</p>
          </div>

          <div className="space-y-4 flex-1">
            {/* Active Officers List */}
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">Active ({activeOfficers.length})</span>
              <div className="mt-2 space-y-2">
                {activeOfficers.map(officer => (
                  <div key={officer.id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={officer.img} alt={officer.name} className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{officer.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{officer.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspended Officers List */}
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                <ShieldAlert className="w-3 h-3" /> Suspended ({suspendedOfficers.length})
              </span>
              <div className="mt-2 space-y-2">
                {suspendedOfficers.map(officer => (
                  <div key={officer.id} className="flex items-center gap-3 p-2 rounded-xl border border-dashed border-red-100 dark:border-red-950/30 opacity-80 hover:opacity-100 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={officer.img} alt={officer.name} className="w-9 h-9 rounded-full object-cover filter grayscale" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{officer.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{officer.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminHomeClient;