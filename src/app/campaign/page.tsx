"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiOutlineCalendar, HiOutlineClock, HiXMark, HiOutlineCheckCircle } from 'react-icons/hi2';
import { authClient } from '@/lib/auth-client';

export interface Campaign {
    _id: string;
    title: string;
    image: string;
    description: string;
    date: string;
    time: string;
    attendees?: { name: string; email: string }[];
}

const Campaignpage = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

   
    const { data: sessionData } = authClient.useSession();
    const currentUser = sessionData?.user;

   
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/campaing`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setCampaigns(data);
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const handleOpenModal = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCampaign(null);
    };

    const handleJoinCampaign = async () => {
        if (!selectedCampaign || !currentUser) return;

        setIsSubmitting(true);

        const attendeePayload = {
            name: currentUser.name || "Anonymous",
            email: currentUser.email
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/campaing/${selectedCampaign._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendeePayload)
            });

            if (res.ok) {
                alert("Successfully registered for this campaign!");
                
                
                setCampaigns(prev => prev.map(c => {
                    if (c._id === selectedCampaign._id) {
                        const existingAttendees = c.attendees || [];
                        return { ...c, attendees: [...existingAttendees, attendeePayload] };
                    }
                    return c;
                }));

                handleCloseModal();
            }
        } catch (error) {
            console.error("Failed to update attendance:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
               
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md">
                        Active Movements
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Explore Live Campaigns
                    </h1>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {campaigns.map((campaign) => {
                        
                        const isAlreadyJoined = currentUser && campaign.attendees?.some(att => att.email === currentUser.email);

                        return (
                            <div 
                                key={campaign._id}
                                className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] overflow-hidden p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <Image 
                                            src={campaign.image} 
                                            alt={campaign.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <HiOutlineCalendar className="w-3.5 h-3.5 text-emerald-500" />
                                            {new Date(campaign.date).toLocaleDateString()}
                                        </div>
                                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                            Attendees: {campaign.attendees?.length || 0}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 px-1">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">
                                            {campaign.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                            {campaign.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 px-1">
                                    {isAlreadyJoined ? (
                                        
                                        <button 
                                            disabled
                                            className="w-full py-2.5 px-4 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center justify-center gap-1.5 cursor-not-allowed"
                                        >
                                            <HiOutlineCheckCircle className="w-4 h-4"/> Joined
                                        </button>
                                    ) : (
                                        
                                        <button 
                                            onClick={() => handleOpenModal(campaign)}
                                            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-600 dark:bg-slate-800/60 dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
                                        >
                                            Attend Campaign
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

          
            {isModalOpen && selectedCampaign && (
                <div 
                    onClick={handleCloseModal} 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-[2.5rem] p-6 shadow-2xl relative space-y-5 cursor-default"
                    >
                        
                      
                        <button 
                            type="button"
                            onClick={handleCloseModal}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
                        >
                            <HiXMark className="w-6 h-6"/>
                        </button>

                      
                        <div className="relative w-full h-56 rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <Image src={selectedCampaign.image} alt={selectedCampaign.title} fill unoptimized className="object-cover" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                                <span className="flex items-center gap-1"><HiOutlineCalendar className="w-4 h-4 text-emerald-500"/> {new Date(selectedCampaign.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><HiOutlineClock className="w-4 h-4 text-emerald-500"/> {selectedCampaign.time}</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedCampaign.title}</h2>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-h-32 overflow-y-auto pr-1">
                                {selectedCampaign.description}
                            </p>
                        </div>

                  
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4">
                            <div className="text-xs font-semibold text-slate-400">
                                Current Attendees: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedCampaign.attendees?.length || 0}</span>
                            </div>

                            {!currentUser ? (
                                <p className="text-xs font-bold text-amber-500">Please log in to attend</p>
                            ) : selectedCampaign.attendees?.some(att => att.email === currentUser.email) ? (
                                <button disabled className="py-2.5 px-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-500/20">
                                    <HiOutlineCheckCircle className="w-4 h-4"/> Joined
                                </button>
                            ) : (
                                <button 
                                    onClick={handleJoinCampaign}
                                    disabled={isSubmitting}
                                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                                >
                                    {isSubmitting ? "Joining..." : "Confirm Attendance"}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
};

export default Campaignpage;