"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    toggleOpen: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-slate-200/60 dark:border-slate-800/80 last:border-b-0">
            <button
                onClick={toggleOpen}
                className="w-full py-5 flex items-start justify-between text-left gap-4 group cursor-pointer"
            >
                <div className="flex gap-3 items-start">
                    <HelpCircle className={`w-4 h-4 mt-1 shrink-0 transition-colors duration-300 ${
                        isOpen ? 'text-[#f05a28]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`} />
                    <span className={`text-sm md:text-base font-bold tracking-wide transition-colors duration-300 ${
                        isOpen ? 'text-[#f05a28] dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                    }`}>
                        {question}
                    </span>
                </div>
                <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#f05a28] border-emerald-500/20' : 'text-slate-400'
                }`}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 pl-7 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0); 

    const faqs = [
        {
            question: "How do I report an issue?",
            answer: "Report an issue by logging into your account, filling out the report form, and submitting the required details."
        },
        {
            question: "Can I track the status of my report?",
            answer: "Yes. You can track the progress of your report from submission to resolution."
        },
        {
            question: "Who can comment on reports?",
            answer: "Registered citizens can comment on public reports to share feedback and suggestions."
        },
        {
            question: "Who can create notices and campaigns?",
            answer: "Only authorized administrators can create and publish notices and community campaigns."
        },
        {
            question: "Can I contribute to community projects?",
            answer: "Yes. Citizens can support approved community initiatives through the funding feature."
        },
        {
            question: "Who manages reported issues?",
            answer: "Authorized officers review, update, and resolve reported issues, while administrators oversee the overall management."
        }
    ];

    return (
        <section className="w-full py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                
                <div className="text-center space-y-3 mb-16">
                    
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                    Everything You Need to Know
                    </h2>
                    <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Got questions? We have got answers. Everything you need to know about the CityFix ecosystem.
                    </p>
                </div>

                
                <div className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/70 rounded-[2rem] p-6 md:p-8 backdrop-blur-xs shadow-xs">
                    {faqs.map((faq, index) => (
                        <FaqItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            toggleOpen={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FaqSection;