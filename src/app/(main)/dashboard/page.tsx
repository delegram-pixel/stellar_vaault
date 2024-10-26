import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Goal, Info, Terminal } from 'lucide-react'
import LandingTrading from '@/components/site/Landing'
import { getAlTransactions, getBalance, TotalDepo, TotalWithdraw } from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getKyc } from "@/lib/queries";


const Dashboard = async () => {
  const currentYear = new Date().getFullYear()
  const getBalances = await getBalance()
  if (!getBalances) return null;
  const getKycDetails = await getKyc();

const getAllTransaction  = await getAlTransactions()
  if (!getAllTransaction) return null;

  const getNumberofDepo = await TotalDepo();

  const getNumberofWithdraw = await TotalWithdraw();

  return (
    <div className="relative  h-full">
      <h1 className="text-2xl">Dashboard</h1>
      <Separator className="my-6" />

      <div>
      {getKycDetails && getKycDetails.status === "PENDING" && (
        <div>
  <Alert className='border border-yellow-100 p-5 mb-3'>
      {/* <Terminal className="h-4 w-4" /> */}
      <AlertTitle className='flex gap-2'> 
        
        <Info className='text-yellow-500'/> 
        <p className='mt-1 font-bold'>Kyc Verification Pending</p>
        </AlertTitle>
      <AlertDescription>
     <p className='text-[12px] dark:text-gray-500'> Your submitted KYC information is pending for admin verification. Please wait for further instructions.

</p>   
      </AlertDescription>
    </Alert>
        </div>

      )}
    

      

      </div>

      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 md:flex-row flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Balance</CardDescription>
              <CardTitle className="text-4xl">${getBalances.balance}.00</CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total Balance for this account dashboard.
            </CardContent>
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Deposit</CardDescription>
              <CardTitle className="text-4xl">{getNumberofDepo}</CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
            Here’s a summary of your recent deposits.
            </CardContent>
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Withdrawn</CardDescription>
              <CardTitle className="text-4xl">{getNumberofWithdraw}</CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            
          </Card>
        </div>

        <div className="flex mt-5 gap-4 xl:!flex-row md:flex-row flex-col">
          {/* <Card className=" w-full h-[800px]">
            <CardHeader>
              <CardTitle>Trading Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              </div>
            </CardContent>
          </Card> */}
          <div className='w-full'>
    <p className='mb-2 font-bold text-sm'>Trading Charts</p>
          <LandingTrading/>
            
          </div>

          <Card className=" w-full">
            <CardHeader>
              <CardTitle>Recent Transactions </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard