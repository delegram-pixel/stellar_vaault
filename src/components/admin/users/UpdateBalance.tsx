"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Add this import
import { client } from "@/lib/prisma";
import { onLoginUser } from "@/actions/auth";
import { UpdateBal } from "@/lib/queries";
// import { prisma } from "@/lib/prisma"; // Import Prisma client

const balanceUpdateSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
});

const UpdateBalance = ({userId}:any) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof balanceUpdateSchema>>({
    resolver: zodResolver(balanceUpdateSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof balanceUpdateSchema>) => {
    try {
       

      // Update user's balance using Prisma

      const data = await values.amount
      console.log(data)

      await UpdateBal( userId, data);
   

   

      toast({
        title: "Balance updated",
        description: `Your balance was updated successfully! New balance: ${data}`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Update Balance</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Add</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount to add"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Confirm Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBalance;