"use client";

import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";

import { motion } from 'framer-motion';
import { RiRefund2Line } from "react-icons/ri";
import Funding from './FundingTable';

export interface FundItem {
  _id: string;
  name: string;
  amount: number | string;
  date: string;
  status?: string;
}

const Fundingpage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [funds, setFunds] = useState<FundItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchPaginatedFunds = async () => {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

      try {
        const response = await fetch(`${backendUrl}/api/pegination/funding?page=${currentPage}&limit=10`);
        if (response.ok) {
          const result = await response.json();
          setFunds(result.data || []);
          setCurrentPage(result.page || 1);
          setTotalPages(result.totalPage || 1);
        }
      } catch (error) {
        console.error("Error loading paginated funds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaginatedFunds();
  }, [currentPage]);


  const grandTotal = useMemo(() => {
    return funds.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [funds]);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className='bg-white/10 min-h-screen dark:bg-slate-950/20'>
      <div className="max-w-[1400px] w-11/12 px-2 mx-auto py-28 md:py-40 space-y-6 md:space-y-8 pb-24 relative">
        
        <div className='text-center'>
          <h1 className='text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white'>Community Funding History</h1>
          <p className='text-xs md:text-[1rem] text-gray-500 dark:text-gray-300 mt-2'>
            View recent community donations and contribute to support our mission.
          </p>
          
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#db0000]/20 to-red-55 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4 shadow-xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Contribute Now</h1>
          </div>

          <div className="relative inline-block p-[2px] overflow-hidden rounded-xl group">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
            />
            <Button
              onClick={() => setIsOpen(true)}
              className="relative font-bold bg-[#db0000] hover:bg-[#db00008b] text-white text-base h-12 px-6 rounded-xl transition-all flex items-center justify-center w-full border-none"
            >
              <RiRefund2Line className="mr-2" />
              Give Fund
            </Button>
          </div>
        </div>

        {funds.length > 0 || loading ? (
          <section className="space-y-4 relative">
            
         
            <div className="hidden lg:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Donor Name</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Fund Amount</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Funding Date</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-400">
                        Loading funding logs...
                      </TableCell>
                    </TableRow>
                  ) : (
                    funds.map((fund) => (
                      <TableRow key={fund._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <TableCell className="font-semibold text-slate-700 dark:text-slate-300">{fund.name}</TableCell>
                        <TableCell className="font-bold text-slate-900 dark:text-white">${Number(fund.amount).toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-slate-500 dark:text-slate-400">{fund.date}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30">
                            • {fund.status || 'success'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Desktop Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="text-xs font-semibold"
                  >
                    Prev
                  </Button>
                  {pages.map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === currentPage ? "default" : "ghost"}
                      onClick={() => setCurrentPage(p)}
                      className={`text-xs px-3 ${p === currentPage ? 'bg-red-600 hover:bg-red-700 text-white font-bold' : ''}`}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="text-xs font-semibold"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {loading ? (
                <div className="text-center p-8 text-slate-400">Loading funding history...</div>
              ) : (
                funds.map((fund) => (
                  <div key={fund._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{fund.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Date: {fund.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          ${Number(fund.amount).toFixed(2)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30">
                          • {fund.status || 'success'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

             
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

          </section>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-xl text-slate-400 border-slate-200 dark:border-slate-800">
            No funding logs available on this page.
          </div>
        )}

        <Funding isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    </div>
  );
};

export default Fundingpage;