"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineCalendar, HiOutlineClock, HiChatBubbleLeftRight, HiXMark } from 'react-icons/hi2';

import { authClient } from '@/lib/auth-client';
import { PublicComment, Report } from '@/app/reports/[id]/page';

interface DetailsClientProps {
    report: Report;
    initialComments: PublicComment[];
}

const DetailsClient: React.FC<DetailsClientProps> = ({ report, initialComments }) => {
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [comments, setComments] = useState<PublicComment[]>(initialComments);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const [commentDesc, setCommentDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const { data, isPending } = authClient.useSession();
    const user = data?.user;
    const currentUserName = user?.name || "Anonymous User"; 

    const activeImage = selectedImage || report.image?.[0] || '';

    const remainingImages = report.image || [];

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentDesc.trim()) return;

        setIsSubmitting(true);

        const newCommentPayload = {
            reportId: report._id,
            userName: currentUserName, 
            description: commentDesc,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/publiccomments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(newCommentPayload)
            });

            if (res.ok) {
             
                setComments(prev => [newCommentPayload, ...prev]);
                setCommentDesc('');
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-sm font-semibold text-slate-500">Loading Session...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            
            <div className="lg:col-span-8 space-y-6">
                
              
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-4 shadow-sm space-y-4">
                    
                    <div className="relative w-full h-[400px] rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {activeImage ? (
                            <Image 
                                src={activeImage} 
                                alt={report.title} 
                                fill 
                                unoptimized 
                                className="object-cover transition-all duration-300"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">No Image Available</div>
                        )}
                    </div>

                   
                    {remainingImages.length > 1 && (
                        <div className="grid grid-cols-3 gap-3">
                            {remainingImages.map((imgUrl, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedImage(imgUrl)}
                                    className={`relative h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border-2 transition-all ${
                                        activeImage === imgUrl ? 'border-emerald-500 scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <Image 
                                        src={imgUrl} 
                                        alt={`thumb-${idx}`} 
                                        fill 
                                        unoptimized 
                                        className="object-cover" 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

               
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-sm space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
                            Status: {report.status}
                        </span>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4"/> {report.location}</div>
                            <div className="flex items-center gap-1"><HiOutlineCalendar className="w-4 h-4"/> {new Date(report.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md">
                            {report.category}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-2">{report.title}</h1>
                    </div>
                    
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                        {report.description}
                    </p>

                   
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                        <Image 
                            src={report.citizenImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} 
                            width={40} 
                            height={40} 
                            unoptimized 
                            className="rounded-full object-cover h-10 w-10 border" 
                            alt={report.citizenName} 
                        />
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reported By: {report.citizenName}</h4>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{report.citizenEmail}</p>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="lg:col-span-4 space-y-6">
                
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <HiChatBubbleLeftRight className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Community Perspective</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Have something to add regarding this incident?</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md tracking-wide transition-all active:scale-95"
                    >
                        Share Your Opinion
                    </button>
                </div>

                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm flex flex-col h-[400px]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        Opinions Feed <span className="text-xs font-normal text-slate-400">({comments.length})</span>
                    </h3>
                    
                    
                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {comments.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs font-medium text-slate-400">No opinions shared yet.</div>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-4 space-y-1">
                                    <div className="flex justify-between items-center">
                                      
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[70%]">{comment.userName}</span>
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5"><HiOutlineClock/> {new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <p className="text-[11px] leading-relaxed font-medium text-slate-600 dark:text-slate-400">{comment.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

           
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative space-y-4">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <HiXMark className="w-5 h-5"/>
                        </button>
                        
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Submit Your Opinion</h3>
                            <p className="text-xs text-slate-400 font-medium">Provide your detailed local feedback or updates regarding this report.</p>
                        </div>

                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Your Opinion</label>
                                <textarea 
                                    rows={5}
                                    required
                                    value={commentDesc}
                                    onChange={(e) => setCommentDesc(e.target.value)}
                                    placeholder="Write your opinion or perspective here..."
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-xs font-bold rounded-xl tracking-wide transition-all shadow-md"
                            >
                                {isSubmitting ? 'Submitting...' : 'Post Opinion'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsClient;