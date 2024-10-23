import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import { AddressForm } from "./ProfileForm";
import { getProfileDetails } from "@/lib/queries";

import {
  Dialog,
  DialogContent,

  DialogTrigger,
} from "@/components/ui/dialog";

import KycMain from "@/app/(main)/kyc/page";
import Link from "next/link";

const ProfileCard = async () => {
  const getProfile = await getProfileDetails();
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className=" rounded-lg   flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border  md:w-[60%] w-full">
        <div className="">
          <div className=" flex justify-center ">
            <Avatar className="w-20 h-20">
              <AvatarFallback>
                {getProfile?.fullName?.slice(0, 2).toUpperCase() || "DE"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-5 ">
           
                <Link href="/kyc">
                <Button className="bg-grandis text-gray-700  font-semibold">
              Verification
            </Button>
                </Link>
        

           
          </div>

          <div className="mt-5">
            <p className="text-sm md:text-[20px]">Personal Information</p>
            <Separator className="mt-2" />
            <div className="mt-5 ">
              <div className="flex  md:justify-between flex-col">
                <div>
                  <p className="font-bold"> Full Name </p>
                  <p className="mt-2"> {getProfile?.fullName} </p>
                </div>
                
                <div>
                  <p className="font-bold"> Email </p>
                  <p> {getProfile?.email}</p>
                </div>
              </div>
              <div className="flex mt-5 justify-between">
                {/* <div>
                  <p className="font-bold"> Phone Number </p>
                  <p> {getProfile?.phoneNumber} </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddressForm profile={getProfile} />
    </div>
  );
};

export default ProfileCard;
