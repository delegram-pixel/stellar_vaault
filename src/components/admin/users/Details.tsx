import React from "react";
import {
  User,
  Profile,
  Transaction,
  Investment,
  Referral,
  KYCVerification,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  UserCircle,
  Shield,
  Repeat,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { getAllKyc, getAllKycId } from "@/lib/queries";
import Link from "next/link";
import KYCVerificationById from "../kyc/KycVerDetails";
import UpdateBalance from "./UpdateBalance";

interface UserDetailsProps {
  user: User & {
    profile: Profile | null;
    transactions: Transaction[];
    investments: Investment[];
    referrals: Referral[];
    kycVerification: KYCVerification | null;
  };
}

const UserDetails: React.FC<UserDetailsProps> = async ({ user }) => {
  const userId = user.clerkId;

  const kycver = await getAllKycId(userId);

  if (!kycver) return null;

  return (
    <div className="p-4 sm:p-6min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            User / {user.fullname}
          </h1>
          <p className="text-sm ">
            User ID: {user.id} • Email: {user.email} • Status: {user.status}
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0  border-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

       
      </div>

      <Tabs defaultValue="personal" className="mb-8">
        <TabsList className="bg-white rounded-full p-1 shadow-sm">
          <TabsTrigger
            value="personal"
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="investments"
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Investments
          </TabsTrigger>
          <TabsTrigger
            value="referrals"
            className="rounded-full hidden md:flex px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Referrals
          </TabsTrigger>

          <TabsTrigger
            value="bal"
            className="rounded-full md:flex px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Update Balance
          </TabsTrigger>

         
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className=" shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="">
                  <CardTitle className="text-2xl">
                    Personal Information
                  </CardTitle>
                  <p className="text-sm opacity-80">
                    Basic info, like name and address etc that used on platform.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4 0">
                        BASIC INFORMATION
                      </h3>
                      <dl className="space-y-3">
                        {[
                          {
                            label: "Username",
                            value: user.profile?.fullName || "Not updated yet",
                          },
                          { label: "Email Address", value: user.email },
                          { label: "Full Name", value: user.fullname },
                          {
                            label: "Display Name",
                            value:
                              user.profile?.fullName?.split(" ")[0] ||
                              "Not updated yet",
                          },
                          {
                            label: "Mobile Number",
                            value:
                              user.profile?.phoneNumber || "Not updated yet",
                          },
                          { label: "Date of Birth", value: "Not updated yet" },
                          { label: "Gender", value: "Not updated yet" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <dt className="text-sm text-gray-600">
                              {item.label}
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 ">
                        RESIDENTIAL ADDRESS
                      </h3>
                      <dl className="space-y-3">
                        {[
                          {
                            label: "Address Line",
                            value: user.profile?.address || "Not updated yet",
                          },
                          {
                            label: "City",
                            value: user.profile?.city || "Not updated yet",
                          },
                          {
                            label: "State / Province",
                            value: user.profile?.state || "Not updated yet",
                          },
                          {
                            label: "Zip / Postal Code",
                            value: user.profile?.zipCode || "Not updated yet",
                          },
                          {
                            label: "Country",
                            value: user.profile?.country || "Not updated yet",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <dt className="text-sm text-gray-600">
                              {item.label}
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4 ">
                      ADDITIONAL INFORMATION
                    </h3>
                    <dl className="space-y-3">
                      {[
                        {
                          label: "Join Date",
                          value: user.createdAt.toLocaleDateString(),
                        },
                        {
                          label: "Email Verified At",
                          value: user.createdAt.toLocaleString(),
                        },
                        { label: "Email Unusual Activity", value: "Enabled" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-200"
                        >
                          <dt className="text-sm text-gray-600">
                            {item.label}
                          </dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-24 h-24 mb-4 bg-orange-100 text-orange-600">
                      <AvatarFallback className="text-3xl font-semibold">
                        {user.fullname.charAt(0)}
                        {user.fullname.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.fullname}
                    </h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <h3 className="text-sm font-semibold text-orange-800 mb-2">
                        MAIN ACCOUNT
                      </h3>
                      <p className="text-3xl font-bold text-orange-700">
                        {user.balance.toFixed(2)} USD
                      </p>
                      <p className="text-sm text-orange-600">
                        Available Balance
                      </p>
                      <p className="text-xl font-semibold text-orange-700 mt-2">
                        0.00
                      </p>
                      <p className="text-sm text-orange-600">Locked Amount</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h3 className="text-sm font-semibold text-blue-800 mb-2">
                        INVESTED ACCOUNT
                      </h3>
                      <p className="text-3xl font-bold text-blue-700">
                        0.00 USD
                      </p>
                      <p className="text-sm text-blue-600">Investment Wallet</p>
                      <p className="text-xl font-semibold text-blue-700 mt-2">
                        0.00
                      </p>
                      <p className="text-sm text-blue-600">Active Investment</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {[
                      { label: "User ID", value: user.id },
                      {
                        label: "Last Login",
                        value: user.updatedAt.toLocaleDateString(),
                      },
                      {
                        label: "Email Status",
                        value: user.kycApproved ? "Verified" : "Unverified",
                      },
                      {
                        label: "Register At",
                        value: user.createdAt.toLocaleString(),
                      },
                    ].map((item, index) => (
                      <p key={index} className="text-sm">
                        <span className="text-gray-600">{item.label}:</span>{" "}
                        <span className="font-medium text-gray-900">
                          {item.value}
                        </span>
                      </p>
                    ))}
                  </div>
                  <div className="mt-8 space-y-3">
                    {[
                      { icon: Mail, text: "Send Email" },
                      { icon: UserCircle, text: "Update Balance" },
                      { icon: Shield, text: "Check API Access" },
                      { icon: Repeat, text: "Reset 2FA" },
                    ].map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                      >
                        <item.icon className="mr-2 h-4 w-4 text-orange-500" />
                        {item.text}
                        <ChevronRight className="ml-2 h-4 w-4 text-orange-500" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Transactions</CardTitle>
                  <p className="text-sm text-gray-600">
                    List of user transactions.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul>
                    {user.transactions.map((transaction, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {transaction.amount} USD
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Investments Tab */}
        <TabsContent value="investments">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Investments</CardTitle>
                  <p className="text-sm text-gray-600">
                    List of user investments.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul>
                    {user.investments.map((investment, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {investment.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {investment.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {investment.amount} USD
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Referrals</CardTitle>
                  <p className="text-sm text-gray-600">
                    List of user referrals.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul>
                    {user.referrals.map((referral, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {referral.referredUserEmail}
                          </p>
                          <p className="text-sm text-gray-600">
                            Referred on: {referral.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {referral.bonus} USD
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Activities</CardTitle>
                  <p className="text-sm text-gray-600">
                    User activities on the platform.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul>
                    {/* Assuming activities are stored in a similar array */}
                    {user.transactions.map((activity, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {activity.amount} USD
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kyc">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Kyc Verification</CardTitle>
                  <p className="text-sm text-gray-600">User kyc application</p>
                </CardHeader>
                <CardContent className="p-6">
                 
                    <div>
                      <div className="flex gap-5">
                        <div>
                        <KYCVerificationById  userId={user.clerkId}/>

                        </div>
                      </div>
                    </div>
               
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Update Balance</CardTitle>
                  {/* <p className="text-sm text-gray-600">User kyc application</p> */}
                </CardHeader>
                <CardContent className="p-6">
                 
                    <UpdateBalance  userId={user.clerkId}/>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;
