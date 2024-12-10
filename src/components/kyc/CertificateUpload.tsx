import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "../ui/card";
import { Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { UploadDropzone } from "./FileUpload";
import { useToast } from "../../hooks/use-toast";
import { useUpload } from "../../hooks/use-upload";
import { uploadCertificate, checkUserCertificate } from "@/lib/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Zod schema for certificate upload
const certificateSchema = z.object({
  certificateFile: z.string().url("Certificate file is required")
});

type CertificateFormData = z.infer<typeof certificateSchema>;

// Define the possible certificate statuses
type CertificateStatus = 'NOT_EXISTS' | 'PENDING' | 'VERIFIED' | 'REJECTED';

interface CertificateUploadProps {
  onVerificationComplete?: () => void; // Optional callback prop
}

const CertificateUpload: React.FC<CertificateUploadProps> = ({ onVerificationComplete }) => {
  const { 
    isUploading, 
    uploadProgress, 
    handleUploadBegin, 
    handleUploadComplete, 
    handleUploadError 
  } = useUpload();

  const { toast } = useToast();
  const [certificateStatus, setCertificateStatus] = useState<CertificateStatus>('NOT_EXISTS');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCertificateStatus = async () => {
      try {
        const certificateData = await checkUserCertificate();
        
        // Determine status based on the returned data
        if (!certificateData) {
          setCertificateStatus('NOT_EXISTS');
        } else if (certificateData.status === 'PENDING') {
          setCertificateStatus('PENDING');
        } else if (certificateData.status === 'VERIFIED') {
          setCertificateStatus('VERIFIED');
        } else if (certificateData.status === 'REJECTED') {
          setCertificateStatus('REJECTED');
        } else {
          setCertificateStatus('NOT_EXISTS');
        }
      } catch (error) {
        console.error("Failed to check certificate status:", error);
        setCertificateStatus('NOT_EXISTS');
      } finally {
        setIsLoading(false);
      }
    };

    checkCertificateStatus();
  }, []);

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      certificateFile: ""
    }
  });

  const onSubmit = async (data: CertificateFormData) => {
    try {
      await uploadCertificate({
        imageUrl: data.certificateFile
      });

      setCertificateStatus('PENDING');

      // Call the optional verification callback
      onVerificationComplete?.();

      toast({
        title: 'Success',
        description: "Certificate uploaded successfully. Awaiting verification.",
        icon: <CheckCircle2 className="text-green-500" />
      });
    } catch (error) {
      console.error("Failed to upload certificate:", error);

      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not upload certificate",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          <Upload className="inline-block mr-2 text-primary" />
          Certificate Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {certificateStatus === 'VERIFIED' 
            ? 'Your certificate is verified' 
            : 'Upload a verified certificate to enable withdrawals'}
        </CardDescription>
      </CardHeader>
      
      {(certificateStatus === 'NOT_EXISTS' || certificateStatus === 'REJECTED') && (
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="certificateFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Certificate File</FormLabel>
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
                      <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Certificate uploaded successfully
                      </div>
                    )}
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              
              {isUploading && (
                <Progress value={uploadProgress} className="w-full" />
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={!form.getValues('certificateFile')}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading... {uploadProgress}%
                  </div>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Certificate
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      )}

      <CardFooter className="flex flex-col justify-center space-y-4">
        {certificateStatus === 'PENDING' && (
          <Alert variant="warning" className="w-full">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <AlertDescription className="ml-2">
              Your certificate is under review. Verification in progress.
            </AlertDescription>
          </Alert>
        )}

        {certificateStatus === 'REJECTED' && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertDescription className="ml-2">
              Your certificate has been rejected. Please upload a valid certificate.
            </AlertDescription>
          </Alert>
        )}

        {certificateStatus === 'VERIFIED' && (
          <Alert variant="success" className="w-full mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertDescription className="ml-2">
              Certificate verified. You can now make withdrawals.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificateUpload;