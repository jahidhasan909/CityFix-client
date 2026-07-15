"use client";

import React from 'react';
import Link from 'next/link';
import { MoveLeft, HelpCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfcfb] to-[#eef7ea]/40 dark:from-[#09090b] dark:to-[#020202] px-6 py-12">
      
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#f05a28]/5 dark:bg-[#f05a28]/10 rounded-full blur-[120px] pointer-events-none" />

   
      <div className="absolute top-20 left-[15%] w-4 h-4 rounded-full border border-[#f05a28]/40 animate-bounce [animation-duration:4s]" />
      <div className="absolute bottom-28 right-[15%] w-6 h-6 rounded-full border border-slate-300 dark:border-slate-800 animate-pulse [animation-duration:6s]" />

      <div className="relative z-10 text-center max-w-lg mx-auto space-y-8">
        
       
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f05a28]/10 dark:bg-[#f05a28]/20 border border-[#f05a28]/20 text-[#f05a28] font-bold text-xs uppercase tracking-widest animate-pulse">
          <HelpCircle className="w-3.5 h-3.5" />
          Lost in Space
        </div>

        
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-slate-900 dark:text-white select-none">
            4<span className="text-[#f05a28] drop-shadow-[0_0_25px_rgba(240,90,40,0.4)]">0</span>4
          </h1>
          <div className="absolute -inset-x-10 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#f05a28]/20 to-transparent dark:via-[#f05a28]/40 -skew-y-3 pointer-events-none" />
        </div>

        
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Oops! The page you requested could not be found. Return to the homepage and continue exploring.
          </p>
        </div>

       
        <div className="pt-4">
          <Link href="/">
            <button className="group relative inline-flex items-center justify-center gap-2 bg-[#f05a28] hover:bg-[#d9481b] text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-300 text-sm md:text-base hover:cursor-pointer overflow-hidden">
           
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <MoveLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;