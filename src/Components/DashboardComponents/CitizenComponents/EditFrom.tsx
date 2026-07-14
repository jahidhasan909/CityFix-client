"use client";

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { Loader2, Check } from 'lucide-react';

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

// Zod Validation Schema matching your report details
const formSchema = z.object({
  title: z.string().min(1, "Report title is required"),
  category: z.string().min(1, "Category is required"),
  district: z.string().min(1, "District is required"),
  upazila: z.string().min(1, "Upazila is required"),
  description: z.string().min(1, "Description is required"),
});

type ReportFormData = z.infer<typeof formSchema>;

interface District {
  id: string;
  name: string;
}

interface Upazila {
  id: string;
  district_id: string;
  name: string;
}

interface EditReportFormProps {
  id: string;
}


interface CustomUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: string;
}

const EditReportForm: React.FC<EditReportFormProps> = ({ id }) => {
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL ;
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset: resetForm
  } = useForm<ReportFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      district: "",
      upazila: "",
      description: "",
    },
  });

  const selectedDistrict = watch("district");

  // Load districts and upazilas
  useEffect(() => {
    const loadLocationData = async () => {
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

    loadLocationData();
  }, []);

  
  useEffect(() => {
    const fetchInitialReportData = async () => {
      if (districts.length === 0 || upazilas.length === 0) return;

      try {
        const res = await fetch(`${baseurl}/api/reports/${id}`);
        if (res.ok) {
          const reportData = await res.json();
          
          let initialDistrictId = "";
          let initialUpazilaId = "";

          if (reportData.location) {
            const parts = reportData.location.split(",").map((p: string) => p.trim());
            const upazilaName = parts[0];
            const districtName = parts[1];

            const matchedDistrict = districts.find(d => d.name.toLowerCase() === districtName?.toLowerCase());
            const matchedUpazila = upazilas.find(u => u.name.toLowerCase() === upazilaName?.toLowerCase());

            if (matchedDistrict) initialDistrictId = matchedDistrict.id;
            if (matchedUpazila) initialUpazilaId = matchedUpazila.id;
          }

          if (reportData.image) {
            setExistingImages(reportData.image);
          }

          resetForm({
            title: reportData.title || "",
            category: reportData.category || "",
            district: initialDistrictId,
            upazila: initialUpazilaId,
            description: reportData.description || "",
          });
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load report details.");
        setLoading(false);
      }
    };

    if (id && districts.length > 0 && upazilas.length > 0) {
      fetchInitialReportData();
    }
  }, [id, baseurl, districts, upazilas, resetForm]);

  const filteredUpazilas = upazilas.filter(
    (u) => u.district_id === selectedDistrict
  );

  
  const { data: userData, isPending } = authClient.useSession();
  
 
  const user = userData?.user as CustomUser | undefined;

  const onFormSubmit = async (data: ReportFormData) => {
    setSubmitting(true);

    const districtName = districts.find((d) => d.id === data.district)?.name || "";
    const upazilaName = upazilas.find((u) => u.id === data.upazila)?.name || "";
    const locationString = `${upazilaName}, ${districtName}`;

    const updatePayload = {
      title: data.title,
      description: data.description,
      category: data.category,
      location: locationString,
      image: existingImages, 
    };

    try {
      const res = await fetch(`${baseurl}/api/report/edit/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        toast.success('Report updated successfully!');
        router.push(`/dashboard/${user?.role || 'citizen'}/reports`);
        router.refresh();
      } else {
        toast.error('Failed to update report.');
      }
    } catch (error) {
      toast.error('Error updating report request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm font-medium">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-rose-500" /> Loading report details...
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 sm:p-6" onSubmit={handleSubmit(onFormSubmit)}>
      
      {/* Citizen Meta Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80">Citizen Name</Label>
          <Input value={user?.name || ""} disabled className="cursor-not-allowed bg-muted" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80">Citizen Email</Label>
          <Input value={user?.email || ""} disabled className="cursor-not-allowed bg-muted" />
        </div>
      </div>

      {/* Title and Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className="text-xs font-semibold text-foreground/80">Report Title</Label>
          <Input 
            id="title" 
            placeholder="Enter report title" 
            className={errors.title ? "border-destructive focus-visible:ring-destructive" : "bg-background"}
            {...register("title")} 
          />
          {errors.title && <span className="text-xs text-destructive mt-1">{errors.title.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category" className="text-xs font-semibold text-foreground/80">Category</Label>
          <Controller
            name="category"
            control={control}
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

      {/* Location (District & Upazila) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="district" className="text-xs font-semibold text-foreground/80">District</Label>
          <Controller
            name="district"
            control={control}
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

      {/* Description Area */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description" className="text-xs font-semibold text-foreground/80">
          Description (Detailed Incident Analysis)
        </Label>
        <Textarea
          {...register("description")}
          id="description"
          rows={5}
          placeholder="Provide full structural parameters and facts regarding this situation..."
          className={`w-full p-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none ${
            errors.description ? "border-destructive" : "border-input"
          }`}
        />
        {errors.description && <span className="text-xs text-destructive mt-1">{errors.description.message}</span>}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border mt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-rose-600 text-white font-semibold shadow-lg h-12 px-8 rounded-lg hover:bg-rose-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="mr-2 h-4 w-4" />}
          Update Incident Report
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 px-8 w-full sm:w-auto dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => router.push(`/dashboard/${user?.role || 'citizen'}/reports`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditReportForm;