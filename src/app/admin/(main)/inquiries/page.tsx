
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Inquiry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, FileWarning, RefreshCw, Package } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UpdateStatusConfirmationDialog } from "@/components/modals/update-status-confirmation-modal";

const urgencyVariant = (urgency?: string) => {
  if (!urgency) return 'outline';
  switch (urgency) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
    default:
      return 'outline';
  }
};

const statusVariant = (status: string) => {
    switch (status) {
      case 'Addressed':
      case 'Dismissed':
        return 'default';
      case 'Pending':
      default:
        return 'outline';
    }
  };

const categoryVariant = (category: string) => {
    if (category === 'Item Request') return 'default';
    if (category === 'Room Change Request') return 'destructive';
    return 'secondary';
}

const ITEMS_PER_PAGE = 5;

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    inquiryId: string;
    newStatus: 'Addressed' | 'Dismissed';
  } | null>(null);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      setError("Failed to load inquiries. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const totalPages = Math.ceil(inquiries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openConfirmationModal = (inquiryId: string, newStatus: 'Addressed' | 'Dismissed') => {
    setConfirmationState({ isOpen: true, inquiryId, newStatus });
  };
  
  const handleUpdateStatus = async () => {
    if (!confirmationState) return;

    const { inquiryId, newStatus } = confirmationState;

    try {
        const response = await fetch(`/api/inquiries?id=${inquiryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update inquiry status`);
        }

        toast({
            title: "Success",
            description: `Inquiry status updated to "${newStatus}".`,
        });

        fetchInquiries();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to update inquiry status.",
            variant: "destructive",
        });
    } finally {
        setConfirmationState(null);
    }
  };
  
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Student Inquiries</CardTitle>
        <CardDescription>
          Review and manage student questions and requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/2 mt-2" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Skeleton className="h-9 w-36" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
          ))
        ) : error ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-semibold">Error Loading Inquiries</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={fetchInquiries} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
        ) : currentInquiries.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {currentInquiries.map((inquiry) => (
              <AccordionItem key={inquiry._id} value={inquiry._id} className="border p-4 rounded-lg hover:bg-card/80 transition-colors data-[state=open]:bg-secondary/50">
                <AccordionTrigger className="w-full justify-between items-start text-left py-0 hover:no-underline">
                   <div className="flex-grow space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                          <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={statusVariant(inquiry.status)}>{inquiry.status}</Badge>
                              <Badge variant={categoryVariant(inquiry.category)}>Type: {inquiry.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                              {format(new Date(inquiry.submittedAt), "PPP p")}
                          </p>
                      </div>
                      <p className="font-semibold text-primary">{inquiry.subject}</p>
                      {inquiry.requestedItem && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                              <Package className="h-4 w-4 text-primary" />
                              <span>Requested Item: <span className="font-medium text-foreground">{inquiry.requestedItem}</span></span>
                          </div>
                      )}
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="border-t pt-4">
                       <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inquiry.text || <i className="text-muted-foreground/70">No additional details provided.</i>}</p>
                       <p className="text-sm text-muted-foreground mt-4"><strong>From:</strong> {inquiry.studentName} ({inquiry.studentId})</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openConfirmationModal(inquiry._id, 'Addressed')}
                            disabled={inquiry.status === 'Addressed' || inquiry.status === 'Dismissed'}
                            >
                            Mark as Addressed
                            </Button>
                            <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => openConfirmationModal(inquiry._id, 'Dismissed')}
                                disabled={inquiry.status === 'Addressed' || inquiry.status === 'Dismissed'}
                                >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
            <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <FileWarning className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Inquiries Found</h3>
                    <p className="text-muted-foreground">There are currently no student inquiries to display.</p>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{inquiries.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, inquiries.length)}</strong> of <strong>{inquiries.length}</strong> inquiries
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || inquiries.length === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || inquiries.length === 0}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
    {confirmationState && (
        <UpdateStatusConfirmationDialog
            isOpen={confirmationState.isOpen}
            onClose={() => setConfirmationState(null)}
            onConfirm={handleUpdateStatus}
            title={`Confirm Status Change to "${confirmationState.newStatus}"`}
            description="Are you sure you want to update the status of this inquiry? This action will notify the student."
            actionLabel={confirmationState.newStatus === 'Addressed' ? 'Mark as Addressed' : 'Dismiss Inquiry'}
            isDestructive={confirmationState.newStatus === 'Dismissed'}
        />
    )}
    </>
  );
}

    
