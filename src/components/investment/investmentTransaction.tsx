"use client"

import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInvestments } from '@/lib/queries';
import { Investment } from '@prisma/client';
import { onLoginUser } from '@/actions/auth';
import { Spinner } from '../spinner';
import { formatCurrency } from './FormatCurrency';
// import { formatCurrency } from '@/lib/utils';

// Improved type for investment plan
interface InvestmentPlan {
  id: string;
  name: string;
  interestRate: number;
  interestPeriod: 'hourly' | 'daily' | 'monthly' | 'yearly';
}

// Enhanced type for investment
interface EnhancedInvestment extends Investment {
  plan: InvestmentPlan;
}

// Custom hook for real-time profit calculation with memoization
const useRealTimeProfit = (investment: EnhancedInvestment) => {
  const calculateProfit = useMemo(() => {
    if (!investment) return () => 0;

    return () => {
      const interestRate = investment.plan.interestRate / 100;
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const daysActive = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const getPeriodMultiplier = () => {
        switch (investment.plan.interestPeriod) {
          case 'hourly': return 1 / 24;
          case 'daily': return 1 / 30 ;
          case 'monthly': return 1 / 30;
          case 'yearly': return 1 / 365;
          default: return 0;
        }
      };

      const dailyRate = interestRate * getPeriodMultiplier();
      return investment.amount * dailyRate * daysActive;
    };
  }, [investment]);

  const [profit, setProfit] = useState(calculateProfit());

  useEffect(() => {
    if (!investment) return;

    const updateProfit = () => setProfit(calculateProfit());
    updateProfit(); // Initial calculation

    const interval = setInterval(updateProfit, 1000);
    return () => clearInterval(interval);
  }, [calculateProfit, investment]);

  return profit;
};

// Investment Table Row Component
const InvestmentTableRow: React.FC<{ investment: EnhancedInvestment }> = ({ investment }) => {
  const currentProfit = useRealTimeProfit(investment);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {investment.plan.name}
      </TableCell>
      <TableCell>
        {formatCurrency(investment.amount)}
      </TableCell>
      <TableCell className="text-green-600">
        {formatCurrency(currentProfit)}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(investment.status)}>
          {investment.status}
        </Badge>
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

// Main Investment Table Component
const InvestmentTable: React.FC = () => {
  const [investments, setInvestments] = useState<EnhancedInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        const user = await onLoginUser();
        const userId = user?.user?.clerkId;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        const fetchedInvestments = await getInvestments(userId);
        setInvestments(fetchedInvestments);
        setError(null);
      } catch (err) {
        console.error('Investment fetch error:', err);
        setError('Failed to fetch investments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
    const interval = setInterval(fetchInvestments, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center">
            <Spinner />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-red-500">
            {error}
          </TableCell>
        </TableRow>
      );
    }

    if (!investments.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-gray-500">
            No investments found
          </TableCell>
        </TableRow>
      );
    }

    return investments.map((investment) => (
      <InvestmentTableRow 
        key={investment.id} 
        investment={investment} 
      />
    ));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Investment</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Current Profit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderContent()}
      </TableBody>
    </Table>
  );
};

export default InvestmentTable;