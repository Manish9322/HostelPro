
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
import { Complaint } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const urgencyVariant = (urgency: string) => {
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
      case 'Resolved':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Pending':
      default:
        return 'outline';
    }
  };

const ITEMS_PER_PAGE = 4;

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaints');
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load complaints.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentComplaints = complaints.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'In Progress' | 'Resolved') => {
    try {
        const response = await fetch(`/api/complaints?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update complaint status`);
        }

        toast({
            title: "Success",
            description: `Complaint status updated to "${status}".`,
        });

        fetchComplaints();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to update complaint status.",
            variant: "destructive",
        });
    }
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Complaint Inbox</CardTitle>
                <CardDescription>Loading complaints...</CardDescription>
            </CardHeader>
            <CardContent><p>Please wait while we fetch the records.</p></CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Inbox</CardTitle>
        <CardDescription>
          Review and manage student complaints. Complaints are automatically categorized by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentComplaints.map((complaint) => (
          <div key={complaint._id} className="border p-4 rounded-lg hover:bg-card/80 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={urgencyVariant(complaint.urgency)}>Urgency: {complaint.urgency}</Badge>
                <Badge variant="outline">Category: {complaint.category}</Badge>
                <Badge variant={statusVariant(complaint.status)}>{complaint.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                {format(new Date(complaint.submittedAt), "PPP p")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-primary">{complaint.summary}</p>
              <p className="text-muted-foreground mt-1 text-sm">{complaint.complaintText}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleUpdateStatus(complaint._id, 'In Progress')}
                disabled={complaint.status === 'In Progress' || complaint.status === 'Resolved'}
              >
                Mark as In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleUpdateStatus(complaint._id, 'Resolved')}
                disabled={complaint.status === 'Resolved'}
              >
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{startIndex + 1}-{Math.min(endIndex, complaints.length)}</strong> of <strong>{complaints.length}</strong> complaints
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

