"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { getAllTrans, getAllTransaction } from "@/lib/queries";
import { format } from "date-fns";
import { TransactionStatus, TransactionType } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

type TransactionTypes = TransactionType;
type TransactionStatu = TransactionStatus

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  user: {
    fullname: string;
  }
  currency: string;
  // Add other fields as necessary
}

type FilterType = "all" | TransactionType;

const AdminTransaction: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getAllTrans();
      setAllTransactions(transactions);
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = allTransactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type.toLowerCase() === filter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusColor = (status: TransactionStatu): string => {
    switch (status) {
      case "PENDING": return "text-yellow-500";
      case "FAILED": return "text-red-500";
      case "COMPLETED": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Select
          value={filter}
          onValueChange={(value: FilterType) => {
            setFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="withdrawal">Withdraw</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="hover:bg-transparent">
          <TableRow>
            <TableHead className="px-2 max-md:hidden" >Transaction</TableHead>
            <TableHead className="px-2">Type</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2 ">User</TableHead>
            <TableHead className="px-2 ">Date</TableHead>

            {/* <TableHead className="px-2 max-md:hidden">Category</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTransactions.map((transaction) => {
            const formattedDate = format(
              new Date(transaction.createdAt),
              "yyyy-MM-dd HH:mm:ss"
            );
            const statusColor = getStatusColor(transaction.status);

            return (
              <TableRow key={transaction.id}>
                <TableCell className="max-w-[250px] max-md:hidden pl-2 pr-10">
                  <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>  {transaction.type.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  </div>
                </TableCell>
              
                <TableCell>
                <h1 className="text-14 truncate font-semibold dark:text-white text-[#344054]">
                      {transaction.type}
                    </h1>
                </TableCell>
               
                <TableCell> {transaction.amount} {transaction.currency}</TableCell>
                <TableCell className={statusColor}>
                  {transaction.status}
                </TableCell>
                <TableCell>{transaction.user.fullname}</TableCell>
                <TableCell>{formattedDate}</TableCell>
               
          
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// export default TransactionsTable;

export default AdminTransaction