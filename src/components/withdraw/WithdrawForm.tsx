"use client";

import { Button } from "@/components/ui/button";

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

import { CreateWithdraw, getBalance } from "@/lib/queries";
import { v4 } from "uuid";
import { Spinner } from "../spinner";

const FormSchema = z.object({
  amount: z.string().min(2, { message: "Amount must be atleast 2 chars." }),
  walletAddress: z.string().min(1),
});

const WithdrawForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: "",

      walletAddress: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  //   useEffect(() => {
  //     if (data) {
  //       form.reset(data);
  //     }
  //   }, [data]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    const getbal = await getBalance();
    const check = getbal?.balance;
    
    if (check !== undefined && check !== null) {
      if (check < parseFloat(values.amount)) {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Check your balance",
        });
      } else {
        try {
          await CreateWithdraw({
            id: v4(),
            amount: values.amount,
            walletAddress: values.walletAddress,
            status: "PENDING",
            createdAt: new Date(),
            userId: "",
          });
    
          toast({
            title: "Withdrawal Pending",
          });
    
          router.push("/dashboard");
        } catch (error) {
          console.log(error);
          toast({
            variant: "destructive",
            title: "Oppse!",
            description: "could not make a deposit",
          });
        }
      }
    } else {
      // Handle the case where balance is undefined or null
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to retrieve balance",
      });
    }
    
   
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Amount in USD ($) </FormLabel>
              <FormControl>
                <Input required placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={form.formState.isSubmitting}
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>USDT Wallet Address </FormLabel>
              <FormControl>
                <Input required placeholder="Wallet Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="bg-orange"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Spinner/>
          ) : (
            "Save User Details"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawForm;
