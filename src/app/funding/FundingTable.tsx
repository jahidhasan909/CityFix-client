"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Loader2 } from "lucide-react"; 

interface FundingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const Funding: React.FC<FundingProps> = ({ isOpen, onOpenChange }) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    

    setLoading(true);
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong with Stripe session generation.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-850">
        <DialogHeader className="text-center my-2">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Contribute Today</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your contribution helps save lives.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            className="w-full text-slate-900 dark:text-white"
            type="number"
            placeholder="$ Amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            disabled={loading}
          />
        </div>

        <div className="mt-2">
          <Button
            className="w-full font-bold bg-red-600 hover:bg-red-700 text-white h-11 transition-all rounded-xl"
            onClick={handleDonate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Pay"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Funding;