"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllKyc, handleApproved, handleNotApproved } from "@/lib/queries";
import { KYCVerification } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";

const KYCVerificationCenter = () => {
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pending"| "rejected">("all");
  const [allKyc, setAllKyc] = useState<KYCVerification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKYC = async () => {
      const KYC = await getAllKyc();
      setAllKyc(KYC);
    };
    fetchKYC();
  }, []);

  const filteredKYC = allKyc.filter((kyc) => {
    if (activeTab === "all") return true;
    if (activeTab === "approved") return kyc.status === "APPROVED";
    if (activeTab === "rejected") return kyc.status === "REJECTED";
    if (activeTab === "pending") return kyc.status === "PENDING";
    return false;
  });

  const handleApprove = async (id: string) => {
    try {
      await handleApproved(id);
      const updatedKYC = await getAllKyc();
      setAllKyc(updatedKYC);
      toast({
        title: "Approved",
        description: "KYC Approval Successful",
      });
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not approve KYC",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await handleNotApproved(id);
      const updatedKYC = await getAllKyc();
      setAllKyc(updatedKYC);
      toast({
        title: "Success!",
        description: "KYC Rejection Successful",
      });
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not reject KYC",
      });
    }
  };

  return (
    <div className="mt-5 mx-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "approved" | "pending" | "rejected")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected"> Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <KYCTable kycData={filteredKYC} handleApprove={handleApprove} handleReject={handleReject} />
        </TabsContent>
        <TabsContent value="approved">
          <KYCTable kycData={filteredKYC} handleApprove={handleApprove} handleReject={handleReject} />
        </TabsContent>
        <TabsContent value="pending">
          <KYCTable kycData={filteredKYC} handleApprove={handleApprove} handleReject={handleReject} />
        </TabsContent>
        <TabsContent value="rejected">
          <KYCTable kycData={filteredKYC} handleApprove={handleApprove} handleReject={handleReject} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const KYCTable = ({ kycData, handleApprove, handleReject }:any) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableCell>User</TableCell>
        <TableCell>Postal</TableCell>
        <TableCell>Country</TableCell>
        <TableCell>Documents</TableCell>
        <TableCell>Submitted At</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {kycData.map((kyc) => (
        <TableRow key={kyc.id}>
          <TableCell>{kyc.fullName}</TableCell>
          <TableCell>{kyc.postalCode}</TableCell>
          <TableCell>{kyc.country}</TableCell>
          <TableCell>
            <DocumentDialog title="ID Front" imageUrl={kyc.idFrontUrl} />
            <DocumentDialog title="ID Back" imageUrl={kyc.idBackUrl} />
            <DocumentDialog title="Selfie" imageUrl={kyc.selfieUrl} />
          </TableCell>
          <TableCell>{kyc.updatedAt?.toLocaleDateString()}</TableCell>
          <TableCell className={`${kyc.status === "APPROVED" ? "text-green-600" : "text-red-600"}`}>{kyc.status}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleApprove(kyc.id)}>Approve</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReject(kyc.id)}>Reject</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const DocumentDialog = ({ title, imageUrl }:any) => (
  <Dialog>
    <DialogTrigger>
      <Button variant="link">{title}</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogDescription>
        <Image src={imageUrl} alt={title} className="w-full" width={500} height={500} />
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

export default KYCVerificationCenter;