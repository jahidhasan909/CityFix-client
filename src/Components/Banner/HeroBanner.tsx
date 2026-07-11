"use client";

import React from 'react';

import { Button } from "@/Components/ui/button";
import { Lottie } from './Lottie';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full  flex flex-col lg:flex-row items-center justify-between overflow-hidden px-6 sm:px-12 lg:px-24 py-16 lg:py-0">
      

      <div className="relative z-20 w-full lg:w-1/2 text-white order-2 lg:order-1 flex flex-col justify-center">
       
        <div className="absolute -top-16 left-0 text-[7rem] font-bold text-white/[0.025] select-none tracking-wider font-sans pointer-events-none hidden sm:block">
          Future
        </div>

    
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 text-slate-100">
          Map Design
        </h1>

        
        <div className="h-[3px] bg-[#10b981] w-[60px] mb-6" />

        
        <p className="text-slate-400 text-base sm:text-lg max-w-md leading-relaxed mb-8">
          Map data visualization will be widely used in various industries and will play a powerful role in the future.
        </p>

     
        <div>
          <Button 
            className="bg-[#10b981] hover:bg-[#059669] text-white font-semibold tracking-wider px-8 py-6 rounded-md text-sm shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all w-fit"
          >
            GET STARTED
          </Button>
        </div>
      </div>

            <div className="relative z-10 w-full lg:w-1/2 order-1 lg:order-2 flex items-center justify-center mb-10 lg:mb-0">
        <div className="relative w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[550px] aspect-square flex items-center justify-center">
          
          
          <div className="absolute w-72 h-72 rounded-full  blur-[80px]" />

   
          {/* <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="https://i.ibb.co.com/hRdH8ZyX/images-removebg-preview.png"
              alt="Visualization Graphics"
              width={700}
              height={700}
              className="object-cover w-full h-full"
              priority
            />
          </div> */}

          <Lottie></Lottie>

        </div>
      </div>

    </div>
  );
};

export default HeroBanner;