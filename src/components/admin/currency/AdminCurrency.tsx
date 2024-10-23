"use client"
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PrismaClient } from '@prisma/client';
import { CurrencydC, getAllCurrency } from '@/lib/queries';



const CurrencyForm = () => {
    const { toast } = useToast();
    const form = useForm({
      defaultValues: {
        name: "",
        symbol: "",
      },
    });
  
    const onSubmit = async (data:any) => {
      try {
        await CurrencydC(data);
        toast({
          title: "Success",
          description: "Currency created successfully",
        });
        form.reset();
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to create currency",
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
                <FormLabel>Currency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter currency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="Enter currency symbol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className='bg-orange'>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Currency'}
          </Button>
        </form>
      </Form>
    );
  };

export default CurrencyForm;