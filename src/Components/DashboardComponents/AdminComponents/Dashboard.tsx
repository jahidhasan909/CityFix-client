"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, CheckCircle, DollarSign, ShieldAlert, ArrowUpRight, Loader2 } from 'lucide-react';
import Loading from '@/app/loading';


interface FundingItem {
  name: string;
  amount: number;
}

interface FundingState {
  total: number;
  chartData: FundingItem[];
  trend: number;
}

interface ReportsState {
  solved: number;
  efficiency: number;
}

interface Officer {
  id: string | number;
  name: string;
  email: string;
  img: string;
}


interface DBUserResponse {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  image?: string;
  img?: string;
}

interface DBReportResponse {
  _id?: string;
  status?: string;
}

interface DBFundingResponse {
  _id?: string;
  name?: string;
  amount?: number | string;
}

interface CombinedFundingObj {
  total?: number;
  trend?: number;
  chartData?: FundingItem[];
}


const DEFAULT_FUNDING_DATA: FundingItem[] = [
  { name: 'S', amount: 4000 },
  { name: 'M', amount: 5000 },
  { name: 'T', amount: 7500 },
  { name: 'W', amount: 6000 },
  { name: 'T', amount: 9000 },
  { name: 'F', amount: 4500 },
  { name: 'S', amount: 3000 },
];

const AdminHomeClient: React.FC = () => {
 
  const [funding, setFunding] = useState<FundingState>({ 
    total: 0, 
    chartData: DEFAULT_FUNDING_DATA, 
    trend: 0 
  });
  const [reports, setReports] = useState<ReportsState>({ 
    solved: 0, 
    efficiency: 0 
  });
  const [citizensCount, setCitizensCount] = useState<number>(0);
  const [activeOfficers, setActiveOfficers] = useState<Officer[]>([]);
  const [suspendedOfficers, setSuspendedOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || '';

 
  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        setLoading(true);

        
        const [fundingRes, reportsRes, userRes] = await Promise.all([
          fetch(`${baseUrl}/api/funding`).then((res): Promise<DBFundingResponse[] | CombinedFundingObj> => {
            if (!res.ok) throw new Error('Failed to fetch funding');
            return res.json();
          }),
          fetch(`${baseUrl}/api/reports`).then((res): Promise<DBReportResponse[]> => {
            if (!res.ok) throw new Error('Failed to fetch reports');
            return res.json();
          }),
          fetch(`${baseUrl}/api/usercollaction`).then((res): Promise<DBUserResponse[]> => {
            if (!res.ok) throw new Error('Failed to fetch user collection');
            return res.json();
          })
        ]);

        
        let totalSum = 0;
        let mappedChartData: FundingItem[] = [];
        let trendValue = 8.2;

        if (Array.isArray(fundingRes)) {
          totalSum = fundingRes.reduce((acc: number, curr: DBFundingResponse) => acc + (Number(curr.amount) || 0), 0);
          mappedChartData = fundingRes.map((item: DBFundingResponse) => ({
            name: item.name || 'Day',
            amount: Number(item.amount) || 0
          }));
        } else if (fundingRes && typeof fundingRes === 'object') {
          totalSum = fundingRes.total ?? 0;
          mappedChartData = fundingRes.chartData ?? [];
          trendValue = fundingRes.trend ?? 8.2;
        }

        setFunding({
          total: totalSum,
          chartData: mappedChartData.length > 0 ? mappedChartData : DEFAULT_FUNDING_DATA,
          trend: trendValue
        });

        
        let solvedCount = 0;
        let efficiencyRate = 0;

        if (Array.isArray(reportsRes)) {
          const totalReports = reportsRes.length;
          solvedCount = reportsRes.filter((report: DBReportResponse) => report.status === 'resolved').length;
          efficiencyRate = totalReports > 0 ? Math.round((solvedCount / totalReports) * 100) : 0;
        }

        setReports({
          solved: solvedCount,
          efficiency: efficiencyRate
        });

        
        if (Array.isArray(userRes)) {
        
          const totalCitizens = userRes.filter((user: DBUserResponse) => user.role === 'citizen').length;
          setCitizensCount(totalCitizens);

          
          const officers = userRes.filter((user: DBUserResponse) => user.role === 'officer');
          
          const activeList: Officer[] = officers
            .filter((off: DBUserResponse) => off.status === 'active')
            .map((off: DBUserResponse, index: number) => ({
              id: off._id || `active-off-${index}`,
              name: off.name || 'Officer',
              email: off.email || '',
              img: off.image || off.img || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
            }));

          const suspendedList: Officer[] = officers
            .filter((off: DBUserResponse) => off.status === 'suspended' || off.status === 'blocked')
            .map((off: DBUserResponse, index: number) => ({
              id: off._id || `suspended-off-${index}`,
              name: off.name || 'Officer',
              email: off.email || '',
              img: off.image || off.img || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
            }));

          setActiveOfficers(activeList);
          setSuspendedOfficers(suspendedList);
        }

        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "";
        console.error("Admin Dashboard Fetch Error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, [baseUrl]);

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <div className="space-y-6 p-4 md:p-6  dark:bg-slate-950 min-h-screen">
      
      
      {error && (
        <div className="p-3 text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 rounded-xl">
          {error}
        </div>
      )}

      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
       
        <div className="bg-[#f05a28] text-white p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-80">Total Citizens</span>
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight">{citizensCount.toLocaleString()}</h2>
            <p className="text-[11px] mt-1 opacity-70 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Active Profile Baseline
            </p>
          </div>
        </div>

     
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

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Funding Analytics</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly distribution breakdown of dynamic state funds.</p>
          </div>
          
          <div className="w-full h-56 mt-4">
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
                  fill="#f05a28" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Officers Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Overview of team states & accountability.</p>
          </div>

          <div className="space-y-4 flex-1">
           
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Active ({activeOfficers.length})
              </span>
              <div className="mt-2 space-y-2">
                {activeOfficers.length > 0 ? (
                  activeOfficers.map((officer: Officer) => (
                    <div key={officer.id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                      <img src={officer.img} alt={officer.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{officer.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{officer.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic pl-1">No active officers found</p>
                )}
              </div>
            </div>

          
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                <ShieldAlert className="w-3 h-3" /> Suspended ({suspendedOfficers.length})
              </span>
              <div className="mt-2 space-y-2">
                {suspendedOfficers.length > 0 ? (
                  suspendedOfficers.map((officer: Officer) => (
                    <div key={officer.id} className="flex items-center gap-3 p-2 rounded-xl border border-dashed border-red-100 dark:border-red-950/30 opacity-80 hover:opacity-100 transition-all">
                      <img src={officer.img} alt={officer.name} className="w-9 h-9 rounded-full object-cover filter grayscale" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{officer.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{officer.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic pl-1">No suspended officers found</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};


const OfficerHomepage: React.FC = () => {
  return (
    <div>
      <AdminHomeClient />
    </div>
  );
};

export default OfficerHomepage;