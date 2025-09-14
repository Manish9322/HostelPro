
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search, FileText, CircleDollarSign, CheckCircle, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { FeePaymentModal } from "@/components/modals/fee-payment-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { FeePayment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusVariant = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

const ITEMS_PER_PAGE = 7;

export default function FeesPage() {
  const [allPayments, setAllPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/fees');
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setAllPayments(data);
    } catch (error) {
      setError("Failed to load fee payments. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = allPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingFees = allPayments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
  
  const filteredPayments = useMemo(() => {
      return allPayments
        .filter(p => {
            const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.studentId.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
  }, [allPayments, searchQuery, statusFilter]);

  
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (payment: FeePayment | null = null) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };
  
  const handleOpenDeleteModal = (payment: FeePayment) => {
    setSelectedPayment(payment);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (paymentData: Omit<FeePayment, '_id' | 'id'>) => {
    const method = selectedPayment ? 'PUT' : 'POST';
    const url = selectedPayment ? `/api/fees?id=${selectedPayment._id}` : '/api/fees';
    
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        if (!response.ok) throw new Error(`Failed to ${selectedPayment ? 'update' : 'log'} payment`);
        
        toast({ title: "Success", description: `Payment ${selectedPayment ? 'updated' : 'logged'} successfully.` });
        fetchPayments();
        setModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: `Failed to ${selectedPayment ? 'update' : 'log'} payment.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;
    try {
        const response = await fetch(`/api/fees?id=${selectedPayment._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete payment');
        
        toast({ title: "Success", description: "Payment record deleted successfully." });
        fetchPayments();
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete payment record.", variant: "destructive" });
    }
  };
  
  return (
    <>
      <div className="grid gap-8">
          <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (This Term)</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total fees collected so far</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{outstandingFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total overdue payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clearance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allPayments.length > 0 ? 
                 `${Math.round(allPayments.filter(p => p.status === 'Paid').length / allPayments.length * 100)}%`
                 : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">of payments are on time</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
              <div>
                <CardTitle>Fee Management</CardTitle>
                <CardDescription>
                  Track student payments, send reminders, and manage financial records.
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by student or ID..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Log Payment
                        </span>
                    </Button>
                </div>
              </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Billing Month</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                            <h3 className="text-xl font-semibold">Error Loading Payments</h3>
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchPayments} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                ) : currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium">{payment.studentName}</TableCell>
                      <TableCell>{payment.studentId}</TableCell>
                      <TableCell>{payment.month}</TableCell>
                      <TableCell>{format(new Date(payment.dueDate), 'PPP')}</TableCell>
                      <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(payment.status)}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenModal(payment)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteModal(payment)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <FileWarning className="h-12 w-12 text-muted-foreground" />
                                <h3 className="text-xl font-semibold">No Payments Found</h3>
                                <p className="text-muted-foreground">Log a new payment or adjust your filters.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter>
              <div className="text-xs text-muted-foreground">
                  Showing <strong>{filteredPayments.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredPayments.length)}</strong> of <strong>{filteredPayments.length}</strong> payments
              </div>
              <div className="ml-auto flex items-center gap-2">
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || filteredPayments.length === 0}
                  >
                      Previous
                  </Button>
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || filteredPayments.length === 0}
                  >
                      Next
                  </Button>
              </div>
          </CardFooter>
        </Card>
      </div>

      <FeePaymentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        payment={selectedPayment}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={`payment for ${selectedPayment?.studentName}`}
      />
    </>
  );
}
