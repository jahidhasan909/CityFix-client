import ReportsList from '@/Components/AllPublicReports/AllPublicReports';
import { log } from 'console';
import React from 'react';


export interface Report {
    _id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    image: string[];
    citizenId: string;
    citizenName: string;
    citizenEmail: string;
    citizenImage: string;
    status: string; 
    createdAt: string;
}

const Reportspage = async () => {
    const baseurl=process.env.NEXT_PUBLIC_BASE_URL
    let reports: Report[] = [];
    
    try {
        const res = await fetch(`${baseurl}/api/public/reports`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            const allReports: Report[] = await res.json();
            
            
            reports = allReports.filter(report => report.status === 'pending');
        }
    } catch (error) {
        console.error("Failed to fetch reports:", error);
    }
  
    

    return (
        <main className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ">
            <div className="max-w-[1400px] mx-auto space-y-10 mt-10">
              
                <div className="text-center  space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Public Reports
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Explore all public reports submitted by citizens. View issue details, locations, <br /> and the latest status updates.
                    </p>
                </div>

               
                <ReportsList reports={reports} />
            </div>
        </main>
    );
};

export default Reportspage;