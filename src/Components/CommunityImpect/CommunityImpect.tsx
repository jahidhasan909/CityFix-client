"use client";

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

interface ImpactCardProps {
    title: string;
    count: string | number;
    description: string;
    icon: React.ReactNode;
    isHighlight?: boolean;
    isLoading?: boolean;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, count, description, icon, isHighlight, isLoading }) => {
    return (
        <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[180px] group cursor-pointer ${
            isHighlight 
                ? 'bg-[#f05a28] border-[#f05a28] text-white shadow-lg hover:shadow-orange-950/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-xs hover:border-orange-500/30'
        }`}>
            {/* Background Accent Lines */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 transition-transform duration-500 group-hover:scale-110 ${
                isHighlight ? 'bg-orange-400' : 'bg-orange-600'
            }`} />

            <div className="flex justify-between items-start">
                <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                    isHighlight ? 'text-orange-200' : 'text-slate-400 dark:text-slate-500'
                }`}>
                    {title}
                </span>
                <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:rotate-6 ${
                    isHighlight ? 'bg-white/10 text-white' : 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                }`}>
                    {icon}
                </div>
            </div>

            <div className="mt-6 space-y-1">
                {isLoading ? (
                    <div className={`h-9 w-28 animate-pulse rounded-lg ${isHighlight ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-800'}`} />
                ) : (
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-baseline gap-1">
                        {count}
                    </h2>
                )}
                <p className={`text-[11px] md:text-xs font-medium flex items-center gap-1 mt-1 ${
                    isHighlight ? 'text-orange-200/80' : 'text-slate-400 dark:text-slate-500'
                }`}>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isHighlight ? 'text-orange-300' : 'text-orange-500'}`} />
                    {description}
                </p>
            </div>
        </div>
    );
};

const CommunityImpact = () => {
    // ১. ডাটা স্টেট
    const [impactData, setImpactData] = useState({
        totalCitizens: "0",
        totalFunding: "$0",
        resolvedIssues: "0"
    });
    const [isLoading, setIsLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    // ২. এপিআই কল ও ডাটা ফিল্টারিং (অফিসার ড্যাশবোর্ডের লজিক অনুযায়ী)
    useEffect(() => {
        const fetchImpactData = async () => {
            try {
                setIsLoading(true);

                const [fundingRes, reportsRes, userRes] = await Promise.all([
                    fetch(`${baseUrl}/api/funding`).then(res => res.ok ? res.json() : []),
                    fetch(`${baseUrl}/api/reports`).then(res => res.ok ? res.json() : []),
                    fetch(`${baseUrl}/api/usercollaction`).then(res => res.ok ? res.json() : [])
                ]);

                // ক) সিটিজেন ডাটা প্রসেসিং (Role: citizen)
                let citizenCount = 0;
                if (Array.isArray(userRes)) {
                    citizenCount = userRes.filter(user => user.role?.toLowerCase() === 'citizen').length;
                } else if (userRes && typeof userRes === 'object') {
                    citizenCount = (userRes.active || 0) + (userRes.blocked || 0);
                }

                // খ) ফান্ডিং ডাটা প্রসেসিং (টোটাল সাম)
                let totalSum = 0;
                if (Array.isArray(fundingRes)) {
                    totalSum = fundingRes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                } else if (fundingRes && typeof fundingRes === 'object') {
                    totalSum = fundingRes.total ?? fundingRes.totalAmount ?? 0;
                }

                // গ) রিপোর্টস ডাটা প্রসেসিং (Status: resolved)
                let solvedCount = 0;
                if (Array.isArray(reportsRes)) {
                    solvedCount = reportsRes.filter(report => report.status?.toLowerCase() === 'resolved' || report.status?.toLowerCase() === 'solved').length;
                } else if (reportsRes && typeof reportsRes === 'object') {
                    solvedCount = reportsRes.solved ?? reportsRes.resolvedCount ?? 0;
                }

                setImpactData({
                    totalCitizens: citizenCount.toLocaleString(),
                    totalFunding: `$${totalSum.toLocaleString()}`,
                    resolvedIssues: solvedCount.toLocaleString()
                });

            } catch (error) {
                console.error("Error loading community impact data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImpactData();
    }, [baseUrl]);

    return (
        <section className="w-full py-16 bg-slate-50/40 dark:bg-slate-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* SECTION TITLE */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Community Impact
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Our impact is measured by every issue solved, every contribution made, and every citizen who joins the mission.
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
                        isLoading={isLoading}
                    />

                    {/* Total Funding */}
                    <ImpactCard 
                        title="Allocated Funding"
                        count={impactData.totalFunding}
                        description="8.2% funding increase this week"
                        icon={<DollarSign className="w-5 h-5" />}
                        isLoading={isLoading}
                    />

                    {/* Total Resolved Issues */}
                    <ImpactCard 
                        title="Resolved Issues"
                        count={impactData.resolvedIssues}
                        description="84% rapid resolution efficiency"
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        isLoading={isLoading}
                    />

                </div>
            </div>
        </section>
    );
};

export default CommunityImpact;