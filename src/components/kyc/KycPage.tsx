"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { UploadDropzone } from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { KycVerification } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useUpload } from "@/hooks/use-upload";

interface Country {
  name: { common: string };
  cca2: string;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  nationality: z.string().min(1, "Nationality is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  idFront: z.string().url("ID Front image is required"),
  idBack: z.string().url("ID Back image is required"),
  selfie: z.string().url("Selfie image is required"),
});

type FormData = z.infer<typeof formSchema>;

const KYCVerification = () => {
  const {
    isUploading,
    uploadProgress,
    handleUploadBegin,
    handleUploadComplete,
    handleUploadError,
  } = useUpload();

  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      nationality: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      idFront: "",
      idBack: "",
      selfie: "",
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>("https://restcountries.com/v3.1/all?fields=name,cca2");
        setCountries(response.data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const {toast} = useToast()

  const onSubmit = async (data: FormData) => {
    console.log(data);
   
    try {
        await KycVerification({
            fullName: data.fullName,
            dateOfBirth: data.dob,
            nationality: data.nationality,
            streetAddress: data.streetAddress,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            idFrontUrl: data.idFront,
            idBackUrl: data.idBack,
            selfieUrl: data.selfie,
       
        });
  
        toast({
        
          title: 'Success',
          description: "User Kyc Submitted",
        });
    
        router.push("/dashboard")

  
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error("Failed to update user:", error);
  
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Could not Submit Kyc",
        });
  
      } finally {
        setIsLoading(false);
 

  };
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const PersonalInfo = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Please provide your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.cca2} value={country.cca2}>
                      {country.name.common}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={nextStep} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );

  const AddressVerification = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Address Verification</CardTitle>
        <CardDescription>Please provide your address details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter your city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your postal code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.cca2} value={country.cca2}>
                      {country.name.common}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStep} variant="outline">Previous</Button>
        <Button onClick={nextStep}>Next</Button>
      </CardFooter>
    </Card>
  );

  const DocumentUpload = () => (
    <Card className="w-full max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>Document Upload</CardTitle>
      <CardDescription>Please upload your identification documents</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="idFront"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Front</FormLabel>
              <FormControl>
                <UploadDropzone
                  endpoint="multipleImages"
                  onUploadBegin={handleUploadBegin}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      field.onChange(res[0].url);
                      handleUploadComplete(res);
                    }
                  }}
                  onUploadError={handleUploadError}
                />
              </FormControl>
              {field.value && (
                <div className="mt-2 text-sm text-green-600">✓ ID Front uploaded successfully</div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idBack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Back</FormLabel>
              <FormControl>
                <UploadDropzone
                  endpoint="multipleImages"
                  onUploadBegin={handleUploadBegin}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      field.onChange(res[0].url);
                      handleUploadComplete(res);
                    }
                  }}
                  onUploadError={handleUploadError}
                />
              </FormControl>
              {field.value && (
                <div className="mt-2 text-sm text-green-600">✓ ID Back uploaded successfully</div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selfie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selfie</FormLabel>
              <FormControl>
                <UploadDropzone
                  endpoint="multipleImages"
                  onUploadBegin={handleUploadBegin}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      field.onChange(res[0].url);
                      handleUploadComplete(res);
                    }
                  }}
                  onUploadError={handleUploadError}
                />
              </FormControl>
              {field.value && (
                <div className="mt-2 text-sm text-green-600">✓ Selfie uploaded successfully</div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between mt-4">
      <Button onClick={prevStep} variant="outline">Previous</Button>
      <Button 
        onClick={form.handleSubmit(onSubmit)}
        disabled={!form.getValues('idFront') || !form.getValues('idBack') || !form.getValues('selfie')}
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading... {uploadProgress}%
          </div>
        ) : 'Submit'}
      </Button>
    </CardFooter>
  </Card>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="container mx-auto px-4 py-4 max-h-[80vh] ">
          <h1 className="text-3xl font-bold mb-8 text-center">KYC Verification</h1>
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`w-10 h-10 rounded-full ${
                      step >= stepNumber ? "bg-primary" : "bg-secondary"
                    } flex items-center justify-center text-primary-foreground font-bold`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-20 h-1 ${
                        step > stepNumber ? "bg-primary" : "bg-secondary"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          {step === 1 && <PersonalInfo />}
          {step === 2 && <AddressVerification />}
          {step === 3 && <DocumentUpload />}
        </div>
      </form>
    </Form>
  );
};

export default KYCVerification;