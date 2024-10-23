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

const InvestmentTable: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const user = await onLoginUser(); // Replace this with actual user ID retrieval logic
        const userId = user?.user?.clerkId
        const fetchedInvestments = await getInvestments(userId);
        setInvestments(fetchedInvestments);
      } catch (err) {
        setError('Failed to fetch investments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvestments();
  }, []);

  if (isLoading) return <div><Spinner/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <TableHeader className="hover:bg-transparent">
        <TableRow>
          <TableHead className="px-2">Investment</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Start Date</TableHead>
          <TableHead className="px-2">End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments.map((investment) => (
          <TableRow key={investment.id} className=''>
            <TableCell className="max-w-[250px] pl-2 pr-10">
              <div className="flex items-center gap-3">
                <h1 className="text-14 truncate font-semibold dark:text-white text-[#344054]">
                  {investment.plan.name} {/* Assuming plan has a name field */}
                </h1>
              </div>
            </TableCell>
            <TableCell>
              ${investment.amount.toFixed(2)}
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
        ))}
      </TableBody>
    </Table>
  )
}

export default InvestmentTable;