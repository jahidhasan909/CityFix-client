import DetailsClient from '@/Components/DetailsPage/DetailsPage';
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

export interface PublicComment {
    _id?: string;
    reportId: string;
    userName: string;
    description: string; 
    createdAt: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

const Detailspage = async ({ params }: PageProps) => {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    let reportData: Report | null = null;
    let commentsData: PublicComment[] = [];

    try {
        
        const reportRes = await fetch(`${baseUrl}/api/public/reports`, { cache: 'no-store' });
        if (reportRes.ok) {
            const allReports: Report[] = await reportRes.json();
            reportData = allReports.find(report => report._id === id) || null;
        }

        
        const commentsRes = await fetch(`${baseUrl}/api/publiccomments`, { cache: 'no-store' });
        if (commentsRes.ok) {
            const allComments: PublicComment[] = await commentsRes.json();
            commentsData = allComments.filter(comment => comment.reportId === id);
        }
    } catch (error) {
        console.error("Error fetching data in server component:", error);
    }

    if (!reportData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 text-slate-500 font-bold">
                Report data not found or API connection failed.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] mt-20 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <DetailsClient report={reportData} initialComments={commentsData} />
            </div>
        </main>
    );
};

export default Detailspage;