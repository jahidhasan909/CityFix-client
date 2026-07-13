import AllReports from '@/Components/DashboardComponents/Shared/AllReporst';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const PublicReportspage = async({ searchParams }: PageProps) => {
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
        
        
        const res = await fetch(`${baseurl}/api/adminofficer/owncitizen/pegination/reports?page=${page}`, {
            cache: 'no-store' 
        });
   const reports = await res.json();

    return (
        <div>
            
            <AllReports Reports={reports} user={user} />
        </div>
    );
};

export default PublicReportspage;