"use client";

import { useCallback } from "react";
import { UploadDropzone as UTUploadDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useToast } from "@/hooks/use-toast";
import { OurFileRouter } from "@/lib/uploadthing";

interface UploadDropzoneProps {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (res: any) => void;
  onUploadError?: (error: Error) => void;
  onUploadBegin?: () => void;
}

export function UploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  onUploadBegin,
}: UploadDropzoneProps) {
  const { toast } = useToast();

  const handleClientUploadComplete = useCallback(
    (res: any) => {
      toast({
        title: "Upload completed",
        description: "Your files have been uploaded successfully.",
        variant: "success",
      });
      onClientUploadComplete?.(res);
    },
    [onClientUploadComplete, toast]
  );

  const handleUploadError = useCallback(
    (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      onUploadError?.(error);
    },
    [onUploadError, toast]
  );

  return (
    <UTUploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleClientUploadComplete}
      onUploadError={handleUploadError}
      onUploadBegin={onUploadBegin}
      className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
    />
  );
}
