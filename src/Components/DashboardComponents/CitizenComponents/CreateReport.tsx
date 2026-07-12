"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {  Button } from "@/Components/ui/button"; 
import {  Input} from "@/Components/ui/input"; 
import {  Label } from "@/Components/ui/label"; 
import { Textarea } from "@/Components/ui/textarea"; 
import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import { motion } from "framer-motion";
// import BlockedUser from "@/Components/Shared/Blockuser";
import { UploadImagebb } from "@/lib/action/UploadImgbb";
import { Check } from "lucide-react";


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
        return <div>loadin....</div>;
    }

    const user = userData?.user;

    if (!user) {
        return <div className="text-center py-10 text-foreground">Please log in to submit a report.</div>;
    }

    // if (user.status === "block" || user.status === "blocked") {
    //     return <div className=""><BlockedUser /></div>;
    // }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

    
    const onSubmit = async (data: ReportFormData) => {
        // count img
        if (!data.images || data.images.length !== 3) {
            toast.error("You must upload exactly 3 images!");
            return;
        }

        try {
            setIsLoading(true);

            const districtName = districts.find((d) => d.id === data.district)?.name || "";
            const upazilaName = upazilas.find((u) => u.id === data.upazila)?.name || "";
            const locationString = `${upazilaName}, ${districtName}`;

            // 3 img up
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
        <div className="bg-background min-h-screen py-10 px-4 text-foreground font-sans">
            <div className="relative max-w-4xl mx-auto">
                <div className="relative z-10 w-full rounded-[2rem] bg-card p-8 shadow-xl border border-border md:p-12">
                    
                    <div className="mb-8 border-b border-border pb-5">
                        <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Create a New Incident Report
                        </h1>
                        <p className="mt-2 text-xs lg:text-[1rem] text-muted-foreground">
                            Provide precise operational details and upload exactly 3 evidence photos to file your report.
                        </p>
                    </div>

                    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* Background Overlay */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center opacity-5 pointer-events-none mix-blend-multiply w-full rounded-[2rem]"
                            style={{
                                backgroundImage: "url('https://i.ibb.co.com/JjtCjy4m/Screenshot-2026-06-19-at-11-15-06-PM.png')"
                            }}
                        />

                    
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 rounded-xl border border-border bg-muted/30 z-10">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs font-semibold text-foreground/80">Citizen Name</Label>
                                <Input value={user?.name || ""} disabled className="cursor-not-allowed bg-muted" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs font-semibold text-foreground/80">Citizen Email</Label>
                                <Input value={user?.email || ""} disabled className="cursor-not-allowed bg-muted" />
                            </div>
                        </div>

                    
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 z-10">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="title" className="text-xs font-semibold text-foreground/80">Report Title</Label>
                                <Input 
                                    id="title" 
                                    placeholder="Enter report title" 
                                    className={errors.title ? "border-destructive focus-visible:ring-destructive" : "bg-background"}
                                    {...register("title", { required: "Title is required" })} 
                                />
                                {errors.title && <span className="text-xs text-destructive mt-1">{errors.title.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="category" className="text-xs font-semibold text-foreground/80">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="category"
                                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                                errors.category ? "border-destructive" : "border-input"
                                            }`}
                                        >
                                            <option value="">Select category</option>
                                            <option value="Road Damage & Potholes">Road Damage & Potholes</option>
                                            <option value="Traffic & Road Safety">Traffic & Road Safety</option>
                                            <option value="Electricity Issues">Electricity Issues</option>
                                            <option value="Public Safety">Public Safety</option>
                                            <option value="Public Health & Sanitation">Public Health & Sanitation</option>
                                            <option value="Other">Other Emergency</option>
                                        </select>
                                    )}

                                    
                       />
                                {errors.category && <span className="text-xs text-destructive mt-1">{errors.category.message}</span>}
                            </div>
                        </div>

               
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 z-10">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="district" className="text-xs font-semibold text-foreground/80">District</Label>
                                <Controller
                                    name="district"
                                    control={control}
                                    rules={{ required: "District is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="district"
                                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                                errors.district ? "border-destructive" : "border-input"
                                            }`}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setValue("upazila", "");
                                            }}
                                        >
                                            <option value="">Select district</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.district && <span className="text-xs text-destructive mt-1">{errors.district.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="upazila" className="text-xs font-semibold text-foreground/80">Upazila</Label>
                                <Controller
                                    name="upazila"
                                    control={control}
                                    rules={{ required: "Upazila is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="upazila"
                                            disabled={!selectedDistrict}
                                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                                                errors.upazila ? "border-destructive" : "border-input"
                                            }`}
                                        >
                                            <option value="">Select upazila</option>
                                            {filteredUpazilas.map((upazila) => (
                                                <option key={upazila.id} value={upazila.id}>
                                                    {upazila.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.upazila && <span className="text-xs text-destructive mt-1">{errors.upazila.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 z-10">
                            <Label htmlFor="images" className="text-xs font-semibold text-foreground/80">
                                Attach Evidence Images (Exactly 3 files required)
                            </Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                className={`cursor-pointer bg-background ${errors.images ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("images", { 
                                    required: "You must attach evidence images",
                                    validate: (files) => files.length === 3 || "You must select exactly 3 images"
                                })}
                            />
                            {errors.images ? (
                                <span className="text-xs text-destructive mt-1">{errors.images.message}</span>
                            ) : (
                                <span className="text-xs text-muted-foreground mt-1">Hold Ctrl (or Cmd) to select exactly 3 photos.</span>
                            )}
                        </div>

                       
                        <div className="flex flex-col gap-1.5 z-10">
                            <Label htmlFor="description" className="text-xs font-semibold text-foreground/80">
                                Description (Detailed Incident Analysis)
                            </Label>
                            <Textarea
                                {...register("description", { required: "Description is required" })}
                                id="description"
                                rows={4}
                                placeholder="Provide full structural parameters and facts regarding this situation..."
                                className={`w-full p-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none ${
                                    errors.description ? "border-destructive" : "border-input"
                                }`}
                            />
                            {errors.description && <span className="text-xs text-destructive mt-1">{errors.description.message}</span>}
                        </div>

                       
                        <div className="mt-4 flex w-full relative overflow-hidden rounded-lg p-[1px] z-10">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative overflow-hidden h-12 bg-rose-600 text-white font-semibold shadow-lg rounded-lg hover:bg-rose-700 disabled:opacity-70 transition-all flex items-center justify-center border-none"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                {isLoading ? "Submitting Report..." : "Submit Incident Report"}
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}