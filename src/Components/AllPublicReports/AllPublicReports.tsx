"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { Report } from '@/app/reports/page';
import { Button } from '../ui/button';
import Link from 'next/link';


interface ReportsListProps {
    reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
    const router = useRouter();

    if (!reports || reports.length === 0) {
        return (
            <div className="w-full text-center py-20 text-slate-500 font-medium dark:text-slate-400">
                No reports available at the moment.
            </div>
        );
    }

    return (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {reports.map((report) => {
                
                const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

               
                const displayImage = report.image && report.image.length > 0 
                    ? report.image[0] 
                    : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop';

                return (
                    <div 
                        key={report._id}
                        className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] dark:hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            
                            <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <Image
                                    src={displayImage}
                                    alt={report.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    priority={false}
                                />
                                <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-emerald-400 backdrop-blur-md rounded-full border border-white/20">
                                    {report.category}
                                </span>
                            </div>

                         
                            <div className="space-y-2 px-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {report.title}
                                </h3>
                                
                                
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {report.description}
                                </p>
                            </div>
                        </div>

                        
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                            <div className="flex flex-col gap-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-1">
                                <div className="flex items-center gap-1.5">
                                    <HiOutlineLocationMarker className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                    <span className="truncate">{report.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <HiOutlineCalendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                    <span>{formattedDate}</span>
                                </div>
                            </div>

                           <Link href={`/reports/${report._id}`} className=''>
                            <Button
                                
                                className="w-full py-3 px-4 bg-slate-900 dark:bg-slate-800  dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl tracking-wide shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]  hover:cursor-pointer"
                            >
                                Share Your Opinion
                            </Button>
                           </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReportsList;