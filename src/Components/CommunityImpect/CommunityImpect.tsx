"use client";

import React from 'react';
import { Users, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

interface ImpactCardProps {
    title: string;
    count: string;
    description: string;
    icon: React.ReactNode;
    isHighlight?: boolean;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, count, description, icon, isHighlight }) => {
    return (
        <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[180px] group cursor-pointer ${
            isHighlight 
                ? 'bg-[#1b4332] border-[#2d6a4f] text-white shadow-lg hover:shadow-emerald-950/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-xs hover:border-emerald-500/30'
        }`}>
            {/* Background Accent Lines for Fancy Look */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 transition-transform duration-500 group-hover:scale-110 ${
                isHighlight ? 'bg-emerald-400' : 'bg-emerald-600'
            }`} />

            <div className="flex justify-between items-start">
                <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                    isHighlight ? 'text-emerald-300' : 'text-slate-400 dark:text-slate-500'
                }`}>
                    {title}
                </span>
                <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:rotate-6 ${
                    isHighlight ? 'bg-white/10 text-white' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                    {icon}
                </div>
            </div>

            <div className="mt-6 space-y-1">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-baseline gap-1">
                    {count}
                </h2>
                <p className={`text-[11px] md:text-xs font-medium flex items-center gap-1 mt-1 ${
                    isHighlight ? 'text-emerald-200/80' : 'text-slate-400 dark:text-slate-500'
                }`}>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isHighlight ? 'text-emerald-300' : 'text-emerald-500'}`} />
                    {description}
                </p>
            </div>
        </div>
    );
};

const CommunityImpact = () => {
    //  API 
    const impactData = {
        totalCitizens: "24,580",
        totalFunding: "$48,250",
        resolvedIssues: "1,240"
    };

    return (
        <section className="w-full py-16 bg-slate-50/40 dark:bg-slate-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* SECTION TITLE */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        Our Footprint
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Making a Real Community Impact
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Empowering citizens, resolving localized challenges, and transparently allocating development funds.
                    </p>
                </div>

                {/* THREE IMPACT CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Total Citizen */}
                    <ImpactCard 
                        title="Registered Citizens"
                        count={impactData.totalCitizens}
                        description="+12% growth in community engagement"
                        icon={<Users className="w-5 h-5" />}
                        isHighlight={true} 
                    />

                    {/*Total Funding */}
                    <ImpactCard 
                        title="Allocated Funding"
                        count={impactData.totalFunding}
                        description="8.2% funding increase this week"
                        icon={<DollarSign className="w-5 h-5" />}
                    />

                    {/*Total Resolved Issues */}
                    <ImpactCard 
                        title="Resolved Issues"
                        count={impactData.resolvedIssues}
                        description="84% rapid resolution efficiency"
                        icon={<CheckCircle2 className="w-5 h-5" />}
                    />

                </div>
            </div>
        </section>
    );
};

export default CommunityImpact;