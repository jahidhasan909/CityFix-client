"use client";

import React from 'react';
import { Leaf, Users2, Building2, Heart } from 'lucide-react';
import Image from 'next/image';

const StrongBuildSection = () => {
  return (
    <section className="w-full py-24 bg-[#FFF8F5] text-[#0F172A] dark:bg-black  overflow-hidden relative">
     
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] opacity-[0.06] pointer-events-none select-none text-[#d9481b]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
          <path d="M0,90 Q30,60 60,80 T100,50" />
          <path d="M0,80 Q40,50 50,90 T100,70" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
         
          <div className="lg:col-span-5 space-y-3  lg:sticky lg:top-12">
            <div className=" space-y-1">
              <h2 className="text-2xl dark:text-white md:text-3xl font-extrabold tracking-tight leading-tight text-[#0F172A]">
               United for Change
              </h2>
              <p className="text-xs md:text-base text-[#64748B] leading-relaxed font-medium">
                Inspiring change through community action.
              </p>
            </div>

         
            <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden bg-[#FFFFFF] border border-[#F3D2C7] p-4 relative group shadow-xl shadow-[#d9481b]/5">
              <div className="w-full h-full rounded-[20px] border border-[#F3D2C7] flex flex-col justify-between p-6 overflow-hidden relative">
                
                
                <Image 
                  src="https://i.ibb.co.com/yFywG2Vb/male-silhouette-figure-waving-bangladesh-flag-3d-rendering-601748-32418.avif" 
                  alt="Bangladesh Flag Ecosystem"
                  fill
                  priority
                  className="object-cover opacity-[0.85] grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent z-0" />
                
                <div className="flex justify-between items-start z-10">
           
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9481b] bg-[#d9481b]/10 px-2.5 py-1 rounded-md border border-[#F3D2C7]">
                    CityFix Ecosystem
                  </span>
                </div>
                
                
                <div className="w-full p-4 rounded-xl bg-[#FFFFFF]/90 border border-[#F3D2C7] backdrop-blur-md space-y-2 mt-auto z-10 shadow-sm">
                  <div className="flex gap-1.5">
                    
                    <span className="w-2 h-2 rounded-full bg-[#d9481b]" />
                    <span className="w-2 h-2 rounded-full bg-[#d9481b]/40" />
                    <span className="w-2 h-2 rounded-full bg-[#d9481b]/20" />
                  </div>
                  <p className="text-[11px] text-[#64748B] font-medium leading-normal">
                    Collaborative dashboard enabling rapid report distribution, tracking, and municipal campaign deployments across sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>

           <div className="lg:col-span-7 space-y-5">
            
           
            <div className="w-full bg-[#FFFFFF] border border-[#F3D2C7] rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-[#d9481b]/50 hover:bg-[#FFF8F5]/50 group shadow-sm">
             
              <div className="p-2.5 rounded-xl bg-[#d9481b]/10 border border-[#F3D2C7] text-[#d9481b] group-hover:bg-[#d9481b] group-hover:text-white transition-all">
                <Leaf className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#d9481b] transition-colors">
                  Every Action Counts
                </h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
                  A single report or a small act of responsibility can inspire meaningful change and make our community better for everyone.
                </p>
              </div>
            </div>

          
            <div className="w-full bg-[#FFFFFF] border border-[#F3D2C7] rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-[#d9481b]/50 hover:bg-[#FFF8F5]/50 group shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#d9481b]/10 border border-[#F3D2C7] text-[#d9481b] group-hover:bg-[#d9481b] group-hover:text-white transition-all">
                <Users2 className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#d9481b] transition-colors">
                  Stronger Together
                </h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
                  Real progress happens when citizens and local authorities work side by side with trust, cooperation, and a shared purpose.
                </p>
              </div>
            </div>

          
            <div className="w-full bg-[#FFFFFF] border border-[#F3D2C7] rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-[#d9481b]/50 hover:bg-[#FFF8F5]/50 group shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#d9481b]/10 border border-[#F3D2C7] text-[#d9481b] group-hover:bg-[#d9481b] group-hover:text-white transition-all">
                <Building2 className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#d9481b] transition-colors">
                  Building Better Communities
                </h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
                  Clean streets, safe neighborhoods, and well-maintained public spaces begin with the collective effort of every community member.
                </p>
              </div>
            </div>

            
            <div className="w-full bg-[#FFFFFF] border border-[#F3D2C7] rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-4 items-start transition-all duration-300 hover:border-[#d9481b]/50 hover:bg-[#FFF8F5]/50 group shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#d9481b]/10 border border-[#F3D2C7] text-[#d9481b] group-hover:bg-[#d9481b] group-hover:text-white transition-all">
                <Heart className="w-4 h-4 md:w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#d9481b] transition-colors">
                  Be the Change
                </h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
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