'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateUser } from "@/lib/queries"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "../spinner"

const formSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  address: z.string().min(1, "Address is required"),
})

interface AddressFormProps {
  profile: {
    fullName: string
    country: string
    state: string
    city: string
    zipCode: string
    address: string
  }
}

export function AddressForm({ profile }: AddressFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: profile.country,
      state: profile.state,
      city: profile.city,
      zipCode: profile.zipCode,
      address: profile.address,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await updateUser({
        country: values.country,
        state: values.state,
        city: values.city,
        zipCode: values.zipCode,
        address: values.address,
      })

      toast({
        title: `${profile.fullName} Updated`,
        description: "User Details Updated",
      })
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not Update User",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border md:w-full w-full">
      <p className="text-sm md:text-2xl">Address Information</p>
      <Separator className="mt-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-4 md:flex-row md:justify-between flex-col">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={profile.country} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={profile.state} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 md:flex-row md:justify-between flex-col">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={profile.city} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={profile.zipCode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={profile.address} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-muted-foreground  font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  )
}