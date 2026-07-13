import AdminHomeClient from '@/Components/DashboardComponents/AdminComponents/Dashboard';
import React from 'react';


const AdminHomepage = async () => {
    
    // const totalCitizens = await db.citizens.count();
    
    return (
        <>
           
            <AdminHomeClient />
        </>
    );
};

export default AdminHomepage;