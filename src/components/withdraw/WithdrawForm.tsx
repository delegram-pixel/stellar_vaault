"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateWithdraw, getBalance, checkUserCertificate } from "@/lib/queries";
import { v4 } from "uuid";
import { Spinner } from "../spinner";
import { useState, useEffect } from "react";
import CertificateUpload from "../kyc/CertificateUpload";
import { useUser } from "@clerk/nextjs"; // Added import for getting user ID

const FormSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const numVal = parseFloat(val);
      return !isNaN(numVal) && numVal >= 10;
    }, 
    { message: "Minimum withdrawal is $10" }
  ),
  walletAddress: z.string().min(1, { message: "Wallet address is required" }),
});

const WithdrawForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser(); // Get current user
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateStatus, setCertificateStatus] = useState<'NOT_EXISTS' | 'PENDING' | 'VERIFIED'>('NOT_EXISTS');
  const [isLoading, setIsLoading] = useState(true);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const withdrawForm = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: "",
      walletAddress: "",
    },
  });

  // Check certificate status and balance on component mount
  useEffect(() => {
    const checkCertificateAndBalance = async () => {
      try {
        // Check certificate status
        const certificateData = await checkUserCertificate();
        
        if (!certificateData) {
          setCertificateStatus('NOT_EXISTS');
        } else if (certificateData.status === 'PENDING') {
          setCertificateStatus('PENDING');
        } else if (certificateData.status === 'VERIFIED') {
          setCertificateStatus('VERIFIED');
        }

        // Fetch user balance
        const balanceData = await getBalance();
        setUserBalance(balanceData?.balance ?? null);

        setIsLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify certificate status or balance"
        });
         
        setIsLoading(false);
      }
    };

    checkCertificateAndBalance();
  }, []);

  const onWithdrawSubmit = async (values: z.infer<typeof FormSchema>) => {
    // Check certificate status first
    if (certificateStatus !== 'VERIFIED') {
      setIsCertificateModalOpen(true);
      return;
    }

    // Validate balance
    const withdrawAmount = parseFloat(values.amount);
    if (userBalance === null || withdrawAmount > userBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Check your available balance",
      });
      return;
    }

    try {
      await CreateWithdraw({
        id: v4(),
        amount: values.amount,
        walletAddress: values.walletAddress,
        status: "PENDING",
        createdAt: new Date(),
        userId: user?.id || "", // Use Clerk user ID
      });

      toast({
        title: "Withdrawal Pending",
        description: `$${values.amount} withdrawal is processing`,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "Could not process withdrawal",
      });
    }
  };

  // If still loading, show a spinner
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Form {...withdrawForm}>
        <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Available Balance: ${userBalance?.toFixed(2) ?? '0.00'}
            </span>
          </div>

          <FormField
            disabled={withdrawForm.formState.isSubmitting}
            control={withdrawForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount in USD ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="Minimum $10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={withdrawForm.formState.isSubmitting}
            control={withdrawForm.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>USDT Wallet Address</FormLabel>
                <FormControl>
                  <Input 
                    required 
                    placeholder="Enter USDT wallet address" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            disabled={withdrawForm.formState.isSubmitting }
            type="submit"
          >
            {withdrawForm.formState.isSubmitting ? (
              <Spinner/>
            ) : (
              "Withdraw"
            )}
          </Button>
        </form>
      </Form>

      <Dialog 
        open={isCertificateModalOpen} 
        onOpenChange={setIsCertificateModalOpen}
      >
        <DialogContent className="max-w-md">
          <CertificateUpload 
            onVerificationComplete={() => {
              setIsCertificateModalOpen(false);
              setCertificateStatus('PENDING');
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawForm;