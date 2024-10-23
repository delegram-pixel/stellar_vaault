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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllDepo,getAllWithdraw, approveDeposit, rejectDeposit, approveWithdraw, rejectWithdraw } from "@/lib/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  Settings, 
  Check, 
  X, 
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/use-toast";
import { TransactionStatus } from "@prisma/client";

type TransactionStatu = TransactionStatus

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  currency: string;
  txnBy: string;
  order: string;
  user: {
    fullname: string;
    clerkId: string;
  };
}

type FilterType = "all" | TransactionStatu;


const WithdrawalTransactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {toast} = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getAllWithdraw();
      setAllTransactions(transactions);
      setFilteredTransactions(transactions);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = allTransactions.filter((transaction) => {
      const matchesFilter = filter === "all" || transaction.status === filter;
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    setFilteredTransactions(filtered);
  }, [filter, searchTerm, allTransactions]);

 
  const handleApprove = async (id: string) => {
    try {
      await approveWithdraw(id);

      const updatedTransactions = await getAllWithdraw();
      setAllTransactions(updatedTransactions);


      toast({
  
        title: "Approved ",
        description: "Transaction Approval Sucessful",
      });
    } catch (error) {
      console.error("Error approving deposit:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not make a approval",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectWithdraw(id);
      // Refresh the transactions list
      const updatedTransactions = await getAllWithdraw();
      setAllTransactions(updatedTransactions);
      toast({
    
        title: "Sucess!!!",
        // description: "Could not make a deposit",
      });
    } catch (error) {
      console.error("Error rejecting deposit:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not make a rejctions",
      });
    }
  };

//   console.log({fetchTransactions.}.)

  const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
      case "PENDING": return "text-yellow-500";
      case "FAILED": return "text-red-500";
      case "COMPLETED": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Withdraw</h1>
          <p className="text-sm text-gray-500">Total {allTransactions.length} transactions.</p>
        </div>
        {/* <Button variant="outline">
          + Add <span className="ml-2 transform rotate-180">^</span>
        </Button> */}
      </div>

      <div className="flex space-x-4 mb-6">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          onClick={() => setFilter("all")}
          className="bg-orange"
        >
          History
        </Button>
        <Button 
          variant={filter === "PENDING" ? "default" : "outline"} 
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </Button>
        <Button 
          variant={filter === "FAILED" ? "default" : "outline"} 
          onClick={() => setFilter("FAILED")}
        >
        Failed
        </Button>
        <Button 
          variant={filter === "COMPLETED" ? "default" : "outline"} 
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </Button>
       
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Orders</h2>
        <div className="flex space-x-2 items-center">
          <Input
            placeholder="Search by Transaction ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Details</TableHead>
            <TableHead>Txn By</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => {
            const formattedDate = format(
              new Date(transaction.createdAt),
              "MMM dd, yyyy"
            );
            const statusColor = getStatusColor(transaction.status);
            console.log(transaction.user.clerkId, transaction.user.fullname)
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>DE</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Withdaw Funds</p>
                      <p className="text-sm text-gray-500">{formattedDate} • <span className={statusColor}>{transaction.status}</span></p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{transaction.user.fullname}</TableCell>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  <p className="font-semibold">- {transaction.amount} {transaction.currency}</p>
                  <p className="text-sm text-gray-500">{(transaction.amount * 1.2).toFixed(2)} USD</p>
                </TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">•••</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleApprove(transaction.id)}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReject(transaction.id)}>
                        <X className="mr-2 h-4 w-4" /> Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
          
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// export default DepositsTransactions;

export default WithdrawalTransactions