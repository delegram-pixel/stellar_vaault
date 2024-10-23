"use client"

import { CircleDotDashedIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { getUserInvestmentData } from '@/lib/queries';
import { onLoginUser } from "@/actions/auth";

const InvestmentCard = () => {

  const [investmentData, setInvestmentData] = useState({
    availableFunds: 0,
    totalInvested: 0,
    totalProfit: 0
  });

  useEffect(() => {
    async function fetchData() {
      const user = await onLoginUser(); // Replace this with actual user ID retrieval logic
      const userId = user?.user?.clerkId// Replace with actual user ID
      const data = await getUserInvestmentData(userId);
      setInvestmentData(data);
    }
    fetchData();
  }, []);


  return (
    <div className="flex  flex-col md:flex-row gap-10">
      <div className=" rounded-lg border-l-black border-l-[5px] flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border bg-cream dark:bg-muted md:w-[30%] w-full">
        <div className="">
          <p>Investment Account </p>

          <div className="">
            <div className="flex gap-2 mt-4">
              <p className="text-2xl font-bold">${investmentData.availableFunds.toFixed(2)}</p>
              <p className="mt-1"> USD</p>
            </div>
            <p className="text-sm font-normal">Available Funds</p>
          </div>
        </div>
      </div>

      <div className=" rounded-lg border-l-black border-l-[5px] flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border bg-cream dark:bg-muted md:w-full w-full">
        <div className="">
          <p>Amount in Invested </p>

          <div className="flex gap-4">
            <div className=" ">
              <div className="flex gap-2 mt-4">
                <p className="text-2xl font-bold">   ${investmentData.totalInvested.toFixed(2)} </p>
                <p className="mt-1"> USD</p>
              </div>
              <p className="text-sm font-normal">Currently Invested</p>
            </div>

            <PlusIcon className="mt-4" />

            <div className=" ">
              <div className="flex gap-2 mt-4">
                <p className="text-2xl font-bold"> + ${investmentData.totalProfit.toFixed(2)} </p>
              </div>
              <p className="text-sm font-normal">Approx Profit</p>
            </div>
          </div>

          {/* <div className="md:flex max-md:hidden hidden  absolute right-40 top-15 mt-24">
            <Image
              src="/invest_plan.png"
              className="w-[150px]"
              alt="invest"
              width={100}
              height={100}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
