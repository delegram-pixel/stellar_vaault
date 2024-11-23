"use client"

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvestments } from '@/lib/queries';
import { Investment } from '@prisma/client';
import { onLoginUser } from '@/actions/auth';
import { Spinner } from '../spinner';

// Custom hook for real-time profit calculation
const useRealTimeProfit = (investment: Investment) => {
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (!investment) return;

    const calculateProfit = () => {
      const interestRate = investment.plan.interestRate / 100;
      const dailyRate = interestRate / 365;
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const daysActive = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setProfit(investment.amount * dailyRate * daysActive);
    };

    calculateProfit();
    const interval = setInterval(calculateProfit, 1000);
    return () => clearInterval(interval);
  }, [investment]);

  return profit;
};

interface InvestmentTableRowProps {
  investment: Investment;
}

const InvestmentTableRow: React.FC<InvestmentTableRowProps> = ({ investment }) => {
  const currentProfit = useRealTimeProfit(investment);
  
  return (
    <TableRow>
      <TableCell className="max-w-[250px] pl-2 pr-10">
        <div className="flex items-center gap-3">
          <h1 className="text-14 truncate font-semibold dark:text-white text-[#344054]">
            {investment.plan.name}
          </h1>
        </div>
      </TableCell>
      <TableCell>
        ${investment.amount.toFixed(2)}
      </TableCell>
      <TableCell>
        ${currentProfit.toFixed(2)}
      </TableCell>
      <TableCell>
        {investment.status}
      </TableCell>
      <TableCell>
        {new Date(investment.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {new Date(investment.endDate).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

const InvestmentTable: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const user = await onLoginUser();
        const userId = user?.user?.clerkId;
        if (!userId) {
          throw new Error('User not found');
        }
        
        const fetchedInvestments = await getInvestments(userId);
        setInvestments(fetchedInvestments);
      } catch (err) {
        setError('Failed to fetch investments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
    const interval = setInterval(fetchInvestments, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: {error}
      </div>
    );
  }

  if (!investments.length) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No investments found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="hover:bg-transparent">
        <TableRow>
          <TableHead className="px-2">Investment</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Current Profit</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Start Date</TableHead>
          <TableHead className="px-2">End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments.map((investment) => (
          <InvestmentTableRow 
            key={investment.id} 
            investment={investment} 
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default InvestmentTable;