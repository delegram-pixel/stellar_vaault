import React from "react";
import { TransactionPanel } from "./TransactionFetch";
import Link from "next/link";
import { InvestmentPanel } from "./InvestmentFetch";
import { UsersIcon } from "@/icons/adminusers-icon";
import { ReferralsIcon } from "@/icons/Referral-icon";
import { getAdminDashboardData, getAllInvestment, getAllTransactions } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSection = async () => {
  const dashdata = await getAdminDashboardData();
  const transactions = await getAllTransactions();
  const invest = await getAllInvestment();

  const StatBox = ({ color, label, value }) => (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 ${color}`} />
      <div>
        <h2 className="text-gray-400 text-sm">{label}</h2>
        <p className="text-xl font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 space-y-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Section - Transactions and Investments */}
        <div className="xl:col-span-7 space-y-6">
          {/* Transactions Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="p-6">
              <TransactionPanel transactions={transactions} />
            </CardContent>
          </Card>

          {/* Investments Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Investment Activities</h2>
                <Link
                  href="/admin/investments"
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                  All investments
                </Link>
              </div>
              <InvestmentPanel investment={invest} />
            </CardContent>
          </Card>
        </div>

        {/* Right Section - User Activities and Stats */}
        <div className="xl:col-span-5 space-y-6">
          {/* User Activities Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2">User Activities</h2>
              <p className="text-sm text-slate-400 mb-6">In last 30 days</p>
              
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <UsersIcon />
                  <span className="text-xl font-medium">{dashdata.totalUsers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ReferralsIcon />
                  <span className="text-xl font-medium">0</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <span className="text-sm text-gray-400">Directly Joined</span>
                <span className="text-sm text-gray-400">Referred Users</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Stats Card */}
          <Card className="bg-white dark:bg-muted">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Total Stats</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <StatBox 
                  color="bg-blue-500"
                  label="Deposits"
                  value={dashdata.totalDeposits}
                />
                <StatBox 
                  color="bg-red-500"
                  label="Withdraws"
                  value={dashdata.totalWithdrawals}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <StatBox 
                  color="bg-purple-500"
                  label="Transactions"
                  value={dashdata.totalTransactions}
                />
                <StatBox 
                  color="bg-orange"
                  label="Users"
                  value={dashdata.totalUsers}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;