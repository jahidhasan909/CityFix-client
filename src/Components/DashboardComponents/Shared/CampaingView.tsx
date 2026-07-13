"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, Clock, FileText, ChevronLeft, ChevronRight, Users, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Shadcn UI Components
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface CampaignProps {
    _id?: string;
    title: string;
    image: string;
    description: string;
    date: string;
    time: string;
}

interface CampaignClientViewProps {
    campaignsData: {
        data: CampaignProps[];
        page: number;
        totalPage: number;
    };
}

const CampaignClientView: React.FC<CampaignClientViewProps> = ({ campaignsData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const currentPage = campaignsData?.page || 1;
    const totalPages = campaignsData?.totalPage || 1;
    const allCampaigns = campaignsData?.data || [];

    // Handle Pagination Page Change
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Handle Form Submit (Add Campaign)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !image || !description || !date || !time) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        const newCampaign = { title, image, description, date, time };

        try {
            const res = await fetch(`${baseurl}/api/campaing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCampaign),
            });

            if (res.ok) {
                toast.success('Campaign added successfully!');
                setIsModalOpen(false);
                
                // Form Reset
                setTitle('');
                setImage('');
                setDescription('');
                setDate('');
                setTime('');
                
                router.refresh();
            } else {
                toast.error('Failed to add campaign');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    // Action Button Placeholders
    const handleViewAttendees = (id: string) => {
        toast.success(`Opening Attendees list for Campaign ID: ${id}`);
        // এখানে পরবর্তীতে রাউটিং করতে পারেন: router.push(`/dashboard/campaigns/attendees/${id}`);
    };

    const handleDeleteCampaign = (id: string) => {
        toast.error(`Delete functionality pending for ID: ${id}`);
        // এখানে পরবর্তীতে DELETE API কল করবেন
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 min-h-screen">
            
            {/* TOP BAR WITH ADD CAMPAIGN MODAL */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Campaign Management</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Launch, monitor, and organize active campaigns.</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger>
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 self-start sm:self-auto rounded-xl shadow-md">
                            <PlusCircle className="w-4 h-4" />
                            Create Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">New Campaign</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Fill up the form to publish a new active campaign.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Campaign Title *</label>
                                <Input 
                                    placeholder="Enter campaign title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Image URL *</label>
                                <Input 
                                    placeholder="https://example.com/banner.png" 
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description *</label>
                                <Textarea 
                                    placeholder="Write details about this campaign..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="rounded-xl min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Date *</label>
                                    <Input 
                                        type="date" 
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="rounded-xl cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Time *</label>
                                    <Input 
                                        type="time" 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="rounded-xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white rounded-xl min-w-[100px]">
                                    {loading ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* LOWER SECTION: PAGINATION TABLE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                {allCampaigns.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Campaign Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Launch Date</TableHead>
                                        <TableHead>Launch Time</TableHead>
                                        <TableHead className="text-center w-[200px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allCampaigns.map((campaign) => (
                                        <TableRow key={campaign._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={campaign.image} 
                                                        alt={campaign.title} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[140px] truncate">
                                                {campaign.title}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px] truncate">
                                                {campaign.description || 'No description'}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Calendar className="w-4 h-4 text-red-500" />
                                                    {campaign.date ? new Date(campaign.date).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    {campaign.time || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {/* Action Buttons */}
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 text-xs font-semibold rounded-lg flex items-center gap-1 border-slate-200 dark:border-slate-700"
                                                        onClick={() => campaign._id && handleViewAttendees(campaign._id)}
                                                    >
                                                        <Users className="w-3.5 h-3.5 text-blue-600" />
                                                        Attendees
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 text-xs font-semibold rounded-lg flex items-center gap-1 border-red-100 dark:border-red-950/40 text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        onClick={() => campaign._id && handleDeleteCampaign(campaign._id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* TABLE PAGINATION CONTROLS */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 p-4">
                                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                    Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-lg"
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
                                            className={`h-8 w-8 text-xs rounded-lg ${pageNumber === currentPage ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-lg"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-10 h-10 stroke-1" />
                        <p className="font-medium text-sm">No campaigns found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignClientView;