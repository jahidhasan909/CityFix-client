"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';

// Default Fallbacks
const DEFAULT_FUNDING_DATA = [
  { name: 'S', amount: 4000 },
  { name: 'M', amount: 5000 },
  { name: 'T', amount: 7500 },
  { name: 'W', amount: 6000 },
  { name: 'T', amount: 9000 },
  { name: 'F', amount: 4500 },
  { name: 'S', amount: 3000 },
];

const HomeDashboardOfficer = () => {
  // 1. STATE MANAGEMENT
  const [funding, setFunding] = useState({ total: 0, chartData: DEFAULT_FUNDING_DATA, trend: 0 });
  const [reports, setReports] = useState({ solved: 0, efficiency: 0 });
  const [citizens, setCitizens] = useState({ active: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // 2. DATA FETCHING
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all three endpoints concurrently
        const [fundingRes, reportsRes, userRes] = await Promise.all([
          fetch(`${baseUrl}/api/funding`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch funding data');
            return res.json();
          }),
          fetch(`${baseUrl}/api/reports`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch reports data');
            return res.json();
          }),
          fetch(`${baseUrl}/api/usercollaction`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch user collection data');
            return res.json();
          })
        ]);

        // ১. ফান্ডিং ডাটা প্রসেসিং (টোটাল হিসাব করা)
        let totalSum = 0;
        let mappedChartData = [];

        if (Array.isArray(fundingRes)) {
          totalSum = fundingRes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
          mappedChartData = fundingRes.map(item => ({
            name: item.name || 'Day',
            amount: Number(item.amount) || 0
          }));
        } else if (fundingRes && typeof fundingRes === 'object') {
          totalSum = fundingRes.total ?? 0;
          mappedChartData = fundingRes.chartData ?? [];
        }

        setFunding({
          total: totalSum,
          chartData: mappedChartData.length > 0 ? mappedChartData : DEFAULT_FUNDING_DATA,
          trend: fundingRes.trend ?? 8.2
        });

        // ২. রিপোর্টস ডাটা প্রসেসিং (শুধুমাত্র 'resolved' স্ট্যাটাস কাউন্ট করা)
        let solvedCount = 0;
        let efficiencyRate = 0;

        if (Array.isArray(reportsRes)) {
          const totalReports = reportsRes.length;
          solvedCount = reportsRes.filter(report => report.status === 'resolved').length;
          efficiencyRate = totalReports > 0 ? Math.round((solvedCount / totalReports) * 100) : 0;
        } else if (reportsRes && typeof reportsRes === 'object') {
          solvedCount = reportsRes.solved ?? 0;
          efficiencyRate = reportsRes.efficiency ?? 0;
        }

        setReports({
          solved: solvedCount,
          efficiency: efficiencyRate
        });

        // ৩. সিটিজেনস ডাটা প্রসেসিং (শুধুমাত্র 'citizen' রোলের active এবং blocked হিসাব করা)
        let activeCount = 0;
        let blockedCount = 0;

        if (Array.isArray(userRes)) {
          // ব্যাকএন্ড যদি ডিরেক্ট এরে দেয়, তাহলে ফ্রন্টএন্ড থেকেই ফিল্টারিং হ্যান্ডেল করবে
          const citizenOnly = userRes.filter(user => user.role === 'citizen');
          activeCount = citizenOnly.filter(user => user.status === 'active').length;
          blockedCount = citizenOnly.filter(user => user.status === 'blocked' || user.status === 'suspended').length;
        } else if (userRes && typeof userRes === 'object') {
          activeCount = userRes.active ?? 0;
          blockedCount = userRes.blocked ?? 0;
        }

        setCitizens({
          active: activeCount,
          blocked: blockedCount
        });

        setError(null);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
       
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [baseUrl]);

  // Compute values dynamically
  const totalCitizens = citizens.active + citizens.blocked;
  const citizenPieData = [
    { name: 'Active Citizens', value: citizens.active, color: '#1b4332' },
    { name: 'Blocked Citizens', value: citizens.blocked, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 mt-2 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* ERROR NOTICE */}
      {error && (
        <div className="p-3 text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 rounded-xl">
          {error}
        </div>
      )}

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
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Active Profile Baseline
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
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {reports.solved.toLocaleString()}
            </h2>
            <p className="text-[11px] mt-1 text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" /> {reports.efficiency}% Resolution Efficiency
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
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              ${funding.total.toLocaleString()}
            </h2>
            <p className="text-[11px] mt-1 text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-blue-500" /> {funding.trend >= 0 ? `+${funding.trend}%` : `${funding.trend}%`} dynamic shift
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
              <BarChart data={funding.chartData} barGap={8}>
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
            {totalCitizens > 0 ? (
              <>
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
                    {Math.round((citizens.active / totalCitizens) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Active</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">No Citizen Profile Data</div>
            )}
          </div>

          <div className="flex items-center justify-around border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            {citizenPieData.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name.split(' ')[0]}
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

// Pure routing Wrapper Component
const OfficerHomepage = () => {
  return (
    <div>
      <HomeDashboardOfficer />
    </div>
  );
};

export default OfficerHomepage;