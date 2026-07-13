"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from "lucide-react";
import toast from 'react-hot-toast';


import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

interface UserProps {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: 'citizen' | 'officer' | 'admin' | string;
    status: 'active' | 'suspended' | string; 
}

interface UsersFetchData {
    data?: UserProps[];
    users?: UserProps[];
    page?: number;
    totalPage?: number;
}

interface OfficerManagementPageProps {
    Users: UserProps[] | UsersFetchData;
}

const OfficerManagementPage: React.FC<OfficerManagementPageProps> = ({ Users }) => {
    const router = useRouter();
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';

    
    const getOfficerUsers = (rawUsers: UserProps[] | UsersFetchData): UserProps[] => {
        const arr = Array.isArray(rawUsers) ? rawUsers : (rawUsers?.data || rawUsers?.users || []);
        return arr.filter((user: UserProps) => user.role === 'officer');
    };

    const [officersList, setOfficersList] = useState<UserProps[]>(getOfficerUsers(Users));
    const [statusFilter, setStatusFilter] = useState<string>('all');

    
    const [prevUsers, setPrevUsers] = useState<UserProps[] | UsersFetchData>(Users);

    if (Users !== prevUsers) {
        setPrevUsers(Users);
        setOfficersList(getOfficerUsers(Users));
    }

    // Pagination
    const page = (Users as UsersFetchData)?.page || 1;
    const totalPages = (Users as UsersFetchData)?.totalPage || 1;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    //  (Suspend / Unsuspend)
    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        const targetUser = officersList.find(user => user._id === userId);
        if (!targetUser) return;

        
        const endpoint = newStatus === 'suspended' ? 'makeblock' : 'unblocked'; 
        const successMessage = newStatus === 'suspended' ? 'Officer suspended successfully!' : 'Officer unsuspended successfully!';

        try {
            const response = await fetch(`${baseurl}/api/usercollaction/${endpoint}?email=${targetUser.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(successMessage);
                setOfficersList(prev =>
                    prev.map(user => user._id === userId ? { ...user, status: newStatus === 'suspended' ? 'suspended' : 'active' } : user)
                );
            } else {
                toast.error(`Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        }
    };

    const filteredOfficers = officersList.filter(user => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'suspended') return user.status === 'suspended' || user.status === 'blocked';
        return user.status === statusFilter;
    });

    return (
        <div className='dark:bg-slate-950 min-h-screen'>
            <div className="py-10 px-4 max-w-7xl mx-auto space-y-6 relative">

                <header className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                            Officer Management Panel <span className="text-blue-600 font-extrabold">(Admin)</span>
                        </h1>
                        <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor and manage platform officers. You can suspend or unsuspend their accounts.
                        </p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                            All Officers ({officersList.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                            Active ({officersList.filter(u => u.status === 'active').length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('suspended')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === 'suspended' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                            Suspended ({officersList.filter(u => u.status === 'suspended' || u.status === 'blocked').length})
                        </button>
                    </div>
                </header>

                {filteredOfficers.length > 0 ? (
                    <section className="space-y-4">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Officer Name</TableHead>
                                        <TableHead>Email Address</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOfficers.map((user) => (
                                        <TableRow key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-9 h-9">
                                                        <AvatarImage src={user?.image} alt={user.name} />
                                                        <AvatarFallback className="font-bold bg-slate-100 dark:bg-slate-800">
                                                            {user.name?.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-300 font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                <span className="px-2.5 py-0.5 rounded text-xs font-bold capitalize border bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900">
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-xs capitalize px-2.5 py-0.5 rounded-full border font-semibold ${user.status === 'active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900'}`}>
                                                    {user.status === 'blocked' ? 'suspended' : user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger >
                                                        <Button size="icon" variant="ghost" className="rounded-full">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50">
                                                        {user.status === "active" ? (
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(user._id, "suspended")} className="cursor-pointer text-xs font-semibold text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/30">
                                                                Suspend Officer
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(user._id, "active")} className="cursor-pointer text-xs font-semibold text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/30">
                                                                Unsuspend Officer
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile View */}
                        <div className="block lg:hidden space-y-4">
                            {filteredOfficers.map((user) => (
                                <div key={user._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user?.image} />
                                                <AvatarFallback className="font-bold">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">{user.name}</h3>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger >
                                                    <Button size="icon" variant="ghost" className="rounded-full">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50">
                                                    {user.status === "active" ? (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(user._id, "suspended")} className="cursor-pointer text-xs font-semibold text-amber-600">
                                                            Suspend Officer
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(user._id, "active")} className="cursor-pointer text-xs font-semibold text-emerald-600">
                                                            Unsuspend Officer
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">Role</span>
                                            <span className="capitalize font-bold text-slate-700 dark:text-slate-300">{user.role}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block mb-0.5">Status</span>
                                            <span className={`capitalize font-bold ${user.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {user.status === 'blocked' ? 'suspended' : user.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => router.push(`?page=${page - 1}`)}
                                    className="text-xs font-semibold"
                                >
                                    Previous
                                </Button>

                                {pages.map((p) => (
                                    <Button
                                        key={p}
                                        variant={page === p ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => router.push(`?page=${p}`)}
                                        className={`w-8 h-8 text-xs font-bold ${page === p ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : ''}`}
                                    >
                                        {p}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => router.push(`?page=${page + 1}`)}
                                    className="text-xs font-semibold"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="text-center p-12 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 text-slate-400">
                        No officers found matching this criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficerManagementPage;