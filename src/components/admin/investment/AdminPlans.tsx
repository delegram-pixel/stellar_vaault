"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createPlan,
  Deleteplan,
  getAllPlans,
  makePlanActive,
  makePlanNotActive,
  updatePlan,
} from "@/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";

const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().optional(),
  description: z.string().optional(),
  minAmount: z.number().min(0),
  maxAmount: z.number().min(0),
  interestRate: z.number().min(0),
  interestPeriod: z.string(),
  payoutTerm: z.string(),
  termDuration: z.number().min(1),
  termDurationType: z.string(),
  isFixedInvestment: z.boolean(),
  returnCapital: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

const AdminPlans = () => {
  const [plans, setPlans] = useState<PlanFormValues[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanFormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      isFixedInvestment: false,
      returnCapital: true,
      isFeatured: false,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      const fetchedPlans = await getAllPlans();
      setPlans(fetchedPlans);
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (editingPlan) {
      form.reset(editingPlan);
    } else {
      form.reset({
        isFixedInvestment: false,
        returnCapital: true,
        isFeatured: false,
        isActive: true,
      });
    }
  }, [editingPlan, form]);

  const makeActive = async (id: string) => {
    try {
      await makePlanActive(id);
      const updatedPlans = await getAllPlans();
      setPlans(updatedPlans);
      toast({
        title: "Success",
        description: "Plan activated successfully",
      });
    } catch (error) {
      console.error("Error activating plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate plan",
      });
    }
  };

  const makeInactive = async (id: string) => {
    try {
      await makePlanNotActive(id);
      const updatedPlans = await getAllPlans();
      setPlans(updatedPlans);
      toast({
        title: "Success",
        description: "Plan deactivated successfully",
      });
    } catch (error) {
      console.error("Error deactivating plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate plan",
      });
    }
  };

  const deleteSchema = async (id: string) => {
    try {
      await Deleteplan(id);
      const updatedPlans = await getAllPlans();
      setPlans(updatedPlans);
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete plan",
      });
    }
  };

  const onSubmit = async (data: PlanFormValues) => {
    try {
      if (editingPlan) {
        const id = editingPlan.id

        const plan = editingPlan
        
        console.log(id);

        await updatePlan(editingPlan.id!, data);
        toast({ title: "Success", description: "Plan updated successfully" });
      } else {
        await createPlan(data);
        toast({ title: "Success", description: "Plan created successfully" });
      }
      setIsDialogOpen(false);
      setEditingPlan(null);
      const updatedPlans = await getAllPlans();
      setPlans(updatedPlans);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-5 mx-auto">
      <div className="flex justify-between mb-4">
        <Button variant="outline">Invested Plans</Button>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingPlan(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>+ Add Scheme</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? `Edit ${editingPlan.name}` : "New Scheme / Plan"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />


<FormField
                  control={form.control}
                  name="interestPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Period</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                    </div>
             
               
                <FormField
                  control={form.control}
                  name="payoutTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Term</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="termDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term Duration</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termDurationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFixedInvestment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Fixed Investment
                          </FormLabel>
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

                  <FormField
                    control={form.control}
                    name="returnCapital"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Return Capital
                          </FormLabel>
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
                </div>

                <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Featured Plan
                        </FormLabel>
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
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
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

                </div>

               
                <Button type="submit">
                  {editingPlan ? "Update" : "Create"} Plan
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <span
                className={`text-xs font-semibold ${
                  plan.isActive
                    ? "text-green-500 bg-green-100"
                    : "text-red-500 bg-red-100"
                } px-2 py-1 rounded`}
              >
                {plan.isActive ? "ACTIVE" : "NOT ACTIVE"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">•••</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      setEditingPlan(plan);
                      setIsDialogOpen(true);
                    }}
                  >
                    Update Schema
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      plan.isActive
                        ? makeInactive(plan.id!)
                        : makeActive(plan.id!)
                    }
                  >
                    {plan.isActive ? "Mark Inactive" : "Mark Active"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteSchema(plan.id!)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Schema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {plan.interestRate}%
                  </p>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">
                    {plan.termDuration} {plan.termDurationType}
                  </p>
                  <p className="text-sm text-gray-500">Term</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Minimum</p>
                  <p className="font-semibold text-gray-700">
                    ${plan.minAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Maximum</p>
                  <p className="font-semibold text-gray-700">
                    ${plan.maxAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Interest Period</p>
                  <p className="font-semibold text-gray-700">
                    {plan.interestPeriod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payout Term</p>
                  <p className="font-semibold text-gray-700">
                    {plan.payoutTerm}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 ">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fixed Investment</span>
                  <span
                    className={
                      plan.isFixedInvestment ? "text-green-500" : "text-red-500"
                    }
                  >
                    {plan.isFixedInvestment ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Return Capital</span>
                  <span
                    className={
                      plan.returnCapital ? "text-green-500" : "text-red-500"
                    }
                  >
                    {plan.returnCapital ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Featured</span>
                  <span
                    className={
                      plan.isFeatured ? "text-green-500" : "text-red-500"
                    }
                  >
                    {plan.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
