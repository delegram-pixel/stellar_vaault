"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Investment {
  type: string;
  amount: string;
  createdAt: string;
  currency: string;
  status: string;
}

export function InvestmentPanel({
  investments,
}: {
  investments?: Investment[];
}) {
  return (
    <div className="rounded-sm bg-white  dark:bg-muted w-full h-[500px] flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-muted p-4">
        <Separator className="mt-4" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {investments && investments.length > 0 ? (
          investments.map((investment, index) => {
            const formattedDate = format(
              new Date(investment.createdAt),
              "yyyy-MM-dd HH:mm:ss"
            );

            return (
              <div key={index} className="py-4 border-b-2 last:border-b-0 hover:bg-muted cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {investment.type.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold">
                        {investment.type}
                      </p>
                      <div className="flex gap-5">
                        <p className="text-sm text-gray-400">{formattedDate}</p>
                        <p className="text-sm text-gray-400">{investment.status}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm flex">
                      {investment.amount} {investment.currency}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No investments to display.</p>
        )}
      </div>
    </div>
  );
}