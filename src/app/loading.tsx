"use client";

import React from 'react';
import Image from 'next/image';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#09090b] transition-colors duration-300">
      
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#f05a28]/10 dark:bg-[#f05a28]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#f05a28]/10 dark:bg-[#f05a28]/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000" />

      
      <div className="relative flex flex-col items-center">
        
        
        <div className="relative w-24 h-24 flex items-center justify-center">
          
          
          <div className="absolute inset-0 rounded-full border-2 border-t-[#f05a28] border-r-[#f05a28]/30 border-b-[#f05a28]/10 border-l-[#f05a28]/10 animate-spin [animation-duration:1.2s]" />
          
         
          <div className="absolute inset-2 rounded-full bg-[#f05a28]/10 dark:bg-[#f05a28]/15 animate-ping opacity-75" />
          
          
          <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            <Image
              width={34}
              height={33}
              alt="logo"
              className="object-cover h-[29px] md:h-[34px] w-auto animate-pulse"
              src="https://i.ibb.co.com/Q54kMTN/Chat-GPT-Image-Jul-12-2026-at-04-36-38-AM-removebg-preview.png"
              priority
            />
          </div>
        </div>

       
        <div className="mt-6 flex flex-col items-center space-y-2 text-center">
          
       
          <h1 className="text-xl font-black tracking-wider text-slate-800 dark:text-white uppercase">
            City<span className="text-[#f05a28]">Fix</span>
          </h1>

          
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
              Loading
            </span>
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#f05a28] animate-bounce" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Loading;