"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleUploadBegin = () => {
    setIsUploading(true);
    setUploadProgress(0);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    setUploadProgress(100);
    toast({
      title: "Success!",
      description: "Files uploaded successfully",
    });
    return res;
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    setUploadProgress(0);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return {
    isUploading,
    uploadProgress,
    handleUploadBegin,
    handleUploadProgress,
    handleUploadComplete,
    handleUploadError,
  };
}