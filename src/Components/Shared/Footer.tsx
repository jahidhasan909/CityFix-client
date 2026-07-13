"use client";
import React from 'react';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    const pathname = usePathname()
    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }


    return (

        <footer className="relative   bg-[#f8fafc] dark:bg-white/20  text-slate-600 pt-12 md:pb-8 font-sans overflow-hidden select-none">

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                viewport={{ once: true }}
            >

                <div className="relative mb-11 max-w-7xl lg:mb-30 container mx-auto bg-white dark:bg-white/10 rounded-2xl border border-slate-100 shadow-sm px-6 sm:px-12 pt-16 pb-7 z-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-slate-100">


                        <div className="lg:col-span-2 space-y-3">
                            <Link href="/" className="flex items-center gap- flex-shrink-0">
                                <Image width={60} height={70} alt='logo' className='mt-2 h-[70px]' src={'https://i.ibb.co.com/Q54kMTN/Chat-GPT-Image-Jul-12-2026-at-04-36-38-AM-removebg-preview.png'}></Image>
                               Cityfix
                                    
                            </Link>

                            <p className="text-sm text-slate-500 dark:text-gray-300 leading-relaxed max-w-sm">
                                BloodConnect connects donors with people who need blood in real time. Join our trusted community and help save lives quickly and safely.
                            </p>


                            <div className="flex items-center gap-4 pt-2">
                                <Link href="https://x.com" target="_blank" className="text-slate-800  dark:text-white hover:text-[#E11D48] transition-colors">
                                    <FaTwitter className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                                </Link>
                                <Link href="https://instagram.com" target="_blank" className="text-slate-800 dark:text-white hover:text-[#E11D48] transition-colors">
                                    <FaInstagram className="w-5 h-5" />
                                </Link>
                                <Link href="https://linkedin.com" target="_blank" className="text-slate-800 dark:text-white hover:text-[#E11D48] transition-colors">
                                    <FaLinkedin className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                                </Link>
                                <Link href="https://github.com" target="_blank" className="text-slate-800 dark:text-white hover:text-[#E11D48] transition-colors">
                                    <FaGithub className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4 mt-5">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Services</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/search-donor" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Search Donors</Link></li>
                                <li><Link href="/donation-requests" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Blood Requests</Link></li>
                                <li><Link href="/register" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Join As Donor</Link></li>
                                <li><Link href="/funding" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Funding & Support</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4 mt-5">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white  tracking-wider uppercase">Resources</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/blogs" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Health Blogs</Link></li>
                                <li><Link href="/faq" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">FAQs</Link></li>
                                <li><Link href="/guidelines" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Eligibility Guide</Link></li>
                                <li><Link href="/support" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Help Support</Link></li>
                            </ul>
                        </div>


                        <div className="space-y-4 mt-5">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white  tracking-wider uppercase">Company</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/about" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">About Us</Link></li>
                                <li><Link href="/careers" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Careers</Link></li>
                                <li><Link href="/contact" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Contact</Link></li>
                                <li><Link href="/partners" className="hover:text-[#E11D48] transition-colors dark:text-gray-300">Our Partners</Link></li>
                            </ul>
                        </div>

                    </div>


                    <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
                        <p className="text-xs text-slate-400 dark:text-gray-300 order-2 sm:order-1">
                            &copy; {currentYear} BloodBridge. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-slate-500 order-1 sm:order-2">
                            <Link href="/privacy-policy" className="hover:text-slate-800 hover:underline transition-all dark:text-gray-300">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="hover:text-slate-800 hover:underline transition-all dark:text-gray-300">Terms of Service</Link>
                            <Link href="/cookies-settings" className="hover:text-slate-800 hover:underline transition-all dark:text-gray-300">Cookies Settings</Link>
                        </div>
                    </div>

                </div>

                <div className="absolute  left-1/2 bottom-0 -translate-x-1/2 container mx-auto text-center pointer-events-none z-0 h-[10vw] flex items-end justify-center overflow-visible px-4 sm:px-6 lg:px-8">
                    <span className="text-[11vw] font-black tracking-tighter dark:text-rose-300/[0.10]  text-rose-900/[0.06] uppercase block leading-none translate-y-[15%] select-none">
                       Cityfix
                    </span>
                </div>
            </motion.div>


        </footer>
    );
};

export default Footer;