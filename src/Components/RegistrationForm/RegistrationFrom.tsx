"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadImagebb } from "@/lib/action/UploadImgbb";
import { Activity, Loader2, UserPlus } from "lucide-react";

interface RegistrationFormData {
    fullName: string;
    email: string;
    image: FileList;
    district: string;
    upazila: string;
    password: string;
    confirmPassword: string;
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

export default function RegistrationForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            image: null as unknown as FileList,
            district: "",
            upazila: "",
            password: "",
            confirmPassword: "",
        }
    });

    const selectedDistrict = watch("district");

    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);

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
                toast.error("Failed to load location data");
            }
        };

        loadData();
    }, []);

    const filteredUpazilas = upazilas.filter(
        (u) => u.district_id === selectedDistrict
    );

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

    const onSubmit = async (data: RegistrationFormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const districtName = districts.find((d) => d.id === data.district)?.name;
            const upazilaName = upazilas.find((u) => u.id === data.upazila)?.name;

            const imageFile = data.image[0];
            const image = await UploadImagebb(imageFile);

            const { data: resdata, error } = await authClient.signUp.email({
                name: data.fullName,
                email: data.email,
                password: data.password,
                image: image.url,
            });

            if (error) {
                toast.error(error.message || "Something went wrong during sign up");
                return;
            }

            if (resdata?.user?.id) {
                await fetch(`${baseurl}/api/usercollaction`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: resdata.user.id,
                        name: data.fullName,
                        email: data.email,
                        image: image.url,
                        district: districtName,
                        upazila: upazilaName,
                        role: "citizen",
                        status: "active",
                    }),
                });

                toast.success("Verification complete. Welcome!");
                redirect("/");
            }
        } catch (err) {
            toast.error("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 font-sans">

            {/* Left Side: Image Banner with Overlay Texts */}
            <div className="relative hidden md:block md:w-1/2 lg:w-3/5">
                <Image
                    src="https://i.ibb.co.com/845b83GQ/Chat-GPT-Image-Jul-16-2026-at-12-14-45-AM.png"
                    alt="Registration Banner"
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/50" />

                <div className="absolute inset-0 flex flex-col justify-between p-12 lg:p-16 text-white z-10">

                   
                    <div className="flex items-center gap-2">
                        <Image
                            width={34}
                            height={33}
                            alt='logo'
                            className='object-cover h-[29px] md:h-[34px] w-auto'
                            src='https://i.ibb.co.com/Q54kMTN/Chat-GPT-Image-Jul-12-2026-at-04-36-38-AM-removebg-preview.png'
                        />
                        <span className="text-sm  lg:text-2xl font-bold dark:text-white tracking-tight">
                            City<span className='text-[#f05a28]'>Fix</span>
                        </span>
                    </div>

                    {/* Heading and Description */}
                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Together, We Can Build a Better <span className="text-[#f05a28]">Bangladesh</span> 
                        </h2>
                        <p className="text-sm lg:text-base font-medium text-slate-200/90 leading-relaxed">
                           Every new citizen strengthens our mission to create cleaner streets, safer neighborhoods, and stronger communities.
                        </p>
                    </div>

                    {/* Footer text */}
                    <p className="text-xs font-medium text-slate-400">
                        © {new Date().getFullYear()} CityFix. All rights reserved.
                    </p>
                </div>
            </div>


            <div className="flex w-full md:w-1/2 lg:w-2/5 flex-col justify-center items-center p-6 sm:p-10 lg:p-12">


                <div className="relative w-full max-w-xl">


                    <div className="absolute inset-0 bg-[#f05a28]/10 dark:bg-slate-900/40 border border-[#f05a28]/10 dark:border-slate-800 rounded-[2.5rem] translate-y-3.5 translate-x-2.5 -z-10" />


                    <Card className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm transition-all">
                        <CardContent className="p-0 space-y-8">


                            <div className="text-center space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Join the Community
                                </h1>
                                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Create your account to connect and help fix our city.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">

                                {/* Full Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="fullName" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'
                                                }`}
                                            {...register("fullName", { required: true })}
                                        />
                                        {errors.fullName && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Name is required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${errors.email ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'
                                                }`}
                                            {...register("email", {
                                                required: true,
                                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                            })}
                                        />
                                        {errors.email && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Valid email is required</p>}
                                    </div>
                                </div>

                                {/* Profile Image */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <Label htmlFor="image" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                        Profile Image
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="w-full cursor-pointer bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-3 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-0 focus-visible:border-[#f05a28]"
                                        {...register("image", { required: true })}
                                    />
                                    {errors.image && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Profile image is required</p>}
                                </div>

                                {/* District & Upazila */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="district" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            District
                                        </Label>
                                        <Controller
                                            name="district"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    id="district"
                                                    className="flex h-11 w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-300 text-xs font-semibold rounded-xl px-3 outline-none focus:border-[#f05a28] transition-all cursor-pointer"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setValue("upazila", "");
                                                    }}
                                                >
                                                    <option value="" className="dark:bg-slate-900">Select district</option>
                                                    {districts.map((district) => (
                                                        <option key={district.id} value={district.id} className="dark:bg-slate-900">
                                                            {district.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.district && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">District is required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="upazila" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Upazila
                                        </Label>
                                        <Controller
                                            name="upazila"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    id="upazila"
                                                    disabled={!selectedDistrict}
                                                    className="flex h-11 w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-300 text-xs font-semibold rounded-xl px-3 outline-none focus:border-[#f05a28] transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                                >
                                                    <option value="" className="dark:bg-slate-900">Select upazila</option>
                                                    {filteredUpazilas.map((upazila) => (
                                                        <option key={upazila.id} value={upazila.id} className="dark:bg-slate-900">
                                                            {upazila.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.upazila && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Upazila is required</p>}
                                    </div>
                                </div>

                                {/* Password & Confirm Password */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Min 8 characters"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${errors.password ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'
                                                }`}
                                            {...register("password", { required: true, minLength: 8 })}
                                        />
                                        {errors.password && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Min 8 characters required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5 w-full">
                                        <Label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm password"
                                            className="w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all"
                                            {...register("confirmPassword", { required: true })}
                                        />
                                    </div>
                                </div>

                                {/* Animated Glowing Conic Border Submit Button */}
                                <div className="relative block p-[1px] rounded-xl overflow-hidden mt-4">
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
                                            <Loader2 className="h-4 w-4 animate-spin text-[#f05a28]" />
                                        ) : (
                                            <>
                                                <UserPlus className="w-4.5 h-4.5 mr-2" /> Create Account
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Link to Login Page */}
                                <div className="mt-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                                    Already have an account?{" "}
                                    <Link href="/login" className="font-bold text-[#f05a28] hover:underline ml-1">
                                        Log In
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}