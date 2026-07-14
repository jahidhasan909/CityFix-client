import React from 'react';
import { Mail, Users, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";

interface AttendeeProps {
    name: string;
    email: string;
}

interface AttendcepageProps {
    params: Promise<{ id: string }>;
}

async function getAttendees(id: string): Promise<AttendeeProps[]> {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';

    const res = await fetch(`${baseurl}/api/campaing/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();

    return data[0]?.attendees || [];
}


const Attendcepage = async ({ params }: AttendcepageProps) => {
    const resolvedParams = await params;
    const attendeesList = await getAttendees(resolvedParams.id);

    return (
        <div className="dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                
                {/* Back Link */}
                <Link 
                    href="/dashboard/admin/campaignmanagement" 
                    className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Campaigns
                </Link>

                {/* Header Widget */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xxs">
                    <h1 className="text-md md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-500" />
                        Campaign Attendees List
                    </h1>
                    <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        Total: {attendeesList.length}
                    </span>
                </div>

                {/* Attendees Main Display Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    {attendeesList.length > 0 ? (
                        <>
                            
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                            <TableHead>Attendee Name</TableHead>
                                            <TableHead>Email Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendeesList.map((attendee, index) => (
                                            <TableRow key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                               
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9 border dark:border-slate-800">
                                                            <AvatarFallback className="font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                                                                {attendee.name ? attendee.name.substring(0, 2).toUpperCase() : 'US'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">{attendee.name || 'Anonymous'}</span>
                                                    </div>
                                                </TableCell>
                                                
                                        
                                                <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        {attendee.email}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                        
                            <div className="block lg:hidden p-4 space-y-4">
                                {attendeesList.map((attendee, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9">
                                                <AvatarFallback className="font-bold bg-slate-100 dark:bg-slate-800 text-xs">
                                                    {attendee.name ? attendee.name.substring(0, 2).toUpperCase() : 'US'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                            
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{attendee.name || 'Anonymous'}</h4>
                                          
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3" /> {attendee.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
                            <FileText className="w-10 h-10 stroke-1" />
                            <p className="font-medium text-sm">No one has registered for this campaign yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    ); 
};

export default Attendcepage;