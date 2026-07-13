import CampaignClientView from '@/Components/DashboardComponents/Shared/CampaingView';
import React from 'react';


interface CampaignManagementProps {
    searchParams: Promise<{ page?: string }>;
}


async function getCampaigns(page: string) {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const limit = 10; 

    try {
        const res = await fetch(`${baseurl}/api/pegination/campaing?page=${page}&limit=${limit}`, {
            cache: 'no-store' 
        });

        if (!res.ok) {
            return { data: [], page: 1, totalPage: 1 };
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return { data: [], page: 1, totalPage: 1 };
    }
}

const CampaignManagementpage = async ({ searchParams }: CampaignManagementProps) => {
    
    const resolvedParams = await searchParams;
    const currentPage = resolvedParams.page || '1';

    
    const campaignsData = await getCampaigns(currentPage);

    return (
        <div className="dark:bg-slate-950 min-h-screen">
            
            <CampaignClientView campaignsData={campaignsData} />
        </div>
    );
};

export default CampaignManagementpage;