
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Complaint } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, FileWarning, RefreshCw, MessageSquareWarning, Clock, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetComplaintsQuery, useUpdateComplaintStatusMutation } from "@/store/api";

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
  const { data: allComplaints = [], error, isLoading, refetch } = useGetComplaintsQuery();
  const [updateStatus] = useUpdateComplaintStatusMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const stats = useMemo(() => {
    return {
        total: allComplaints.length,
        pending: allComplaints.filter(c => c.status === 'Pending').length,
        highUrgency: allComplaints.filter(c => c.urgency === 'High' && c.status !== 'Resolved').length,
    }
  }, [allComplaints]);

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter(c => 
        (statusFilter === 'all' || c.status === statusFilter) &&
        (categoryFilter === 'all' || c.category === categoryFilter) &&
        (urgencyFilter === 'all' || c.urgency === urgencyFilter)
    );
  }, [allComplaints, statusFilter, categoryFilter, urgencyFilter]);

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'In Progress' | 'Resolved') => {
    try {
        await updateStatus({ id, status }).unwrap();
        toast({
            title: "Success",
            description: `Complaint status updated to "${status}".`,
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to update complaint status.",
            variant: "destructive",
        });
    }
  };
  
  return (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All-time received complaints</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Resolution</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Complaints awaiting action</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Urgency Open</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.highUrgency}</div>
                <p className="text-xs text-muted-foreground">Urgent issues needing immediate attention</p>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Complaint Inbox</CardTitle>
            <CardDescription>
              Review and manage student complaints. Complaints are automatically categorized by AI.
            </CardDescription>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Noise">Noise</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Harassment">Harassment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by urgency" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Urgencies</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="border p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-28 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
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
                    <h3 className="text-xl font-semibold">Error Loading Complaints</h3>
                    <p className="text-muted-foreground">Failed to load complaints. Please try again.</p>
                    <Button onClick={() => refetch()} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
            ) : currentComplaints.length > 0 ? (
              currentComplaints.map((complaint) => (
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
              ))
            ) : (
                <div className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <FileWarning className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Complaints Found</h3>
                        <p className="text-muted-foreground">There are currently no complaints matching your filters.</p>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredComplaints.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredComplaints.length)}</strong> of <strong>{filteredComplaints.length}</strong> complaints
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || filteredComplaints.length === 0}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || filteredComplaints.length === 0}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
    </div>
  );
}
