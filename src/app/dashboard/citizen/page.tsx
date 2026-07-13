import MyReportsPegination from '@/Components/DashboardComponents/CitizenComponents/MyReportsPeginationTable';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const MyReportspage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    let page = params.page;
    
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;

    if (!page) {
        page = "1";
    }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    
    const res = await fetch(`${baseurl}/api/owncitizen/pegination/reports?citizenEmail=${session?.user?.email}&page=${page}`, {
        cache: 'no-store' 
    });
    
    const reports = await res.json();

    return (
        <div>
            
            <MyReportsPegination Reports={reports} user={user} />
        </div>
    );
};

export default MyReportspage;