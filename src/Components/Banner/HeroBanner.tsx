"use client";

import React from 'react';
import AnimatedParagraph from './PAnimation';
import { IoIosPerson } from "react-icons/io";
import { Tent, TentTree } from 'lucide-react';

interface BuildingConfig {
  id: number;
  x: number;
  w: number;
  h: number;
  type: 'grid' | 'stripes' | 'dots' | 'slanted' | 'spire' | 'horizontal';
}

interface CloudConfig {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
}

const HeroBanner: React.FC = () => {

  const buildings: BuildingConfig[] = [
    { id: 1, x: 40, w: 80, h: 100, type: 'horizontal' },
    { id: 2, x: 115, w: 70, h: 240, type: 'stripes' },
    { id: 3, x: 195, w: 90, h: 150, type: 'grid' },
    { id: 4, x: 290, w: 60, h: 290, type: 'dots' },
    { id: 5, x: 360, w: 110, h: 180, type: 'grid' },
    { id: 6, x: 480, w: 80, h: 220, type: 'stripes' },
    { id: 7, x: 570, w: 70, h: 160, type: 'horizontal' },
    { id: 8, x: 650, w: 85, h: 320, type: 'spire' },
    { id: 9, x: 745, w: 90, h: 190, type: 'grid' },
    { id: 10, x: 845, w: 80, h: 270, type: 'slanted' },
    { id: 11, x: 935, w: 70, h: 170, type: 'horizontal' },
    { id: 12, x: 1015, w: 60, h: 310, type: 'stripes' },
    { id: 13, x: 1085, w: 100, h: 155, type: 'grid' },
    { id: 14, x: 1195, w: 70, h: 235, type: 'dots' },
    { id: 15, x: 1275, w: 110, h: 180, type: 'grid' },
    { id: 16, x: 1395, w: 70, h: 280, type: 'stripes' },
    { id: 17, x: 1475, w: 90, h: 160, type: 'horizontal' },
    { id: 18, x: 1575, w: 70, h: 250, type: 'slanted' },
    { id: 19, x: 1655, w: 80, h: 185, type: 'grid' },
    { id: 20, x: 1745, w: 90, h: 130, type: 'horizontal' },
  ];

  const trees = [
    { x: 30, scale: 0.8 },
    { x: 110, scale: 0.6 },
    { x: 190, scale: 0.7 },
    { x: 285, scale: 0.95 },
    { x: 470, scale: 0.8 },
    { x: 560, scale: 0.7 },
    { x: 735, scale: 0.85 },
    { x: 925, scale: 0.75 },
    { x: 1010, scale: 0.8 },
    { x: 1180, scale: 0.65 },
    { x: 1265, scale: 0.85 },
    { x: 1385, scale: 0.75 },
    { x: 1470, scale: 0.8 },
    { x: 1645, scale: 0.7 },
    { x: 1735, scale: 0.9 },
  ];

  const clouds: CloudConfig[] = [
    { id: 1, x: 0, y: 30, scale: 1, duration: 80, delay: -10 },
    { id: 2, x: 300, y: 75, scale: 0.85, duration: 110, delay: -45 },
    { id: 3, x: 600, y: 40, scale: 0.7, duration: 140, delay: -90 },
    { id: 4, x: 950, y: 85, scale: 0.9, duration: 95, delay: -25 },
    { id: 5, x: 1300, y: 25, scale: 0.75, duration: 125, delay: -60 },
    { id: 6, x: 150, y: 95, scale: 0.65, duration: 150, delay: -110 },
    { id: 7, x: 450, y: 20, scale: 0.8, duration: 105, delay: -35 }, 
    { id: 8, x: 800, y: 60, scale: 0.95, duration: 85, delay: -15 },
    { id: 9, x: 1150, y: 45, scale: 0.7, duration: 135, delay: -75 },
    { id: 10, x: 1600, y: 70, scale: 0.85, duration: 115, delay: -50 }
  ];

  const y_base = 380;
  const dx = 15;
  const dy = -12;

  const renderWindows = (
    b: BuildingConfig,
    x1: number,
    x2: number,
    y2_left: number,
    y1: number
  ) => {
    const strokeColor = "#475569";
    const strokeWidth = "1";

    if (b.type === 'horizontal') {
      const lines = [];
      const step = 14;
      for (let currY = y2_left + 15; currY < y1 - 10; currY += step) {
        lines.push(
          <line
            key={`h-${currY}`}
            x1={x1 + 6}
            y1={currY}
            x2={x2 - 6}
            y2={currY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray="2 2"
          />
        );
      }
      return lines;
    }

    if (b.type === 'stripes') {
      const lines = [];
      const step = 9;
      for (let currX = x1 + 8; currX < x2 - 4; currX += step) {
        lines.push(
          <line
            key={`v-${currX}`}
            x1={currX}
            y1={y2_left + 12}
            x2={currX}
            y2={y1 - 4}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    if (b.type === 'grid') {
      const dots = [];
      const colStep = 10;
      const rowStep = 15;
      let dotId = 0;
      for (let currX = x1 + 8; currX < x2 - 5; currX += colStep) {
        for (let currY = y2_left + 14; currY < y1 - 14; currY += rowStep) {
          dots.push(
            <rect
              key={`dot-${dotId++}`}
              x={currX}
              y={currY}
              width="2.5"
              height="4.5"
              fill="#64748b"
              rx="0.5"
            />
          );
        }
      }
      return dots;
    }

    if (b.type === 'dots') {
      const dots = [];
      const colStep = 9;
      const rowStep = 12;
      let dotId = 0;
      for (let currX = x1 + 8; currX < x2 - 5; currX += colStep) {
        for (let currY = y2_left + 12; currY < y1 - 12; currY += rowStep) {
          dots.push(
            <circle
              key={`dot-${dotId++}`}
              cx={currX}
              cy={currY}
              r="1.2"
              fill="#475569"
            />
          );
        }
      }
      return dots;
    }

    if (b.type === 'slanted') {
      const lines = [];
      const step = 14;
      const h = y1 - y2_left;
      for (let offset = 12; offset < h - 12; offset += step) {
        lines.push(
          <line
            key={`diag-${offset}`}
            x1={x1 + 6}
            y1={y2_left + offset}
            x2={x2 - 6}
            y2={y2_left + offset - 8}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    return null;
  };

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#eef7ea] via-[#ffffff] to-[#fef3ec] dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-black pb-0">

      {/* Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes textFloating {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-4px);
            opacity: 0.25;
          }
        }
        .bg-text-animate {
          animation: textFloating 6s ease-in-out infinite;
        }

        @keyframes neonBreath {
          0%, 100% {
            opacity: 0.25;
            stroke: #f59e0b;
            filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.35)) blur(1px);
          }
          50% {
            opacity: 0.95;
            stroke: #f97316;
            filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.9)) blur(2px);
          }
        }
        .neon-glow {
          animation: neonBreath 4.5s ease-in-out infinite;
        }

        @keyframes sunRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sun-group {
          transform-origin: 220px 70px;
          animation: sunRotate 35s linear infinite;
        }

        @keyframes sunPulse {
          0%, 100% {
            filter: drop-shadow(0 0 3px rgba(240, 90, 40, 0.4));
            opacity: 0.85;
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(240, 90, 40, 0.9));
            opacity: 1;
          }
        }
        .sun-core {
          animation: sunPulse 3.5s ease-in-out infinite;
        }

        @keyframes dynamicCloudDrift {
          0% { transform: translateX(-300px); }
          100% { transform: translateX(2100px); }
        }
      ` }} />

      
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6 flex flex-col items-center pt-28  md:pt-33 pb-40 sm:pb-52 lg:pb-60">
        
      
        <div className="relative w-full flex justify-center mb-3 pointer-events-none select-none">
          <span className="bg-text-animate font-sans font-extrabold tracking-[0.9em] text-[10px] sm:text-xs uppercase text-[#f05a28]/60 dark:text-[#f05a28]/40 pl-[0.9em]">
            — future —
          </span>
        </div>

        {/* Core Headline */}
        <h1 className="relative text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight dark:text-white max-w-3xl font-sans drop-shadow-sm z-10">
          {"Together, Let's Build a Better "}<span className='text-[#f05a28]'>Bangladesh</span>.
        </h1>

        <AnimatedParagraph />

        {/* CTA Buttons */}
        <div className="flex flex-row items-center justify-center gap-4 mt-8 z-10">
          <button className="bg-[#f05a28] hover:bg-[#d9481b] text-white font-semibold px-5 py-3 rounded-full shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all text-sm md:text-base flex items-center gap-2 cursor-pointer">
            Join as a Citizen <span className='mt-0.5'><IoIosPerson /></span>
          </button>
          <button className="bg-white hover:bg-slate-50 text-[#0f172a] font-semibold px-6 py-3 rounded-full border border-slate-200 flex  items-center gap-2 shadow-sm transition-all text-sm md:text-base cursor-pointer">
            Discover Campaigns <span className='mt-0.5'><Tent size={16} /></span>
          </button>
        </div>
      </div>

      {/* Bottom Illustration Area */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px] pointer-events-none z-10 overflow-hidden">
        <svg
          viewBox="0 0 1920 400"
          className="w-full h-full object-bottom"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="neon-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cloud Layer */}
          <g fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
            {clouds.map((cloud) => (
              <g 
                key={`cloud-group-${cloud.id}`} 
                style={{
                  animation: `dynamicCloudDrift ${cloud.duration}s linear infinite`,
                  animationDelay: `${cloud.delay}s`
                }}
              >
                <g transform={`translate(${cloud.x}, ${cloud.y}) scale(${cloud.scale})`}>
                  <path 
                    d="M 25 50 a 16 16 0 0 1 24 -12 a 20 20 0 0 1 36 0 a 16 16 0 0 1 24 12 a 12 12 0 0 1 0 24 l -84 0 a 12 12 0 0 1 0 -24 Z" 
                    fill="white" 
                    fillOpacity="0.85" 
                  />
                </g>
              </g>
            ))}
          </g>

          {/* Sun Element */}
          <g transform="translate(0, 0)">
            <circle cx="220" cy="70" r="22" fill="#f05a28" className="sun-core" />
            <g className="sun-group">
              <circle cx="220" cy="70" r="22" fill="none" stroke="#f05a28" strokeWidth="2.5" />
              <line x1="220" y1="34" x2="220" y2="20" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="220" y1="106" x2="220" y2="120" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="184" y1="70" x2="170" y2="70" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="256" y1="70" x2="270" y2="70" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="202" y1="52" x2="192" y2="42" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="238" y1="88" x2="248" y2="98" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="202" y1="88" x2="192" y2="98" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="238" y1="52" x2="248" y2="42" stroke="#f05a28" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          {/* Neon Glow Layer */}
          <g className="neon-glow" filter="url(#neon-blur)" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
            {buildings.map((b) => {
              const front_w = b.w * 0.73;
              const x1 = b.x;
              const x2 = b.x + front_w;
              const x3 = x2 + dx;
              const y1 = y_base;
              const y2 = y_base - b.h;

              const isSlanted = b.type === 'slanted';
              const y2_left = y2;
              const y2_right = isSlanted ? y2 - 20 : y2;

              const y3_left = y2_left + dy;
              const y3_right = y2_right + dy;
              const y1_dy = y1 + dy;

              return (
                <g key={`neon-${b.id}`}>
                  <polygon points={`${x1},${y1} ${x1},${y2_left} ${x2},${y2_right} ${x2},${y1}`} />
                  <polygon points={`${x2},${y1} ${x2},${y2_right} ${x3},${y3_right} ${x3},${y1_dy}`} />
                  <polygon points={`${x1},${y2_left} ${x1 + dx},${y3_left} ${x3},${y3_right} ${x2},${y2_right}`} />
                </g>
              );
            })}
          </g>

          {/* Core Buildings Vector Graphic */}
          <g stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            {buildings.map((b) => {
              const front_w = b.w * 0.73;
              const x1 = b.x;
              const x2 = b.x + front_w;
              const x3 = x2 + dx;
              const y1 = y_base;
              const y2 = y_base - b.h;

              const isSlanted = b.type === 'slanted';
              const y2_left = y2;
              const y2_right = isSlanted ? y2 - 20 : y2;

              const y3_left = y2_left + dy;
              const y3_right = y2_right + dy;
              const y1_dy = y1 + dy;

              return (
                <g key={`building-${b.id}`}>
                  <polygon points={`${x1},${y1} ${x1},${y2_left} ${x2},${y2_right} ${x2},${y1}`} fill="#ffffff" />
                  <polygon points={`${x2},${y1} ${x2},${y2_right} ${x3},${y3_right} ${x3},${y1_dy}`} fill="#f8fafc" />
                  <polygon points={`${x1},${y2_left} ${x1 + dx},${y3_left} ${x3},${y3_right} ${x2},${y2_right}`} fill="#ffffff" />

                  {renderWindows(b, x1, x2, y2_left, y1)}

                  {b.type === 'spire' && (
                    <>
                      <line x1={x1 + front_w / 2} y1={y2_left} x2={x1 + front_w / 2} y2={y2_left - 45} stroke="#0f172a" strokeWidth="1.8" />
                      <circle cx={x1 + front_w / 2} cy={y2_left - 45} r="3" fill="#f05a28" stroke="#0f172a" strokeWidth="1.2" />
                    </>
                  )}
                </g>
              );
            })}
          </g>

          {/* Front Trees Vector Layer */}
          <g stroke="#0f172a" strokeWidth="1.5">
            {trees.map((t, idx) => (
              <g key={`tree-${idx}`} transform={`translate(${t.x}, ${y_base}) scale(${t.scale})`}>
                <rect x="-1.5" y="-10" width="3" height="10" fill="#78350f" stroke="#0f172a" strokeWidth="1" rx="0.5" />
                <circle cx="-6" cy="-15" r="8" fill="#a7c957" />
                <circle cx="6" cy="-15" r="7" fill="#a7c957" />
                <circle cx="0" cy="-21" r="10" fill="#b5e48c" />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;