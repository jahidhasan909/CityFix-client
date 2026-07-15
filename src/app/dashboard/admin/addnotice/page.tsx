import NoticeClientView from '@/Components/DashboardComponents/AdminComponents/NoticeView';
import React from 'react';

interface NoticeProps {
    _id?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    image?: string;
}


async function getNotices(): Promise<NoticeProps[]> {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    try {
        const res = await fetch(`${baseurl}/api/notice`, { cache: 'no-store' });
        
        if (!res.ok) {
            return [];
        }
        
        return await res.json();
    } catch (error) {
        
        console.error("Error fetching notices:", error);
        return [];
    }
}

const AddNoticepage = async () => {
    const notices = await getNotices();

    return (
        <div className="dark:bg-slate-950 min-h-screen">
            <NoticeClientView initialNotices={notices} />
        </div>
    );
};

export default AddNoticepage;