"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';


import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent } from "@/Components/ui/card";

export default function DonorLogin() {
    const router = useRouter();

    interface RegistrationFormData {
    email: string;
    password: string;
    
}

  const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        defaultValues: {
            email: "",
            password: "",
            
        }
    });


    const onSubmit = async (data: RegistrationFormData) => {
        const userData = {
            email: data.email,
            password: data.password,
        };

        const { data: resdata, error } = await authClient.signIn.email({
            ...userData,
        });

        if (resdata) {
            toast.success('Welcome back, Mr/MST! Great to see you again.');
            router.push('/');
        }

        if (error) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background font-sans text-foreground">

           
           
            <div className="relative flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24">

                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-5 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('https://i.ibb.co.com/JjtCjy4m/Screenshot-2026-06-19-at-11-15-06-PM.png')"
                    }}
                />

                <div className="mx-auto w-full max-w-sm text-left z-50 mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome Back!
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to access your donor dashboard and continue your life-saving journey.
                    </p>
                </div>

                <Card className="mx-auto z-40 w-full max-w-sm border-none bg-transparent shadow-none">
                    <CardContent className="p-0">
                        <form
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {/* Email Field */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    className={`w-full bg-background ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-xs font-medium text-destructive mt-0.5">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`w-full bg-background ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                                        validate: {
                                            hasUppercase: (v) => /[A-Z]/.test(v) || "Password must contain at least one uppercase letter",
                                            hasNumber: (v) => /[0-9]/.test(v) || "Password must contain at least one number"
                                        }
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-xs font-medium text-destructive mt-0.5">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Animated  */}
                            <div className="group relative block p-0.5 rounded-lg overflow-hidden mt-2">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E11D48_50%,#E2E8F0_100%)]"
                                />
                                <Button
                                    type="submit"
                                    className="relative bg-[#db0000] hover:bg-[#db00008b] text-white font-semibold text-base h-12 rounded-lg transition-all flex items-center justify-center gap-2 w-full border-none"
                                >
                                    Log In
                                </Button>
                            </div>

                            <div className="mt-2 text-center text-xs font-medium text-muted-foreground">
                                {"Don't have an account?"}{" "}
                                <Link href="/registration" className="font-semibold text-[#db0000] hover:underline">
                                    Registration
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Image Banner */}
            <div className="relative hidden w-1/2 md:block">
                <Image
                    src="https://i.ibb.co.com/gM725yXw/Chat-GPT-Image-Jun-29-2026-at-05-01-48-AM.png"
                    alt="Donor Journey Banner"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

        </div>
    );
}