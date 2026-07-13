"use client";

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MoreVertical, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";

interface FeedbackUser {
    _id: string;
    name: string;
    avatarUrl?: string;
}

interface ReportRequest {
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
    status: 'pending' | 'inprogress' | 'resolved' | 'canceled';
    createdAt: string;
    feedbacks?: FeedbackUser[];
}

interface ReportsProp {
    data: ReportRequest[];
    page: number;
    totalPage: number;
}

interface UserProp {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MyReportsPaginationProps {
    Reports: ReportsProp;
    user?: UserProp | null;
}

const AllReports: React.FC<MyReportsPaginationProps> = ({ Reports: reports, user }) => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const router = useRouter();
    const searchParams = useSearchParams();

    const [prevReportsData, setPrevReportsData] = useState<ReportRequest[] | null>(null);
    const [requestData, setRequestData] = useState<ReportRequest[]>(reports?.data || []);

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRequestToDelete, setSelectedRequestToDelete] = useState<string | null>(null);


    if (reports?.data !== prevReportsData) {
        setPrevReportsData(reports?.data || null);
        setRequestData(reports?.data || []);
    }

    const currentPage = reports?.page || 1;
    const totalPages = reports?.totalPage || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    //  (In Progress / Canceled)
    const handleStatusUpdate = async (reportId: string, newStatus: string) => {
        try {

            const res = await fetch(`${baseurl}/api/owncitizen/pegination/reports/${reportId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast.success(`Report status updated to ${newStatus}`);
                setRequestData(prev =>
                    prev.map(req => req._id === reportId ? { ...req, status: newStatus as ReportRequest['status'] } : req)
                );

            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const triggerDelete = (id: string) => {
        setSelectedRequestToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRequestToDelete) return;

        try {
            const res = await fetch(`${baseurl}/api/owncitizen/pegination/reports/${selectedRequestToDelete}`, {
                method: 'DELETE',
            });

            const deleteData = await res.json();
            if (res.ok && deleteData) {
                toast.error('Report deleted successfully!');
                setRequestData(prev => prev.filter(req => req._id !== selectedRequestToDelete));
            }
        } catch (error) {
            toast.error('Error deleting report');
        } finally {
            setIsModalOpen(false);
            setSelectedRequestToDelete(null);
        }
    };

    const filteredRequests = requestData.filter(request => {
        if (statusFilter === 'all') return true;
        return request?.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <div className='bg-white/10'>
            <div className="py-12 px-4 lg:py-8 max-w-7xl mx-auto space-y-6 md:space-y-8 min-h-screen pb-20 relative">

                <header className="py-10 px-10 rounded-2xl bg-gradient-to-r from-[#db0000]/20 to-red-50 dark:from-red-950/20 dark:to-slate-900 border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white">
                            Welcome back, <span className="text-red-600 font-extrabold">{user?.name || "Citizen"}</span> !
                        </h1>
                        <p className="lg:text-[1rem] text-xs text-slate-500 dark:text-slate-400 mt-1">View and manage all citizen reports and requests.</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs focus:outline-hidden cursor-pointer min-w-[145px]"
                        >
                            <option value="all">All ({requestData.length})</option>
                            <option value="pending">Pending ({requestData.filter(r => r.status === 'pending').length})</option>
                            <option value="inprogress">In Progress ({requestData.filter(r => r.status === 'inprogress').length})</option>
                            <option value="resolved">Resolved ({requestData.filter(r => r.status === 'resolved').length})</option>
                            <option value="canceled">Canceled ({requestData.filter(r => r.status === 'canceled').length})</option>
                        </select>
                    </div>
                </header>

                {filteredRequests.length > 0 ? (
                    <section className="space-y-4 relative">
                        <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Citizen Feedback</TableHead>
                                        <TableHead className="text-center w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((request) => (
                                        <TableRow key={request._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                                                {request?.title}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                                {request?.category}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                                {request?.location}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                                                {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-xs capitalize px-2.5 py-0.5 rounded-full border font-semibold
                                                ${request?.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400' : ''}
                                                ${request?.status === 'inprogress' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400' : ''}
                                                ${request?.status === 'resolved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' : ''}
                                                ${request?.status === 'canceled' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400' : ''}
                                                `}>{request?.status === 'inprogress' ? 'In Progress' : request?.status}</span>
                                            </TableCell>

                                            <TableCell>
                                                {request.feedbacks && request.feedbacks.length > 0 ? (
                                                    <Link href={`/dashboard/citizen/feedback/${request._id}`} className="flex items-center -space-x-2 overflow-hidden hover:opacity-80 transition-opacity">
                                                        {request.feedbacks.slice(0, 3).map((fbUser) => (
                                                            <Avatar key={fbUser._id} className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-990">
                                                                <AvatarImage src={fbUser.avatarUrl} alt={fbUser.name} />
                                                                <AvatarFallback className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                                    {fbUser.name.slice(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No Reviews</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <DonorActionDropdown request={request} onDelete={triggerDelete} onStatusUpdate={handleStatusUpdate} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* MOBILE VIEW */}
                        <div className="block sm:hidden space-y-4">
                            {filteredRequests.map((request) => (
                                <div key={request._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">{request?.title}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">{request?.location} • {request?.category}</p>
                                        </div>
                                        <DonorActionDropdown request={request} onDelete={triggerDelete} onStatusUpdate={handleStatusUpdate} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">Status</span>
                                            <span className={`capitalize font-bold
                                                ${request?.status === 'pending' ? 'text-amber-600' : ''}
                                                ${request?.status === 'inprogress' ? 'text-blue-600' : ''}
                                                ${request?.status === 'resolved' ? 'text-emerald-600' : ''}
                                                ${request?.status === 'canceled' ? 'text-rose-600' : ''}
                                            `}>{request?.status === 'inprogress' ? 'In Progress' : request?.status}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-400 block mb-0.5">Citizen Feedback</span>
                                            {request.feedbacks && request.feedbacks.length > 0 ? (
                                                <Link href={`/dashboard/citizen/feedback/${request._id}`} className="flex items-center -space-x-2 mt-1">
                                                    {request.feedbacks.slice(0, 3).map((fbUser) => (
                                                        <Avatar key={fbUser._id} className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900">
                                                            <AvatarImage src={fbUser.avatarUrl} alt={fbUser.name} />
                                                            <AvatarFallback className="text-[10px]">{fbUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-500 font-medium italic">No Reviews</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                    Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            variant={pageNumber === currentPage ? "default" : "outline"}
                                            size="sm"
                                            className={`h-8 w-8 text-xs ${pageNumber === currentPage ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No requests found.
                    </div>
                )}

                {/* Custom Shadcn Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transform transition-all scale-100">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Report?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">This action will remove the record permanently.</p>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button className="bg-destructive hover:bg-destructive/90 text-white" size="sm" onClick={confirmDelete}>Confirm Delete</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface DonorActionDropdownProps {
    request: ReportRequest;
    onDelete: (id: string) => void;
    onStatusUpdate: (id: string, status: string) => void;
}

const DonorActionDropdown: React.FC<DonorActionDropdownProps> = ({ request, onDelete, onStatusUpdate }) => {
    const isResolved = request?.status === 'resolved';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              

                <DropdownMenuSeparator />

                {/* Status Updates */}
                <DropdownMenuItem
                    disabled={request?.status === 'inprogress'}
                    className="cursor-pointer text-xs font-medium text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950/20 flex items-center gap-2"
                    onClick={() => onStatusUpdate(request._id, 'inprogress')}
                >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>In Progress</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="cursor-pointer text-xs font-medium text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 flex items-center gap-2"

                >
                    {/* Resolved */}
                    <Link href={`/dashboard/citizen/reports/resolved/${request._id}`} className="w-full flex gap-3">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Resolved</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={request?.status === 'canceled'}
                    className="cursor-pointer text-xs font-medium text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20 flex items-center gap-2"
                    onClick={() => onStatusUpdate(request._id, 'canceled')}
                >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancelled</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

             
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AllReports;