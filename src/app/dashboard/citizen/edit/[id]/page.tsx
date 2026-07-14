
import EditReportForm from '@/Components/DashboardComponents/CitizenComponents/EditFrom';
import { auth } from '@/lib/auth';
import { ChevronLeft } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import React from 'react';

interface EditPageProps {
    params: Promise<{ id: string }>;
}

const Editpage = async ({ params }: EditPageProps) => {
    const { id } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;
    const userRole = user?.role || 'citizen';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto mt-12 mb-8 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <Link
                    href={`/dashboard/${userRole}/reports`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-white transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>

                <div>
                    <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                        Edit Citizen Report
                    </h1>
                    <p className="mt-2 text-xs lg:text-[1rem] text-slate-500 dark:text-slate-400 max-w-2xl">
                        Update the necessary information of your report or request below.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
                <EditReportForm id={id} />
            </div>
        </div>
    );
};

export default Editpage;