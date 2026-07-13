"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, DollarSign, ArrowUpRight } from 'lucide-react';


const fundingData = [
  { name: 'S', amount: 4000 },
  { name: 'M', amount: 5000 },
  { name: 'T', amount: 7500 },
  { name: 'W', amount: 6000 },
  { name: 'T', amount: 9000 },
  { name: 'F', amount: 4500 },
  { name: 'S', amount: 3000 },
];


const citizenPieData = [
  { name: 'Active Citizens', value: 22180, color: '#1b4332' }, 
  { name: 'Blocked Citizens', value: 2400, color: '#ef4444' }, 
];

const HomeDashboardOfficer = () => {
  
  const totalCitizens = citizenPieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

      {/* THREE STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Citizen Card */}
        <div className="bg-[#1b4332] text-white p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-80">Total Citizens</span>
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight">{totalCitizens.toLocaleString()}</h2>
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

      {/* BOTH CHARTS SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funding Analytics Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Funding Analytics</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly distribution breakdown of dynamic state funds.</p>
          </div>
          
          <div className="w-full h-64 mt-4">
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

        {/* Citizen Status Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Citizen Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ratio between active and blocked profiles.</p>
          </div>

          {/* Chart Wrapper with Center Text Layer */}
          <div className="w-full h-52 relative mt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Pie
                  data={citizenPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {citizenPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            
            <div className="absolute text-center flex flex-col">
              <span className="text-2xl font-bold text-slate-950 dark:text-white">
                {Math.round((citizenPieData[0].value / totalCitizens) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Active</span>
            </div>
          </div>

          
          <div className="flex items-center justify-around border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            {citizenPieData.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name.split(' ')[0]} {/* Active  Blocked  */}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white pl-4">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default HomeDashboardOfficer;