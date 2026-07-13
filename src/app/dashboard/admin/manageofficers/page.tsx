import OfficerManagementPage from '@/Components/DashboardComponents/AdminComponents/ManageOfficers';
import React from 'react';
interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const ManageOfficerspage = async({ searchParams }: PageProps) => {
     const params = await searchParams;
    let page = params.page

    if (!page) {
        page = "1";
    }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL
    const res = await fetch(`${baseurl}/api/pegination/users?page=${page}`,{cache: 'no-store'})
    const users = await res.json()
    return (
        <div>
            <OfficerManagementPage Users={users}></OfficerManagementPage>
        </div>
    );
};

export default ManageOfficerspage;