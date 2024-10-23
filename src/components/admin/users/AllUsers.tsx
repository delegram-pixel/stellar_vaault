"use client";

import { useState, useEffect } from "react";
import { User, Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getFilteredUsers,
  handleActive,
  handlesus,
  updateUsersStatus,
} from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, CheckCircle2Icon, Eye, X } from "lucide-react";
import { TransactionsIcon } from "@/icons/transactions-icon";
import EmailIcon from "@/icons/email-icon";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import UpdateBalance from "./UpdateBalance";

type UserWithoutSensitiveInfo = Omit<User, "password">;

const AllUsers = () => {
  const [users, setUsers] = useState<UserWithoutSensitiveInfo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false);

  const [filter, setFilter] = useState({
    hasBalance: false,
    kycApproved: false,
    role: "Any Role" as Role | "Any Role",
    status: "Any Status",
  });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  async function fetchUsers() {
    const filteredUsers = await getFilteredUsers(filter);
    setUsers(filteredUsers);
  }

  const { toast } = useToast();
  function getColorClass(string: any) {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[hash % colors.length];
  }

  async function handleBulkAction(action: "LOCKED" | "SUSPENDED" | "ACTIVE") {
    const status =
      action === "LOCKED"
        ? "LOCKED"
        : action === "SUSPENDED"
        ? "SUSPENDED"
        : "ACTIVE";
    await updateUsersStatus(selectedUsers, status);
    fetchUsers();
    setSelectedUsers([]);
  }

  const handleApprove = async (id: string) => {
    try {
      await handleActive(id);

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

  const handleSuspend = async (id: string) => {
    try {
      await handlesus(id);

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Active Users</h1>
        <div>
          <Button variant="outline" className="mr-2">
            Manage Groups
          </Button>
          <Button variant="outline" className="mr-2">
            Export
          </Button>
          <Button>Add User</Button>
        </div>
      </div>

      <div className="mb-4">
        <Select
          onValueChange={(value) =>
            handleBulkAction(value as "LOCKED" | "SUSPENDED" | "ACTIVE")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Bulk Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOCKED">Mark as Locked</SelectItem>
            <SelectItem value="SUSPENDED">Mark as Suspend</SelectItem>
            <SelectItem value="ACTIVE">Mark as Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedUsers(users.map((user) => user.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Account Balance</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const userColorClass = getColorClass(user.fullname);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className=" mr-2">
                      <Avatar className={`${userColorClass}`}>
                        <AvatarFallback className="text-white">
                          {user.fullname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div>{user.fullname}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.balance.toFixed(2)} USD</TableCell>
                <TableCell>
                  {user.kycApproved ? (
                    <div className="flex gap-1">
                      <CheckCircle2Icon className="text-green-500" /> Kyc
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <X className="text-red-500" /> Kyc
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">•••</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuItem>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="gap-1 p-2"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="gap-1 p-2"
                        >
                          <TransactionsIcon /> Transactions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-1 p-2">
                        <Button onClick={() => setIsUpdateBalanceOpen(true)}>
                           Update Balance
                        </Button>

                        
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-1 p-2"
                        onClick={() => handleApprove(user.id)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Active
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <X
                          className="mr-2 h-4 w-4"
                          onClick={() => handleSuspend(user.id)}
                        />{" "}
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            Filter Users
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Checkbox
              id="hasBalance"
              checked={filter.hasBalance}
              onCheckedChange={(checked) =>
                setFilter({ ...filter, hasBalance: !!checked })
              }
            />
            <label htmlFor="hasBalance">Has Balance</label>

            <Checkbox
              id="emailVerified"
              checked={filter.kycApproved}
              onCheckedChange={(checked) =>
                setFilter({ ...filter, kycApproved: !!checked })
              }
            />
            <label htmlFor="emailVerified">Kyc Verified</label>

            <Select
              onValueChange={(value) =>
                setFilter({ ...filter, role: value as Role | "Any Role" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Role">Any Role</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Status">Any Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOCKED">Locked</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchUsers}>Apply Filters</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsers;
