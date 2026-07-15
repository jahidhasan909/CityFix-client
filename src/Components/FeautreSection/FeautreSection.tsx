"use client";

import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Megaphone, 
  TreePine, 
  Activity, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="w-full py-20 bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
       
        <div className="space-y-3 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Why Choose CityFix
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed ">
           Discover the features that make CityFix the trusted platform for reporting issues, <br /> finding skilled professionals, and strengthening communities across Bangladesh.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          
          <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden group shadow-xs">
            <div className="space-y-4 max-w-md">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Report Civic Issues</h3>
              <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
                Easily report problems such as damaged roads, broken streetlights, drainage issues, waste management concerns, and other public service requests with detailed information and images.
              </p>
            </div>
  
            <div className="absolute bottom-0 right-0 bg-[#f8fafc] dark:bg-slate-950 pl-4 pt-4 rounded-tl-[24px]">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:border-emerald-500 transition-colors">
                File Report <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-7 flex flex-col justify-between min-h-[260px] shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center border border-rose-100/40 dark:border-rose-900/30">
                <MessageSquare className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-base font-bold tracking-tight">Community Discussions</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Join the conversation by commenting on public reports, sharing suggestions, and helping improve your community.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-4">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Active Threads: <span className="text-slate-900 dark:text-white font-extrabold">42 open</span>
            </div>
          </div>

          
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-7 flex flex-col justify-between min-h-[260px] shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                <Megaphone className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-base font-bold tracking-tight">Public Notices</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Stay informed with official announcements, important updates, and service notices published by administrators.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['URGENT', 'UPDATES', 'CIVIC'].map((tag) => (
                <span key={tag} className="text-[9px] font-bold tracking-wider px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-md text-slate-500 dark:text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-6 flex flex-col justify-between shadow-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                <span className="text-xl font-extrabold block">14</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Campaigns</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                <span className="text-xl font-extrabold block">850+</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Volunteers</span>
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-emerald-500" /> Community Campaigns
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                Participate in tree plantation drives, city clean-ups, and public awareness initiatives.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Platform Status:</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
              </span>
            </div>
          </div>

         
          <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
             
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center p-2 relative shrink-0">
                <div className="w-full h-full rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-md tracking-wider">
                  Live Tracking
                </span>
                <h3 className="text-lg font-bold tracking-tight">Track Report Progress</h3>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm">
                  Monitor the status of reported issues from submission to completion with clear and transparent progress updates.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#f8fafc] dark:bg-slate-950 pl-4 pt-4 rounded-tl-[24px]">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:border-emerald-500 transition-colors">
                View Progress <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-base font-bold tracking-tight">Issue Management</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Administrators and officers efficiently manage reports, update issue statuses, and ensure timely resolution.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-slate-400 rounded-full" /> Compliance</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Secured
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;