"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getAllKycId, handleApproved, handleNotApproved } from "@/lib/queries";
import { KYCVerification } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const KYCVerificationById = ({ userId }: { userId: string }) => {
  const [kycData, setKycData] = useState<KYCVerification | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKycData = async () => {
      const kyc = await getAllKycId(userId);
      setKycData(kyc);
    };
    fetchKycData();
  }, [userId]);

  const handleApprove = async () => {
    if (!kycData) return;
    try {
      await handleApproved(kycData.id);
      const updatedKyc = await getAllKycId(userId);
      setKycData(updatedKyc);
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

  const handleReject = async () => {
    if (!kycData) return;
    try {
      await handleNotApproved(kycData.id);
      const updatedKyc = await getAllKycId(userId);
      setKycData(updatedKyc);
      toast({
        title: "Rejected",
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

  if (!kycData) {
    return <div>Loading KYC data...</div>;
  }

  const renderDocumentLink = (url: string | null, label: string) => {
    if (url) {
      return (
        <Button variant="link">
          <Link href={url}>{label}</Link>
        </Button>
      );
    }
    return <span>{label} not available</span>;
  };

  return (
    <div className="mt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">KYC Verification for User ID: {userId}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Postal Code</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Documents</TableCell>
            <TableCell>Submitted At</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{kycData.fullName}</TableCell>
            <TableCell>{kycData.postalCode}</TableCell>
            <TableCell>{kycData.country}</TableCell>
            <TableCell>
              {renderDocumentLink(kycData.idFrontUrl, "ID Front")}
              {renderDocumentLink(kycData.idBackUrl, "ID Back")}
              {renderDocumentLink(kycData.selfieUrl, "Selfie")}
            </TableCell>
            <TableCell>{kycData.updatedAt?.toLocaleDateString()}</TableCell>
            <TableCell>{kycData.status}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4 space-x-2">
        <Button onClick={handleApprove} disabled={kycData.status === 'APPROVED'}>
          Approve
        </Button>
        <Button onClick={handleReject} disabled={kycData.status === 'REJECTED'}>
          Reject
        </Button>
      </div>
    </div>
  );
};

export default KYCVerificationById;