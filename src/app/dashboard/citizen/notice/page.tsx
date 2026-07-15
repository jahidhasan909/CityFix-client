import NoticeView from '@/Components/DashboardComponents/CitizenComponents/NoticeView';
import React from 'react';
import toast from 'react-hot-toast';



async function fetchNotices() {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    try {
        const res = await fetch(`${baseurl}/api/notice`, {
            cache: 'no-store' 
        });

        if (!res.ok) {
            console.error("Failed to fetch notices response status:", res.status);
            return [];
        }

        return await res.json();
    } catch (error) {
        toast.error("Error standard notice data fetching:");
        return [];
    }
}

const Noticepage = async () => {
  
    const noticesData = await fetchNotices();

    return (
        <div className="dark:bg-slate-950 min-h-screen">
           
            <NoticeView notices={noticesData} />
        </div>
    );
};

export default Noticepage;