"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { Report } from '@/app/reports/page';
import { Button } from '../ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface District {
    id: string;
    name: string;
    bn_name: string;
}

interface Upazila {
    id: string;
    district_id: string;
    name: string;
    bn_name: string;
}

interface ReportsListProps {
    reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
    const router = useRouter();

 
    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);

   
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedUpazila, setSelectedUpazila] = useState<string>("");

  
    const [activeDistrictFilter, setActiveDistrictFilter] = useState<string>("");
    const [activeUpazilaFilter, setActiveUpazilaFilter] = useState<string>("");


    useEffect(() => {
        const loadData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    fetch("/districts.json"),
                    fetch("/upazilas.json"),
                ]);

                const districtData = await districtRes.json();
                const upazilaData = await upazilaRes.json();

                setDistricts(districtData?.[2]?.data || []);
                setUpazilas(upazilaData?.[2]?.data || []);
            } catch (error) {
                toast.error("Failed to load location data");
            }
        };

        loadData();
    }, []);

    // Derived State for Upazilas
    const filteredUpazilas = selectedDistrict
        ? upazilas.filter((upazila) => upazila.district_id === selectedDistrict)
        : [];

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value);
        setSelectedUpazila(""); 
    };

    const handleSearch = () => {
        const districtObj = districts.find(d => d.id === selectedDistrict);
        const upazilaObj = upazilas.find(u => u.id === selectedUpazila);

        setActiveDistrictFilter(districtObj ? districtObj.name : "");
        setActiveUpazilaFilter(upazilaObj ? upazilaObj.name : "");
    };

    const handleClearFilter = () => {
        setSelectedDistrict("");
        setSelectedUpazila("");
        setActiveDistrictFilter("");
        setActiveUpazilaFilter("");
    };

    const displayedReports = reports.filter((report) => {
        if (!report.location) return false;

        const reportLocationLower = report.location.toLowerCase();
        const districtMatch = activeDistrictFilter 
            ? reportLocationLower.includes(activeDistrictFilter.toLowerCase()) 
            : true;
        const upazilaMatch = activeUpazilaFilter 
            ? reportLocationLower.includes(activeUpazilaFilter.toLowerCase()) 
            : true;

        return districtMatch && upazilaMatch;
    });

    return (
        <div className="space-y-10">
            
            {/* SEARCH AND FILTER BAR */}
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    
                    {/* District Dropdown */}
                    <div className="w-full md:flex-1 space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                            Select District
                        </label>
                        <select
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-3 outline-none focus:border-[#f05a28] dark:focus:border-emerald-500 transition-all cursor-pointer"
                        >
                            <option value="">All Districts</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name} {district.bn_name ? `(${district.bn_name})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upazila Dropdown */}
                    <div className="w-full md:flex-1 space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                            Select Upazila
                        </label>
                        <select
                            value={selectedUpazila}
                            onChange={(e) => setSelectedUpazila(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full bg-slate-50 dark:bg-slate-800/60 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-3 outline-none focus:border-[#f05a28] dark:focus:border-emerald-500 transition-all cursor-pointer"
                        >
                            <option value="">All Upazilas</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={upazila.id}>
                                    {upazila.name} {upazila.bn_name ? `(${upazila.bn_name})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Action Buttons */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            onClick={handleSearch}
                            className="flex-1 md:flex-none py-5 px-6 bg-[#f05a28] hover:bg-[#f05a28]/90 dark:bg-[#f05a28] dark:hover:bg-[#f05a28]/90 text-white text-xs font-bold rounded-xl tracking-wide shadow-sm transition-all duration-200 active:scale-[0.98] hover:cursor-pointer"
                        >
                            Search
                        </Button>
                        {(activeDistrictFilter || activeUpazilaFilter) && (
                            <Button
                                onClick={handleClearFilter}
                                variant="outline"
                                className="py-5 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 text-xs font-bold rounded-xl"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                </div>
            </div>

            
            {displayedReports.length === 0 ? (
                <div className="w-full text-center py-20 text-slate-400 font-medium dark:text-slate-500 text-sm">
                    No reports match your location criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {displayedReports.map((report) => {
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
                                className="relative bg-[#f05a28]/10 dark:bg-slate-850 rounded-[2rem] pt-4 pb-4 px-3 shadow-[0_12px_30px_-10px_rgba(240,90,40,0.08)] dark:shadow-none flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5"
                            >
                               
                              
                                <div className="bg-white dark:bg-slate-900 rounded-b-[1.5rem] rounded-t-[1.8rem] overflow-hidden shadow-none border-none flex-1 flex flex-col justify-between -mt-1">
                                    <div>
                                        {/* Image (No margin, perfectly rounded-t) */}
                                        <div className="relative w-full h-40 overflow-hidden bg-slate-50 dark:bg-slate-850">
                                            <Image
                                                src={displayImage}
                                                alt={report.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-103 transition-transform duration-550"
                                                priority={false}
                                            />
                                            <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/95 text-slate-800 dark:text-emerald-400 backdrop-blur-sm rounded-full">
                                                {report.category}
                                            </span>
                                        </div>

                                        {/* Typography & Copy */}
                                        <div className="p-4 space-y-1.5">
                                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 tracking-tight group-hover:text-[#f05a28] transition-colors">
                                                {report.title}
                                            </h3>
                                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                                                {report.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location and Date */}
                                    <div className="mx-4 mb-4 pt-3.5 border-t border-slate-50 dark:border-slate-800/40 flex flex-col gap-1.5 text-[10px] font-bold text-slate-400/90 dark:text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{report.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HiOutlineCalendar className="w-3.5 h-3.5 shrink-0" />
                                            <span>{formattedDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM ACTION BUTTON */}
                                <div className="mt-3.5 px-1">
                                    <Link href={`/reports/${report._id}`} className='block'>
                                        <Button
                                            className="w-full py-2 px-4 bg-white dark:bg-slate-800 hover:bg-white/90 dark:hover:bg-slate-700 text-[#f05a28] dark:text-white text-[11px] font-extrabold rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 active:scale-[0.98] hover:cursor-pointer"
                                        >
                                            Share Your Opinion
                                        </Button>
                                    </Link>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReportsList;