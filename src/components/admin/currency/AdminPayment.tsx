"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getAllCurrency, PaymentDc, updatePaymentMethod } from "@/lib/queries";



interface Currency {
  id: string;
  name: string;
  symbol: string;
}

const AdminPaymentMethodForm = ({ editingPaymentMethod, onSubmitSuccess }:any) => {
    const [allCurrency, setAllCurrency] = useState<Currency[]>([]);
    const { toast } = useToast();
  
    useEffect(() => {
      const fetchCurrency = async () => {
        const currencies = await getAllCurrency();
        setAllCurrency(currencies);
      };
      fetchCurrency();
    }, []);
  
    const form = useForm({
      defaultValues: editingPaymentMethod || {
        name: "",
        walletAddress: "",
        currencyId: "",
        isEnabled: true,
      },
    });
  
    useEffect(() => {
      if (editingPaymentMethod) {
        form.reset(editingPaymentMethod);
      }
    }, [editingPaymentMethod, form]);
  
    const onSubmit = async (data:any) => {
      try {
        if (editingPaymentMethod) {
          await updatePaymentMethod(editingPaymentMethod.id, data);
          toast({
            title: "Success",
            description: "Payment method updated successfully",
          });
        } else {
          await PaymentDc(data);
          toast({
            title: "Success",
            description: "Payment method created successfully",
          });
        }
        form.reset();
        if (onSubmitSuccess) onSubmitSuccess();
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to save payment method",
          variant: "destructive",
        });
      }
    };
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter payment method name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter wallet address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allCurrency.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.name} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enabled</FormLabel>
                  <FormDescription>
                    Enable or disable this payment method
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-orange">
            {form.formState.isSubmitting
              ? "Saving..."
              : editingPaymentMethod
              ? "Update Payment Method"
              : "Create Payment Method"}
          </Button>
        </form>
      </Form>
    );
  };

export default AdminPaymentMethodForm;
