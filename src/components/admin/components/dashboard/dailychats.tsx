"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getAdminDashboardData, getAllTransactions } from '@/lib/queries'

interface DataPoint {
  date: string
  value: number
}

interface DailyInsightChartProps {
  data?: DataPoint[]
  deposit?: number
  withdraw?: number
  lastMonthDeposit?: number
  lastMonthWithdraw?: number
  dashdata?: any
}

// Mock data generation
const generateMockData = (dashdata?: any): DataPoint[] => {
  const data: DataPoint[] = []
  const currentDate = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 500 // Random value between 500 and 1500
    })
  }
  return data
}

const mockData = generateMockData()
const mockDeposit = 15000
const mockWithdraw = 10000
const mockLastMonthDeposit = 12000
const mockLastMonthWithdraw = 8000

export function DailyInsightChart({ 
  data = mockData, 
  deposit = mockDeposit, 
  withdraw = mockWithdraw, 
  lastMonthDeposit = mockLastMonthDeposit, 
  lastMonthWithdraw = mockLastMonthWithdraw,
  dashdata
}: DailyInsightChartProps) {
  const [chartData, setChartData] = useState<DataPoint[]>([])

  useEffect(() => {
    setChartData(data)
  }, [data])

  // Use dashboard data if provided
  const finalDeposit = dashdata?.totalDeposits ?? deposit
  const finalWithdraw = dashdata?.totalWithdrawals ?? withdraw
  const finalLastMonthDeposit = dashdata?.lastMonthDeposits ?? lastMonthDeposit
  const finalLastMonthWithdraw = dashdata?.lastMonthWithdrawals ?? lastMonthWithdraw

  return (
    <Card className="w-full mx-auto border-none">
      <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
        <div className="h-[100px] sm:h-[100px] md:h-[200px] mt-5 ml-2  md:ml-[-40px] ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}}
                interval={'preserveStartEnd'}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-1">
          <Card className='border-[2px] border-blue-500 w-90'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">Deposit</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{finalDeposit}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Last month ${finalLastMonthDeposit}
              </p>
            </CardContent>
          </Card>
          <Card className='border-[2px] border-red-500'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdraw</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-500">{finalWithdraw}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Last month ${finalLastMonthWithdraw}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}