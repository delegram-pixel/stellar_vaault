
"use client";
import React, { useState, useEffect } from "react";
import { Separator } from "../ui/separator";
import { getActivePlans, createInvestment } from "@/lib/queries";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { currentUser } from "@clerk/nextjs/server";
import { onLoginUser } from "@/actions/auth";

interface Plan {
  id: string;
  name: string;
  shortName: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  duration: any;
  interestRate: number;
  interestPeriod: string;
  payoutTerm: string;
  termDuration: any;
  termDurationType: string;
  capitalReturn: string;
  profitAdjust: string;
  maxInvestmentTimes: any;
  maxPerUser: any;
  isFixedInvestment: boolean;
  returnCapital: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const investmentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
});

const Details = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      const activePlans = await getActivePlans();
      setPlans(activePlans);
    };
    fetchPlans();
  }, []);

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    if (!selectedPlan) return;

    const user = await onLoginUser();
    if (!user) {
      throw new Error('Current user not found.');
    }

    const userId = user.user?.clerkId

    console.log(userId)
    try {
      await createInvestment( userId, selectedPlan.id, values.amount);
      toast({
        title: "Investment created",
        description: "Your investment was created successfully!",
      });
      form.reset();
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occured try again!!!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=" mx-auto px-4 py-8">
   
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{plan.interestRate}%</p>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{plan.termDuration}</p>
                  <p className="text-sm text-muted-foreground">Term {plan.termDurationType}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Minimum Deposit</span>
                  <span className="font-semibold">${plan.minAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Deposit</span>
                  <span className="font-semibold">${plan.maxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Type</span>
                  <span className="font-semibold">{plan.isFixedInvestment ? "Fixed" : "Flexible"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Return</span>
                  <span className="font-semibold">{plan.returnCapital ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedPlan(plan)}>Invest Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invest in {plan.name}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter investment amount"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter an amount between ${plan.minAmount} and ${plan.maxAmount}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Confirm Investment</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Details;