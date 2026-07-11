"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/Components/providers/ThemeToggle';

import { authClient } from '@/lib/auth-client';

import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/Components/ui/dropdown-menu";
import { UserData } from '@/types/geo';

interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
}

const Navbar: React.FC = () => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
    const { data, isPending } = authClient.useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    const user = data?.user as User | undefined;

    // ১. FIXED: Infinite Loop বাগ দূর করতে Dependency Array [user?.email, baseurl] যোগ করা হয়েছে
    useEffect(() => {
        if (user?.email) {
            fetch(`${baseurl}/api/own/usercollaction?email=${user?.email}`)
                .then(res => res.json())
                .then(userEmail => setUserData(userEmail))
                .catch(err => console.error("Error fetching user:", err));
        }
    }, [user?.email, baseurl]);

    if (isPending) {
        return (
            <div className="flex h-16 items-center justify-center text-slate-500 font-medium">
                Loading...
            </div>
        );
    }

    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }

    
    const linkClass = (path: string): string =>
        pathname === path
            ? "text-[#f05a28] font-bold transition-colors"
            : "text-slate-700 hover:text-[#f05a28] dark:text-slate-200 dark:hover:text-[#f05a28] font-medium transition-colors";

    return (
        <nav className="fixed top-0 z-50 w-full">
           
          
            <div className="px-4 container border border-slate-200/80 my-4 bg-white/80  shadow-md rounded-2xl backdrop-blur-md mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0 gap-1">
                        <Image
                            width={34}
                            height={33}
                            alt='logo'
                            className='object-cover h-[35px] md:h-[45px] w-auto'
                            src='https://i.ibb.co.com/nN9v8hMX/Chat-GPT-Image-Jul-11-2026-at-04-15-12-AM-removebg-preview.png'
                        />
                        <span className="text-sm mt-1 lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            City<span className='text-[#f05a28]'>Fix</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/reports" className={linkClass('/reports')}>Reports</Link>
                        <Link href="/campaign" className={linkClass('/campaign')}>Campaign</Link>
                        {user && <Link href="/funding" className={linkClass('/funding')}>Funding</Link>}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Theme toggle  */}
                        <ThemeToggle />
                        {!user ? (
                            <Link href='/login' className="group relative inline-flex overflow-hidden rounded-md p-[2px]">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                                />
                                <Button className="relative z-10 rounded-md bg-[#f05a28] px-6 font-bold text-white shadow-sm transition-all hover:bg-[#e04f20] cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger >
                                    <button className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95">
                                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                            <AvatarImage alt={user?.name} src={user?.image} />
                                            <AvatarFallback className="bg-rose-100 text-[#31b66f] dark:bg-zinc-800 dark:text-green-400 font-semibold">
                                                {user?.name?.slice(0, 2).toUpperCase() || "CF"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userData?.name || user?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{userData?.email || user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link href={`/dashboard/${userData?.role || user?.role || 'citizen'}`} className="w-full block">
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                await authClient.signOut();
                                                window.location.href = '/';
                                            }}
                                            className="text-red-600 dark:text-red-400 cursor-pointer flex justify-between items-center focus:bg-red-50 dark:focus:bg-red-950/20"
                                        >
                                            <span>Log Out</span>
                                            <ArrowRight className="size-4" />
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* Theme toggle */}
                        <ThemeToggle />
                        {user && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger >
                                    <button className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95">
                                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                            <AvatarImage alt={user?.name} src={user?.image} />
                                            <AvatarFallback className="bg-orange-200 text-[#f05a28] dark:bg-zinc-800 dark:text-orange-400 font-semibold">
                                                {user?.name?.slice(0, 2).toUpperCase() || "CF"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userData?.name || user?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{userData?.email || user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link href={`/dashboard/${userData?.role || user?.role || 'citizen'}`} className="w-full block">
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                await authClient.signOut();
                                                window.location.href = '/';
                                            }}
                                            className="text-red-600 dark:text-red-400 cursor-pointer flex justify-between items-center focus:bg-red-50 dark:focus:bg-red-950/20"
                                        >
                                            <span>Log Out</span>
                                            <ArrowRight className="size-4" />
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {!user && (
                            <Link href='/login' className="group relative inline-flex overflow-hidden rounded-md p-[2px]">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                                />
                                <Button className="relative z-10 h-8 rounded-md bg-[#f05a28] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#e04f20] cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-700 dark:text-slate-200 hover:text-[#f05a28] cursor-pointer"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-2 shadow-inner duration-200 z-50">
                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/reports"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/reports' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        Reports
                    </Link>
                    <Link
                        href="/campaign"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/campaign' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        Campaign
                    </Link>
                    {user && (
                        <Link
                            href="/funding"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-2.5 rounded-xl ${pathname === '/funding' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                        >
                            Funding
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;