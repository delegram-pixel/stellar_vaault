import React from "react";
import { DailyInsightChart } from "./dailychats";
import { dataDatabase, getAdminDashboardData } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminCard = async () => {
  const databaseData = dataDatabase();
  const dashdata = await getAdminDashboardData();
  const data = [
    { date: "01 Aug", value: 1000 },
    { date: "02 Aug", value: 2000 },
    { date: "03 Aug", value: 3000 },
    { date: "04 Aug", value: 4000 },
    { date: "05 Aug", value: 5000 },
  ];

  return (
    <div className="w-full p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Insight Section */}
        <Card className="lg:col-span-7 bg-white dark:bg-muted">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Daily Insight</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daywise overall deposit & withdraw.
            </p>
          </CardHeader>
          <CardContent>
            <DailyInsightChart dashdata={dashdata} />
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Total Deposit Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Total Deposit</h3>
                  <p className="text-2xl font-semibold mt-2">
                    {(await databaseData).deposits._sum.amount} USDT
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="font-medium">
                      {(await databaseData).deposits._sum.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="font-medium">0.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Withdraw Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Total Withdraw</h3>
                  <p className="text-2xl font-semibold mt-2">
                    {(await databaseData).withdrawals._sum.amount} USDT
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="font-medium">
                      {(await databaseData).withdrawals._sum.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="font-medium">0.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;