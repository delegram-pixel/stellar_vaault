
import React from "react";
import { Separator } from "../ui/separator";
import WithdrawForm from "./WithdrawForm";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";


const WithdrawSec =  async () => {

  const authUser = await currentUser();
  if (!authUser) return null;

  const getBalance = await client.user.findUnique({
    where: {
      clerkId: authUser.id,
    },
  });
  if (!getBalance) return null;
  return (
    <div className="flex  flex-col md:flex-row gap-10">
      <div className=" rounded-lg border-l-black border-l-[5px] flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border bg-cream h-[40%] dark:bg-muted md:w-[30%] w-full">
        <div className="">
          <p>User Balance </p>

          <div className="">
            <div className="flex gap-2 mt-4">
              <p className="text-2xl font-bold"> {getBalance.balance.toFixed(2)} </p>
              <p className="mt-1"> USD</p>
            </div>
            <p className="text-sm font-normal">Available </p>
          </div>
        </div>
      </div>

      <div className=" rounded-lg border-l-black border-l-[5px] flex flex-col gap-3 pr-10 pl-10 py-10 md:pl-10 md:pr-20 border-[1px] border-border bg-cream dark:bg-muted md:w-full w-full">
        <div className="">
          <p className="text-2xl font-semibold">Withdraw </p>
          <p className="text-sm text-slate-400">
            {" "}
            The funds will be withdrawn only from your Interest Wallet. So make sure that you have sufficient balance in the Interest wallet.
          To withdraw funds input your wallet address, please contact our support team to assist you with your withdrawal.


          </p>
          <Separator className="mt-2 mb-5" />

          <div className="">
      <WithdrawForm/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSec;
