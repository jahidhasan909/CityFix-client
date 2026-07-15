'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import emailjs from "@emailjs/browser";

interface FormDataProps {
  name: string;
  email: string;
  title: string;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS Environment Variables");
      toast.error("Configuration error. Please try again later.");
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          title: formData.title,
          message: formData.message,
        },
        publicKey
      );

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        title: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900 text-slate-600 py-24 px-4 sm:px-6 lg:px-8 select-none font-sans overflow-hidden antialiased transition-colors duration-300">
      <div className="max-w-[85%] mx-auto">

        <div className="mb-16 space-y-3 text-center">
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Contact Us
          </h2>
          <p className="text-xs lg:text-[1rem] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            Have questions or need blood support? Our team is here to help you anytime.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* LEFT COLUMN: CONTACT DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              {/* Urgent Emergency Card (Updated with brand color #f05a28) */}
              <Card className="bg-[#f05a28] dark:bg-emerald-950/40 text-white rounded-[2rem] p-8 shadow-lg shadow-[#f05a28]/10 relative overflow-hidden group border dark:border-emerald-900/40">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-32 h-32" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200 dark:text-emerald-400 block mb-2">
                  24/7 Emergency Hotline
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  Urgent Support
                </h3>
                <a href="tel:+8801576447000" className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:underline block mb-1">
                  +880 1576447***
                </a>
                <p className="text-xs text-orange-100/80 dark:text-slate-400 leading-relaxed">
                  Call directly for zero-latency communication during medical crises. Our support syncs across blood dispatch networks.
                </p>
              </Card>

              {/* Info Rows Container Card */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-slate-900 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight dark:text-white">Official Email</h4>
                    <a href="mailto:bloodcnnct@gmail.com" className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#f05a28] dark:hover:text-emerald-400 transition-colors">
                      bloodcnnct@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-slate-900 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Headquarter</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Level 4, Sector 11, Uttara, <br /> Dhaka-1230, Bangladesh
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM INPUTS */}
            <Card className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-10 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jahid Hasan"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 focus:border-[#f05a28] dark:focus:border-emerald-500 text-slate-900 dark:text-white text-sm font-medium rounded-xl px-4 py-3 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="developer@example.com"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 focus:border-[#f05a28] dark:focus:border-emerald-500 text-slate-900 dark:text-white text-sm font-medium rounded-xl px-4 py-3 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Subject Context</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Inquiring about volunteer verification pipelines"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 focus:border-[#f05a28] dark:focus:border-emerald-500 text-slate-900 dark:text-white text-sm font-medium rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Message Details</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your inquiry with context..."
                    className="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 focus:border-[#f05a28] dark:focus:border-emerald-500 text-slate-900 dark:text-white text-sm font-medium rounded-xl px-4 py-3 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <div className="relative group w-full p-[4px] rounded-lg overflow-hidden">
                    {/* Animated Border Gradient updated to use #f05a28 */}
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#f05a28_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#334155_0%,#10b981_50%,#334155_100%)]"
                    />
                    <Button
                      type='submit'
                      className="relative bg-[#f05a28] dark:bg-emerald-600 dark:hover:bg-emerald-700 hover:bg-[#f05a28]/90 text-white font-semibold text-base h-12 px-8 rounded-md transition-all flex items-center justify-center gap-2 w-full"
                    >
                      Send Message <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>

              </form>
            </Card>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;