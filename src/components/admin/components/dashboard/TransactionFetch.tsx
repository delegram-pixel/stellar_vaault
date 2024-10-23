"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Transaction {
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: string;
  createdAt: string;
  currency: String;
}

export function TransactionPanel({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "in") return transaction.type === "DEPOSIT";
    if (activeTab === "out") return transaction.type === "WITHDRAWAL";
    return false;
  });

  return (
    <div className="rounded-sm bg-white dark:bg-muted w-full h-[500px] flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-muted ">
        <div className="flex justify-between items-center">
          <h1 className="font-bold">Transactions</h1>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-transparent shadow-none"
          >
            <TabsList className="bg-transparent shadow-transparent">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in">In</TabsTrigger>
              <TabsTrigger value="out">Out</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Separator className="mt-4" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredTransactions.map((transaction, index) => {
          const formattedDate = format(
            new Date(transaction.createdAt),
            "yyyy-MM-dd HH:mm:ss"
          );

          return (
            <div key={index} className="py-4 border-b-2 last:border-b-0 hover:bg-muted cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {transaction.type.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">
                      {transaction.type} FUNDS
                    </p>
                    <div className="flex gap-5">
                      <p className="text-sm text-gray-400">{formattedDate}</p>
                      
                    </div>
                  </div>
                </div>
                <div>
                  <p
                    className={`text-sm flex ${
                      transaction.type === "DEPOSIT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "DEPOSIT" ? "+" : "-"}{" "}
               {transaction.amount} {transaction.currency}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}