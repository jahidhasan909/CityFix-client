"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {ArrowRight, Menu, X } from 'lucide-react';

// import { authClient } from '@/lib/auth-client';


import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
}

const Navbar: React.FC = () => {
    // const { data, isPending } = authClient.useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // if (isPending) {
    //     return (
    //         <div className="flex h-16 items-center justify-center">
    //             <Loader />
    //         </div>
    //     );
    // }

    const mockUser = {
    id: "user_123",
    name: "Jahid Hasan",
    email: "jahid@example.com",
    image: "https://github.com/shadcn.png", 
    role: "citizen" 
};

    const user = mockUser as User | undefined;

    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }

    const linkClass = (path: string): string =>
        pathname === path
            ? "text-[#31b66f] font-bold transition-colors"
            : "text-slate-700 hover:text-[#31b66f] dark:text-white/85 font-medium transition-colors";

    return (
        <nav className="fixed top-0 z-50 w-full">
            <div className="px-4 container border border-gray-100 my-4 bg-white/40 dark:bg-white/3 dark:border-white/6 shadow-md rounded-2xl backdrop-blur-md mx-auto sm:px-6 lg:px-8">
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
                            City<span className='text-[#31b66f]'>Fix</span>
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
                        

                        {!user ? (
                            <Link href='/login' className="group relative inline-flex overflow-hidden rounded-md p-[2px]">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                                />
                                <Button className="relative z-10 rounded-md bg-[#31b66f] px-6 font-bold text-white shadow-sm transition-all hover:bg-[#31b66f]">
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                                    <Avatar className="h-9 w-9 border border-gray-200 dark:border-zinc-700">
                                        <AvatarImage alt={user.name} src={user.image} />
                                        <AvatarFallback className="bg-rose-100 text-[#31b66f] dark:bg-zinc-800 dark:text-green-400 font-semibold">
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 dark:bg-zinc-950 dark:border-zinc-800">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem  className="cursor-pointer">
                                        <Link href={`/dashboard/${user.role}`} className="w-full">
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        // onClick={() => authClient.signOut()} 
                                        className="text-green-600 dark:text-green-400 cursor-pointer flex justify-between items-center"
                                    >
                                        <span>Log Out</span>
                                        <ArrowRight className="size-4" />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden flex items-center gap-2">
                      

                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage alt={user.name} src={user.image} />
                                        <AvatarFallback className="bg-green-100 text-[#31b66f] font-semibold">
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 mt-2 dark:bg-zinc-950 dark:border-zinc-800">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-0.5">
                                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem >
                                        <Link href={`/dashboard/${user.role}`}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        // onClick={() => authClient.signOut()} 
                                        className="text-green-600 dark:text-green-400 flex justify-between items-center"
                                    >
                                        <span>Log Out</span>
                                        <ArrowRight className="size-3.5" />
                                    </DropdownMenuItem>
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
                                <Button className="relative z-10 h-8 rounded-md bg-[#31b66f] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#31b66f]">
                                    Login
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-700 dark:text-white hover:text-[#31b66f]"
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
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/' ? 'bg-green-50 dark:bg-zinc-900 text-[#31b66f] font-semibold' : 'text-slate-700 dark:text-white/80 hover:bg-slate-50'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/reports"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/reports' ? 'bg-green-50 dark:bg-zinc-900 text-[#31b66f] font-semibold' : 'text-slate-700 dark:text-white/80 hover:bg-slate-50'}`}
                    >
                        Reports
                    </Link>
                    <Link
                        href="/campaign"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/campaign' ? 'bg-green-50 dark:bg-zinc-900 text-[#31b66f] font-semibold' : 'text-slate-700 dark:text-white/80 hover:bg-slate-50'}`}
                    >
                        Campaign
                    </Link>
                    {user && (
                        <Link
                            href="/funding"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-2.5 rounded-xl ${pathname === '/funding' ? 'bg-rose-50 dark:bg-zinc-900 text-[#31b66f] font-semibold' : 'text-slate-700 dark:text-white/80 hover:bg-slate-50'}`}
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