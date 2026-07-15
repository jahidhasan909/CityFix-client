"use client";

import React from 'react';
import Marquee from "react-fast-marquee";

interface CompanyProps {
    name: string;
    logo: string;
}

const companies: CompanyProps[] = [
    { name: "CityWorks", logo: "https://i.ibb.co.com/wZtvxj9D/images-3.jpg" },
    { name: "UrbanCare", logo: "https://i.ibb.co.com/ZRhnSJdw/images-4.jpg" },
    { name: "GreenLife", logo: "https://i.ibb.co.com/Qv0k9yhz/images-5.jpg" },
    { name: "RoadWorks", logo: "https://i.ibb.co.com/kgL2h9h3/images-6.jpg" },
    { name: "CleanCity", logo: "https://i.ibb.co.com/p6WRkH4F/images-9.jpg" }, 
    { name: "CleanCity", logo: "https://i.ibb.co.com/ZRhnSJdw/images-4.jpg" },
    { name: "CivicShield", logo: "https://i.ibb.co.com/jkMLRf36/images-8.jpg" },
    { name: "SmartGov", logo: "https://i.ibb.co.com/Ds78GCt/images-7.jpg" },
    { name: "PublicGov", logo: "https://i.ibb.co.com/YBvh7Hjs/bangladesh-logo-map-icon-vector-7657504.avif" },
    { name: "RokomBD", logo: "https://i.ibb.co.com/Swj1FjKh/images-10.jpg" },
];




const MarqueeSlider = () => {
    return (
        <div className="w-full  dark:bg-slate-950/40 py-5 border-y border-slate-200/60 dark:border-slate-800/50 backdrop-blur-md overflow-hidden grayscale hover:grayscale-0">
            

            
            <Marquee 
                speed={45} 
                gradient={true} 
                gradientColor="var(--marquee-gradient)" 
                className="flex items-center dark:[--marquee-gradient:rgba(2,6,23,0.8)] [--marquee-gradient:rgba(248,250,252,0.8)]"
                pauseOnHover={true}
            >
                {companies.map((company, index) => (
                    <div 
                        key={index} 
                        className="flex items-center gap-2  mx-2 px-5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/70 shadow-xs hover:border-[#f05a28] dark:hover:border-orange-500/30 transition-all duration-300 group cursor-pointer"
                    >
                        
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-0.5 group-hover:scale-105 transition-transform duration-300">
                            {/* eslint-disable-next-line  */}
                            <img 
                                src={company.logo} 
                                alt={company.name} 
                                className="w-full h-full object-cover rounded-lg mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95" 
                            />
                        </div>

                       
                        <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 tracking-wide group-hover:text-[#f05a28] dark:group-hover:text-orange-400 transition-colors duration-300">
                            {company.name}
                        </span>
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default MarqueeSlider;