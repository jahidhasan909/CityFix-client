"use client";

import React from 'react';
import { Leaf, Users2, Building2, Heart } from 'lucide-react';

const StrongBuildSection = () => {
  return (
    <section className="w-full py-24 bg-[#1b2833] text-white overflow-hidden relative">
      {/* Background Subtle Lines Group */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
          <path d="M0,90 Q30,60 60,80 T100,50" />
          <path d="M0,80 Q40,50 50,90 T100,70" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE: HEADER AND IMAGE PANEL */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Together We Build Better Communities
              </h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {"Every small action matters. When citizens, officers, and communities work together with responsibility and care, we can create cleaner streets, safer neighborhoods, and a city we're all proud to call home."}
              </p>
            </div>

            {/* Premium Dribbble Styled Image/Asset Wrapper from Screenshot */}
            <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden bg-slate-800/40 border border-slate-700/50 p-4 relative group shadow-2xl">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-slate-800/60 flex flex-col justify-between p-6 overflow-hidden relative">
                {/* Decorative Grid Light Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-900/40">
                    CityFix Ecosystem
                  </span>
                </div>
                
                {/* Visual Glass Box Mockup inside the asset area */}
                <div className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md space-y-2 mt-auto z-10">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    Collaborative dashboard enabling rapid report distribution, tracking, and municipal campaign deployments across sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: STACKED CARD LIST */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* CARD 1: Every Action Counts */}
            <div className="w-full bg-[#22313f] border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#253646] group">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-400 group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-white">
                  Every Action Counts
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  A single report or a small act of responsibility can inspire meaningful change and make our community better for everyone.
                </p>
              </div>
            </div>

            {/* CARD 2: Stronger Together */}
            <div className="w-full bg-[#22313f] border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#253646] group">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-blue-400 group-hover:scale-105 transition-transform">
                <Users2 className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-white">
                  Stronger Together
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Real progress happens when citizens and local authorities work side by side with trust, cooperation, and a shared purpose.
                </p>
              </div>
            </div>

            {/* CARD 3: Building Better Communities */}
            <div className="w-full bg-[#22313f] border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#253646] group">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-purple-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-white">
                  Building Better Communities
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Clean streets, safe neighborhoods, and well-maintained public spaces begin with the collective effort of every community member.
                </p>
              </div>
            </div>

            {/* CARD 4: Be the Change */}
            <div className="w-full bg-[#22313f] border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#253646] group">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-rose-400 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-white">
                  Be the Change
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Your voice, your actions, and your participation can inspire others and help create a city where everyone enjoys a better quality of life.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default StrongBuildSection;