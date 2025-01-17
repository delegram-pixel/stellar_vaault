"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { Certificate } from "@prisma/client"; // Adjust the import based on your actual type
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { getAllCert, handleCertApprove, handleCertNotApprove } from "@/lib/queries";

const CertificateVerificationCenter = () => {
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCertificates = async () => {
      const certificates = await getAllCert();
      setAllCertificates(certificates);
    };
    fetchCertificates();
  }, []);

  const filteredCertificates = allCertificates.filter((certificate) => {
    if (activeTab === "all") return true;
    if (activeTab === "approved") return certificate.status === "VERIFIED";
    if (activeTab === "rejected") return certificate.status === "REJECTED";
    if (activeTab === "pending") return certificate.status === "PENDING";
    return false;
  });

  const handleApprove = async (id: string) => {
    try {
      await handleCertApprove(id);
      const updatedCertificates = await getAllCert();
      setAllCertificates(updatedCertificates);
      toast({
        title: "Approved",
        description: "Certificate Approval Successful",
      });
    } catch (error) {
      console.error("Error approving Certificate:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not approve Certificate",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await handleCertNotApprove(id);
      const updatedCertificates = await getAllCert();
      setAllCertificates(updatedCertificates);
      toast({
        title: "Success!",
        description: "Certificate Rejection Successful",
      });
    } catch (error) {
      console.error("Error rejecting Certificate:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not reject Certificate",
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
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CertificateTable 
            certificateData={filteredCertificates} 
            handleApprove={handleApprove} 
            handleReject={handleReject} 
          />
        </TabsContent>
        <TabsContent value="approved">
          <CertificateTable 
            certificateData={filteredCertificates} 
            handleApprove={handleApprove} 
            handleReject={handleReject} 
          />
        </TabsContent>
        <TabsContent value="pending">
          <CertificateTable 
            certificateData={filteredCertificates} 
            handleApprove={handleApprove} 
            handleReject={handleReject} 
          />
        </TabsContent>
        <TabsContent value="rejected">
          <CertificateTable 
            certificateData={filteredCertificates} 
            handleApprove={handleApprove} 
            handleReject={handleReject} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CertificateTable = ({ 
  certificateData, 
  handleApprove, 
  handleReject 
}: {
  certificateData: Certificate[], 
  handleApprove: (id: string) => Promise<void>, 
  handleReject: (id: string) => Promise<void>
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableCell>User</TableCell>
        <TableCell>Document</TableCell>
        <TableCell>Submitted At</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {certificateData.map((certificate) => (
        <TableRow key={certificate.id}>
          <TableCell>{certificate.userId}</TableCell>
          <TableCell>
            <DocumentDialog 
              title="Certificate" 
              imageUrl={certificate.imageUrl} 
            />
          </TableCell>
          <TableCell>{certificate.createdAt?.toLocaleDateString()}</TableCell>
          <TableCell 
            className={`
              ${certificate.status === "VERIFIED" ? "text-green-600" : 
                certificate.status === "REJECTED" ? "text-red-600" : 
                "text-yellow-600"
              }
            `}
          >
            {certificate.status}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleApprove(certificate.id)}>
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReject(certificate.id)}>
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const DocumentDialog = ({ 
  title, 
  imageUrl 
}: { 
  title: string, 
  imageUrl: string 
}) => (
  <Dialog>
    <DialogTrigger>
      <Button variant="link">{title}</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogDescription>
        <Image 
          src={imageUrl} 
          alt={title} 
          className="w-full" 
          width={500} 
          height={500} 
          objectFit="contain"
        />
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

export default CertificateVerificationCenter;