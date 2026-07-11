'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";



import {
    Home,
    User,
    FileText,
    PlusCircle,
    Users,
    Droplet,
    Menu,
    LogOut,
    LucideIcon
} from "lucide-react";


import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { UserData } from "@/types/geo";


type UserRole = 'citizen' | 'officer' | 'admin';

interface NavItem {
    icon: LucideIcon;
    label: string;
    link: string;
}

export default function DashboardSidebar() {
    const baseurl=process.env.NEXT_PUBLIC_BASE_URL
    const router = useRouter();
    const pathname = usePathname();
    const { data, isPending } = authClient.useSession()
   const [userData, setUserData] = useState<UserData | null>(null);

    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    const user = data?.user;
    useEffect(() => {
        fetch(`${baseurl}/api/own/usercollaction?email=${user?.email}`).then(res=>res.json()).then(userEmail=>setUserData(userEmail))
    })

    const role = (userData?.role as UserRole) || 'citizen';

    const handleLogout = async (): Promise<void> => {
        await authClient.signOut();
        router.push('/');
    };



    if (isPending) {
        return <div>loading...</div>
    }




    const dashboardItems: Record<UserRole, NavItem[]> = {
        citizen: [
            { icon: Home, label: "Dashboard", link: "/dashboard/citizen" },
            { icon: User, label: "Profile", link: "/dashboard/citizen/profile" },
            { icon: FileText, label: "My Requests", link: "/dashboard/citizen/my-donation-requests" },
            { icon: PlusCircle, label: "Create Request", link: "/dashboard/citizen/create-donation-request" },
        ],
        officer: [
            { icon: Home, label: "Dashboard", link: "/dashboard/officer" },
            { icon: User, label: "Profile", link: "/dashboard/officer/profile" },
            { icon: FileText, label: "My Requests", link: "/dashboard/officer/my-donation-requests" },
            { icon: PlusCircle, label: "Create Request", link: "/dashboard/officer/create-donation-request" },
            { icon: Droplet, label: "Public Requests", link: "/dashboard/officer/all-blood-donation-request" },
        ],
        admin: [
            { icon: Home, label: "Dashboard", link: "/dashboard/admin" },
            { icon: User, label: "Profile", link: "/dashboard/admin/profile" },
            { icon: FileText, label: "My Requests", link: "/dashboard/admin/my-donation-requests" },
            { icon: PlusCircle, label: "Create Request", link: "/dashboard/admin/create-donation-request" },
            { icon: Users, label: "All Users", link: "/dashboard/admin/all-users" },
            { icon: Droplet, label: "Public Requests", link: "/dashboard/admin/all-blood-donation-request" },
        ],
    };

    const navItems: NavItem[] = dashboardItems[role] || dashboardItems['citizen'];

    return (
        <div className="flex">


            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger >
                        <Button variant="outline" size="icon" className="bg-white border-slate-200 rounded-xl shadow-sm">
                            <Menu className="w-5 h-5 text-slate-800" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[260px] p-6 bg-white dark:bg-slate-900 flex flex-col gap-6">
                        <SheetHeader className="px-2 text-left">
                            <SheetTitle>
                                <Link href="/" className="flex items-center gap-1">
                                    <Image
                                        width={34}
                                        height={33}
                                        alt='logo'
                                        className='object-cover mt-2 h-[50px] w-auto'
                                        src='https://i.ibb.co.com/Jj3R0f8L/blood-donation-logo-template-vector-35411128-Photoroom-removebg-preview.png'
                                    />
                                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        <span className='text-[#db0000]'>Blood</span>Connect
                                    </span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <nav className="flex flex-col gap-1 w-full mt-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    onClick={() => setIsSheetOpen(false)}
                                    href={item.link}
                                    className={`block rounded-xl w-full ${pathname === item.link
                                            ? "bg-[#db0000] font-semibold leading-tight text-white py-2 px-3 flex items-center gap-2"
                                            : "flex gap-2 items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop View - Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 sticky top-0 h-screen">
                <div className="flex-shrink-0 mb-7 mt-1.5">
                    <Link href="/" className="flex items-center gap-1">
                        <Image
                            width={45}
                            height={45}
                            alt='logo'
                            className='h-[43px] w-auto'
                            src='https://i.ibb.co.com/9H990mRT/blood-donation-logo-template-vector-35411128-Photoroom-removebg-preview-removebg-preview.png'
                        />
                        <span className="text-xl mt-2.5 font-extrabold text-slate-900 dark:text-white tracking-tight">
                            <span className='text-[#E11D48]'>Blood</span>Connect
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-col flex-grow gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.link}
                            className={`block rounded-xl w-full transition-all ${pathname === item.link
                                    ? "bg-[#db0000] font-semibold text-white py-2 px-3 flex items-center gap-2"
                                    : "flex gap-2 items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-[#db0000a0] hover:text-white dark:hover:bg-slate-800"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}

                    <div className="grow" />

                    {/* Shadcn Avatar Block */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2.5 w-full mx-auto mb-2 items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.image || undefined} alt={user?.name || "User Profile"} />
                            <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold">
                                {user?.name?.slice(0, 2).toUpperCase() || "BC"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden leading-tight">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Shadcn Button with Lucide LogOut Icon */}
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className='bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-[#db0000] dark:text-rose-400 font-semibold w-full flex items-center justify-center gap-2 rounded-xl border-none shadow-none h-10'
                    >
                        Log Out <LogOut className="w-4 h-4" />
                    </Button>
                </nav>
            </aside>
        </div>
    );
}