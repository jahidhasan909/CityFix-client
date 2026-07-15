import React from 'react';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, User, Calendar } from 'lucide-react';

interface CommentItem {
    _id: string;
    reportId: string;
    userName: string;
    description: string;
    createdAt: string;
}

interface FeedbackPageProps {
    params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
    const { id: reportId } = await params;
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    let comments: CommentItem[] = [];
    let errorOccurred = false;

   
    try {
        const res = await fetch(`${baseurl}/api/publiccomments?reportId=${reportId}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            comments = await res.json();
        }
    } catch (error) {
        console.error("Error fetching comments for report:", error);
        errorOccurred = true;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 py-12 px-4 lg:py-16">
            <div className="max-w-3xl mx-auto space-y-6">
                
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/dashboard/citizen/reports" 
                            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-red-600" />
                                Community Feedback
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Showing comments and opinions from citizens
                            </p>
                        </div>
                    </div>
                    
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                        Total: {comments.length}
                    </span>
                </div>

               
                {errorOccurred ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-xs">
                        <p className="text-sm text-red-500 font-medium">Failed to load comments. Please try again later.</p>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div 
                                key={comment._id} 
                                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                {comment.userName || "Anonymous Citizen"}
                                            </h4>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                                <Calendar className="h-3 w-3" />
                                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-slate-600 dark:text-slate-300 pl-10 leading-relaxed font-medium">
                                    {comment.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6">
                        <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Comments Yet</h3>
                        <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts on this citizen report.</p>
                    </div>
                )}
            </div>
        </div>
    );
}