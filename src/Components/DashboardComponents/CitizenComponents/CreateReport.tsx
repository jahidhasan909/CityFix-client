"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/Components/ui/button"; 
import { Input } from "@/Components/ui/input"; 
import { Label } from "@/Components/ui/label"; 
import { Textarea } from "@/Components/ui/textarea"; 
import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadImagebb } from "@/lib/action/UploadImgbb";
import { Check, Loader2 } from "lucide-react";

interface ReportFormData {
    title: string;
    description: string;
    category: string;
    district: string;
    upazila: string;
    images: FileList;
}

interface District {
    id: string;
    name: string;
}

interface Upazila {
    id: string;
    district_id: string;
    name: string;
}

export default function CreateReportRequest() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<ReportFormData>({
        defaultValues: {
            title: "",
            description: "",
            category: "",
            district: "",
            upazila: "",
        }
    });

    const selectedDistrict = watch("district");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    fetch("/districts.json"),
                    fetch("/upazilas.json"),
                ]);

                const districtData = await districtRes.json();
                const upazilaData = await upazilaRes.json();

                setDistricts(districtData?.[2]?.data || []);
                setUpazilas(upazilaData?.[2]?.data || []);
            } catch (error) {
                console.error("Failed to load location data", error);
                toast.error("Failed to load location data");
            }
        };

        loadData();
    }, []);

    const filteredUpazilas = upazilas.filter(
        (u) => u.district_id === selectedDistrict
    );

    const { data: userData, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-[#f05a28]" />
            </div>
        );
    }

    const user = userData?.user;

    if (!user) {
        return <div className="text-center py-20 text-slate-500 font-medium">Please log in to submit a report.</div>;
    }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

    const onSubmit = async (data: ReportFormData) => {
        if (!data.images || data.images.length !== 3) {
            toast.error("You must upload exactly 3 images!");
            return;
        }

        try {
            setIsLoading(true);

            const districtName = districts.find((d) => d.id === data.district)?.name || "";
            const upazilaName = upazilas.find((u) => u.id === data.upazila)?.name || "";
            const locationString = `${upazilaName}, ${districtName}`;

            const uploadPromises = Array.from(data.images).map((file) => UploadImagebb(file));
            const uploadedImagesRes = await Promise.all(uploadPromises);
            
            const imageUrls = uploadedImagesRes.map((img) => img?.url).filter(Boolean);

            if (imageUrls.length !== 3) {
                toast.error("Failed to upload all 3 images. Please try again.");
                return;
            }

            const reportPayload = {
                title: data.title,
                description: data.description,
                category: data.category,
                location: locationString,
                image: imageUrls,
                citizenId: user.id,
                citizenName: user.name,
                citizenEmail: user.email,
                citizenImage: user.image,
                status: "pending",
                createdAt: new Date(),
            };

            const res = await fetch(`${baseurl}/api/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportPayload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Report submitted successfully!");
                reset();
            } else {
                toast.error(result?.message || "Failed to submit report");
            }
        } catch (error) {
            console.error("Submission error", error);
            toast.error("Something went wrong during submission");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" dark:bg-slate-950 min-h-screen py-12 px-4 transition-colors duration-300">
            <div className="relative max-w-3xl mx-auto">
                {/* Form Card */}
                <div className="relative overflow-hidden z-10 w-full rounded-[2rem] bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm border border-slate-200/60 dark:border-slate-800/80">
                    
                    {/* Opacity Controlled Background Pattern Overlay */}
                    <div
                        className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.04] dark:opacity-[0.02] pointer-events-none mix-blend-overlay w-full rounded-[2rem]"
                        style={{
                            backgroundImage: "url('https://i.ibb.co.com/JjtCjy4m/Screenshot-2026-06-19-at-11-15-06-PM.png')"
                        }}
                    />

                    {/* Header */}
                    <div className="mb-8 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Create a New Incident Report
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            Provide precise operational details and upload exactly 3 evidence photos to file your report.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* Readonly User Metadata Info */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Citizen Name</Label>
                                <Input value={user?.name || ""} disabled className="cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/40 rounded-xl" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Citizen Email</Label>
                                <Input value={user?.email || ""} disabled className="cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/40 rounded-xl" />
                            </div>
                        </div>

                        {/* Title and Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="title" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Report Title</Label>
                                <Input 
                                    id="title" 
                                    placeholder="Enter report title" 
                                    className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${
                                        errors.title ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                    }`}
                                    {...register("title", { required: "Title is required" })} 
                                />
                                {errors.title && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.title.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="category" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="category"
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all cursor-pointer ${
                                                errors.category ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                            }`}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select category</option>
                                            <option value="Road Damage & Potholes" className="bg-white dark:bg-slate-900">Road Damage & Potholes</option>
                                            <option value="Traffic & Road Safety" className="bg-white dark:bg-slate-900">Traffic & Road Safety</option>
                                            <option value="Electricity Issues" className="bg-white dark:bg-slate-900">Electricity Issues</option>
                                            <option value="Public Safety" className="bg-white dark:bg-slate-900">Public Safety</option>
                                            <option value="Public Health & Sanitation" className="bg-white dark:bg-slate-900">Public Health & Sanitation</option>
                                            <option value="Other" className="bg-white dark:bg-slate-900">Other Emergency</option>
                                        </select>
                                    )}
                                />
                                {errors.category && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.category.message}</span>}
                            </div>
                        </div>

                        {/* District & Upazila */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="district" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">District</Label>
                                <Controller
                                    name="district"
                                    control={control}
                                    rules={{ required: "District is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="district"
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all cursor-pointer ${
                                                errors.district ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                            }`}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setValue("upazila", "");
                                            }}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select district</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id} className="bg-white dark:bg-slate-900">
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.district && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.district.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="upazila" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Upazila</Label>
                                <Controller
                                    name="upazila"
                                    control={control}
                                    rules={{ required: "Upazila is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="upazila"
                                            disabled={!selectedDistrict}
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                                                errors.upazila ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                            }`}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select upazila</option>
                                            {filteredUpazilas.map((upazila) => (
                                                <option key={upazila.id} value={upazila.id} className="bg-white dark:bg-slate-900">
                                                    {upazila.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.upazila && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.upazila.message}</span>}
                            </div>
                        </div>

                        {/* Evidence Images */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="images" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                Attach Evidence Images (Exactly 3 files required)
                            </Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-2.5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all cursor-pointer file:text-xs file:font-bold file:text-[#f05a28] file:bg-[#f05a28]/10 file:rounded-lg file:border-none file:px-3 file:py-1 file:mr-3 ${
                                    errors.images ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                }`}
                                {...register("images", { 
                                    required: "You must attach evidence images",
                                    validate: (files) => files.length === 3 || "You must select exactly 3 images"
                                })}
                            />
                            {errors.images ? (
                                <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.images.message}</span>
                            ) : (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pl-1 mt-1">Hold Ctrl (or Cmd) to select exactly 3 photos.</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="description" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                Description (Detailed Incident Analysis)
                            </Label>
                            <Textarea
                                {...register("description", { required: "Description is required" })}
                                id="description"
                                rows={4}
                                placeholder="Provide full structural parameters and facts regarding this situation..."
                                className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl p-4 outline-none focus-visible:ring-0 focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all resize-none ${
                                    errors.description ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                }`}
                            />
                            {errors.description && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.description.message}</span>}
                        </div>

                        {/* Animated Border Submit Button */}
                        <div className="mt-4 flex w-full relative overflow-hidden rounded-xl p-[1px]">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#f05a28_50%,#E2E8F0_100%)]"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative overflow-hidden h-12 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-[#f05a28] font-bold shadow-md rounded-xl disabled:opacity-75 transition-all flex items-center justify-center border-none hover:cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting Report...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Submit Incident Report
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}