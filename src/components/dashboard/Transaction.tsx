import React from 'react'
import { format } from "date-fns";
import { getAlTransactions, getBalance } from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";



const Transaction = async () => {
    const getBalances = await getBalance()
  if (!getBalances) return null;

const getAllTransaction  = await getAlTransactions()
  if (!getAllTransaction) return null;



  return (
    <div>
          {getAllTransaction &&
              getAllTransaction.map((transaction) => {
                const formattedDate = format(
                  new Date(transaction.createdAt),
                  "yyyy-MM-dd HH:mm:ss"
                );

                return (
                  <div
                    key={transaction.userId}
                    className=" w-full justify-between items-center border-b-2 py-5"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {transaction.type.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-bold">
                            {" "}
                            {transaction.type} FUNDS
                          </p>
                          <div className="flex gap-5">
                            <p className="text-sm text-gray-400">
                              {" "}
                              {formattedDate}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.type === "DEPOSIT" ? (
                                <p> Money Deposited</p>
                              ) : (
                                <p> Money Withdrawn</p>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        {transaction.type === "DEPOSIT" ? (
                          <p className="text-sm text-green-600">
                            + {transaction.amount} {transaction.currency}{" "}
                          </p>
                        ) : (
                          <p className="text-sm text-red-600">
                            - {transaction.amount} {transaction.currency}{" "}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

    </div>
  )
}

export default Transaction