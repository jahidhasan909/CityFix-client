"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Edit2, Save, X, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { UploadImagebb } from "@/lib/action/UploadImgbb";


interface LocationItem {
    id: string | number;
    name: string;
    district_id?: string | number;
}


interface UserDataProps {
    _id: string;
    userId: string;
    name: string;
    email: string;
    image: string;
    district: string;
    upazila: string;
    role: string;
    status: string;
    bloodGroup?: string;
}

interface ProfileComponentProps {
    userData: UserDataProps;
}


interface ProfileFormInputs {
    name: string;
    image: FileList | string;
    district: string;
    upazila: string;
    bloodGroup: string;
    gender: string;
}

export default function Profile({ userData }: ProfileComponentProps) {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [upazilas, setUpazilas] = useState<LocationItem[]>([]);

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const genders = ["Male", "Female", "Other"];

    const { 
        register, 
        handleSubmit, 
        reset: updateForm, 
        control, 
        watch, 
        setValue, 
        formState: { errors } 
    } = useForm<ProfileFormInputs>();

    const selectedDistrictId = watch("district");

    useEffect(() => {
        const initializeProfileData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    fetch("/districts.json"),
                    fetch("/upazilas.json")
                ]);

                const districtData = await districtRes.json();
                const upazilaData = await upazilaRes.json();

                const fetchedDistricts: LocationItem[] = districtData?.[2]?.data || [];
                const fetchedUpazilas: LocationItem[] = upazilaData?.[2]?.data || [];

                setDistricts(fetchedDistricts);
                setUpazilas(fetchedUpazilas);

                if (userData) {
                    
                    const currentDistrictObj = fetchedDistricts.find(d => d.name === userData.district);
                    const currentUpazilaObj = fetchedUpazilas.find(u => u.name === userData.upazila);

                    updateForm({
                        name: userData.name || "",
                        bloodGroup: userData.bloodGroup || "",
                        image: userData.image || "",
                        district: currentDistrictObj ? String(currentDistrictObj.id) : "",
                        upazila: currentUpazilaObj ? String(currentUpazilaObj.id) : "",
                    });
                }

                setLoading(false);
            } catch (error) {
                toast.error("Failed to load profile locations.");
                setLoading(false);
            }
        };

        if (userData) {
            initializeProfileData();
        }
    }, [userData, updateForm]);

    const filteredUpazilas = upazilas.filter(
        (upazila) => String(upazila.district_id) === String(selectedDistrictId)
    );

    const onFormSubmit = async (data: ProfileFormInputs) => {
        setSubmitting(true);

        const selectedDistrictObj = districts.find(d => String(d.id) === String(data.district));
        const selectedUpazilaObj = upazilas.find(u => String(u.id) === String(data.upazila));
        
        let imageUrl = userData?.image || ""; 

        if (data.image && typeof data.image !== 'string' && data.image.length > 0) {
            try {
                const imageFile = data.image[0];
                const image = await UploadImagebb(imageFile);
                imageUrl = image.url;
            } catch (err) {
                toast.error("Failed to upload new image.");
                setSubmitting(false);
                return;
            }
        }

        // const tokenResponse = await authClient.token();
        // const tokenData = tokenResponse?.data;

        const finalPayload = {
            name: data.name,
            bloodGroup: data.bloodGroup,
            image: imageUrl,
            district: selectedDistrictObj ? selectedDistrictObj.name : userData.district,
            upazila: selectedUpazilaObj ? selectedUpazilaObj.name : userData.upazila,
        };

        try {
            const res = await fetch(`${baseurl}/api/own/edit/users?email=${userData?.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // authorization: `Bearer ${tokenData?.token}`,
                },
                body: JSON.stringify(finalPayload),
            });

            if (res.ok) {
                toast.success('Profile updated successfully!');
                setIsEditable(false);
                router.refresh();
            } else {
                toast.error("Failed to update profile request.");
            }
        } catch (error) {
            toast.error("Error updating profile database");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>loading</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs mt-7 relative overflow-hidden">
            {userData?.bloodGroup && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1.5 rounded-bl-2xl font-black text-sm tracking-wide shadow-xs">
                    Blood Group : {userData?.bloodGroup}
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-2 ring-red-100 dark:ring-slate-800">
                        <AvatarImage alt="userimage" src={userData?.image} />
                        <AvatarFallback className="font-bold text-lg">
                            {userData?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{userData?.name}</h1>
                            <div className="flex gap-2">
                                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-red-50 dark:bg-slate-800 text-red-600 dark:text-slate-200 rounded-md">
                                    {userData?.role}
                                </span>
                                {userData?.status === "active" ? (
                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-md">
                                        <CheckCircle className="w-3 h-3" /> {userData?.status}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-md">
                                        <ShieldAlert className="w-3 h-3" /> {userData?.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {!isEditable ? (
                        <Button
                            type="button"
                            onClick={() => setIsEditable(true)}
                            className="bg-red-600 text-white hover:bg-red-700 font-semibold flex items-center gap-2 rounded-xl px-4 h-10 text-sm"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => {
                                setIsEditable(false);
                                router.refresh();
                            }}
                            variant="outline"
                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-2 rounded-xl px-4 h-10 text-sm"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input
                        disabled={!isEditable}
                        {...register("name", { required: "Name is required" })}
                        placeholder="Enter your full name"
                        className="rounded-xl border dark:bg-slate-950"
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address (Locked)</Label>
                    <Input
                        type="email"
                        disabled={true}
                        value={userData?.email || ""}
                        className="w-full h-10 bg-slate-50 dark:bg-slate-950 text-slate-500 rounded-xl border"
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Image (Optional)</Label>
                    <Input
                        disabled={!isEditable}
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="rounded-xl border dark:bg-slate-950 cursor-pointer p-2 file:text-xs"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">District</Label>
                        <select
                            disabled={!isEditable}
                            {...register("district", {
                                required: "District is required",
                                onChange: () => {
                                    setValue("upazila", "");
                                }
                            })}
                            className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-sm bg-white dark:bg-slate-950 focus-visible:outline-hidden"
                        >
                            <option value="">Select district</option>
                            {districts.map((district) => (
                                <option key={district.id} value={String(district.id)}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && <span className="text-xs text-red-500">{errors.district.message}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upazila</Label>
                        <select
                            disabled={!isEditable || !selectedDistrictId}
                            {...register("upazila", { required: "Upazila is required" })}
                            className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-sm bg-white dark:bg-slate-950 focus-visible:outline-hidden"
                        >
                            <option value="">Select upazila</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={String(upazila.id)}>
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                        {errors.upazila && <span className="text-xs text-red-500">{errors.upazila.message}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Blood Group</Label>
                        <select
                            disabled={!isEditable}
                            {...register("bloodGroup", { required: "Blood group is required" })}
                            className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-sm bg-white dark:bg-slate-950 focus-visible:outline-hidden"
                        >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                        {errors.bloodGroup && <span className="text-xs text-red-500">{errors.bloodGroup.message}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    disabled={!isEditable}
                                    className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-sm bg-white dark:bg-slate-950 focus-visible:outline-hidden"
                                >
                                    <option value="">Select gender</option>
                                    {genders.map((gender) => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                </div>

                {isEditable && (
                    <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 h-10 text-sm flex items-center gap-2"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}