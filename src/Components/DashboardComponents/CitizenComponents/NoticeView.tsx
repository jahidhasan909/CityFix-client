"use client";

import React, { useState } from 'react';
import { Calendar, Clock, FileText, Eye } from 'lucide-react';


import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface NoticeProps {
    _id?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    image?: string;
}

interface NoticeClientProps {
    notices: NoticeProps[];
}

const NoticeView: React.FC<NoticeClientProps> = ({ notices }) => {
    const [selectedNotice, setSelectedNotice] = useState<NoticeProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (notice: NoticeProps) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
            
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Notice Board</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Stay updated with the latest official announcements and information.</p>
                </div>
            </div>

         
            {notices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notices.map((notice) => (
                        <div 
                            key={notice._id} 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4"
                        >
                            <div className="space-y-3 flex-1">
                                {/* Notice Image */}
                                {notice.image && (
                                    <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                                        {/* eslint-disable-next-line */}
                                        <img 
                                            src={notice.image} 
                                            alt={notice.title} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                                
                                <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg line-clamp-2 leading-snug">
                                    {notice.title}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                    {notice.description}
                                </p>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                {/* Date & Time Meta */}
                                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-[#1b4332]" />
                                        {notice.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {notice.time}
                                    </span>
                                </div>

                                {/* Action Button */}
                                <Button 
                                    variant="outline" 
                                    className="w-full h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
                                    onClick={() => handleViewDetails(notice)}
                                >
                                    <Eye className="w-3.5 h-3.5 text-[#1b4332]" />
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2 shadow-xs">
                    <FileText className="w-10 h-10 stroke-1 text-slate-300" />
                    <p className="font-medium text-sm">No official notices published yet.</p>
                </div>
            )}

            {/* VIEW DETAILS MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
                    {selectedNotice && (
                        <div className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                                    {selectedNotice.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 pt-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-[#1b4332]" />
                                        Published: {selectedNotice.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        Time: {selectedNotice.time}
                                    </span>
                                </DialogDescription>
                            </DialogHeader>

                            {/* Modal Detailed Image */}
                            {selectedNotice.image && (
                                <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                                    {/* eslint-disable-next-line */}
                                    <img 
                                        src={selectedNotice.image} 
                                        alt={selectedNotice.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}

                            {/* Full Description Text */}
                            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                {selectedNotice.description}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="bg-[#1b4332] hover:bg-[#143225] text-white rounded-xl px-5"
                                >
                                    Close Notice
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NoticeView;