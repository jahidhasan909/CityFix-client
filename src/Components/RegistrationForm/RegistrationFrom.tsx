"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadImagebb } from "@/lib/action/UploadImgbb";


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
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-slate-950 font-sans">

            {/* Left Side */}
            <div className="relative flex w-full flex-col justify-center items-center px-4 py-12 md:w-1/2 lg:px-24">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-5 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('https://i.ibb.co.com/JjtCjy4m/Screenshot-2026-06-19-at-11-15-06-PM.png')"
                    }}
                />

                <Card className="w-full max-w-xl z-10 border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Join the Community
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 dark:text-gray-300">
                            Create your account to connect and manage your profile.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">

                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        required
                                        {...register("fullName", { required: true })}
                                    />
                                    {errors.fullName && <p className="text-xs text-red-500">Name required</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        required
                                        {...register("email", {
                                            required: true,
                                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                        })}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">Valid email required</p>}
                                </div>
                            </div>

                            {/* Profile Image */}
                            <div className="grid gap-2">
                                <Label htmlFor="image">Profile Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="cursor-pointer"
                                    {...register("image", { required: true })}
                                />
                            </div>

                            {/* District & Upazila */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                <div className="grid gap-2">
                                    <Label htmlFor="district">District</Label>
                                    <Controller
                                        name="district"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id="district"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="upazila">Upazila</Label>
                                    <Controller
                                        name="upazila"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id="upazila"
                                                disabled={!selectedDistrict}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                </div>
                            </div>

                            {/* Password & Confirm Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        required
                                        {...register("password", { required: true, minLength: 8 })}
                                    />
                                    {errors.password && <p className="text-xs text-red-500">Min 8 characters required</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        required
                                        {...register("confirmPassword", { required: true })}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="relative overflow-hidden p-[1px] rounded-lg mt-2">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                                />
                                <Button
                                    type="submit"
                                    className="relative w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base rounded-md transition-all flex items-center justify-center gap-2"
                                >
                                    Create Account
                                </Button>
                            </div>

                            <div className="mt-2 text-center text-xs font-medium text-slate-500 dark:text-gray-300">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-rose-600 hover:underline">
                                    Log In
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side Image Banner */}
            <div className="sticky top-0 hidden h-screen w-1/2 md:block">
                {/* <Image
                    src="https://i.ibb.co.com/F4MDJq4w/Chat-GPT-Image-Jun-29-2026-at-05-04-51-AM.png"
                    alt="Registration Banner"
                    fill
                    priority
                    className="object-cover"
                /> */}
            </div>

        </div>
    );
}