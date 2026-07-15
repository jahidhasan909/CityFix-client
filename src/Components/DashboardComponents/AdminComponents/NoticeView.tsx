"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, Clock, FileText, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface NoticeProps {
    _id?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    image?: string;
}

interface NoticeClientViewProps {
    initialNotices: NoticeProps[];
}

const NoticeClientView: React.FC<NoticeClientViewProps> = ({ initialNotices }) => {
    const router = useRouter();
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
  
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState('');

   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !date || !time) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        const newNotice = { title, description, date, time, image };

        try {
            const res = await fetch(`${baseurl}/api/notice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNotice),
            });

            if (res.ok) {
                toast.success('Notice published successfully!');
                setIsModalOpen(false);
                
                setTitle('');
                setDescription('');
                setDate('');
                setTime('');
                setImage('');
                
                router.refresh();
            } else {
                toast.error('Failed to add notice');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    
    const handleDeleteNotice = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;

        try {
            const res = await fetch(`${baseurl}/api/notice/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Notice deleted successfully!');
                router.refresh(); 
            } else {
                toast.error('Failed to delete notice');
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error('Something went wrong while deleting!');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
            
            {/* TOP BAR WITH MODAL BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Notice Board Management</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create, view, and organize official announcements.</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger >
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 self-start sm:self-auto rounded-xl shadow-md">
                            <PlusCircle className="w-4 h-4" />
                            Add New Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Publish Notice</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Fill up the form below to broadcast a new notice to the board.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notice Title *</label>
                                <Input 
                                    placeholder="Enter notice title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description *</label>
                                <Textarea 
                                    placeholder="Write detailed notice description..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="rounded-xl min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date *</label>
                                    <Input 
                                        type="date" 
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="rounded-xl cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time *</label>
                                    <Input 
                                        type="time" 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="rounded-xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Image URL (Optional)</label>
                                <Input 
                                    placeholder="https://example.com/image.png" 
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white rounded-xl min-w-[100px]">
                                    {loading ? 'Publishing...' : 'Publish'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            
            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" /> All Notices ({initialNotices.length})
                </h2>

                {initialNotices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialNotices.map((notice) => (
                            <div key={notice._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4">
                                
                                <div className="space-y-3 flex-1">
                                    {notice.image && (
                                        <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={notice.image} 
                                                alt={notice.title} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg line-clamp-2">{notice.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">{notice.description}</p>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                   
                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-red-500" />
                                            {notice.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                                            {notice.time}
                                        </span>
                                    </div>

                                    
                                    <div className="pt-1">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full text-xs font-semibold rounded-xl border-red-100 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-destructive flex items-center justify-center gap-1.5"
                                            onClick={() => notice._id && handleDeleteNotice(notice._id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete Notice
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-10 h-10 stroke-1" />
                        <p className="font-medium text-sm">No notices found on the board.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeClientView;