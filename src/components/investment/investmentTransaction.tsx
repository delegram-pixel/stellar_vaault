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
import { getRealTimeInvestmentStats } from '@/lib/queries'; // Assume this is where the previous function is stored

// Improved type for investment plan
interface InvestmentPlan {
  id: string;
  name: string;
  interestRate: number;
  termDuration: number;
  interestPeriod: 'hourly' | 'daily' | 'monthly' | 'yearly';
}

// Enhanced type for investment with real-time stats
interface EnhancedInvestment extends Investment {
  plan: InvestmentPlan;
  realTimeStats?: {
    currentProfit: number;
    daysActive: number;
    daysRemaining: number;
    percentageComplete: number;
    isActive: boolean;
  };
}

// Custom hook for real-time investment stats
const useRealTimeInvestmentStats = (investment: EnhancedInvestment) => {
  const [stats, setStats] = useState<EnhancedInvestment['realTimeStats']>();

  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const realTimeStats = await getRealTimeInvestmentStats(investment);
        setStats(realTimeStats);
      } catch (error) {
        console.error('Error fetching real-time stats:', error);
      }
    };

    // Initial fetch
    fetchRealTimeStats();

    // Set up interval for periodic updates
    const interval = setInterval(fetchRealTimeStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [investment]);

  return stats;
};

// Investment Table Row Component
const InvestmentTableRow: React.FC<{ investment: EnhancedInvestment }> = ({ investment }) => {
  const realTimeStats = useRealTimeInvestmentStats(investment);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'inactive': return 'destructive';
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
        {formatCurrency(realTimeStats?.currentProfit || 0)}
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
      <TableCell>
        {realTimeStats?.daysActive || 0} / {realTimeStats?.daysRemaining || 0} days
      </TableCell>
      <TableCell>
  {(realTimeStats && realTimeStats.percentageComplete !== undefined) 
    ? realTimeStats.percentageComplete.toFixed(2) 
    : 0}%
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
          <TableCell colSpan={8} className="text-center">
            <Spinner />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center text-red-500">
            {error}
          </TableCell>
        </TableRow>
      );
    }

    if (!investments.length) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center text-gray-500">
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
          <TableHead>Days</TableHead>
          <TableHead>Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderContent()}
      </TableBody>
    </Table>
  );
};

export default InvestmentTable;