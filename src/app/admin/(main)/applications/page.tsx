
"use client";

import { useState, useMemo } from "react";
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
import { MoreHorizontal, AlertTriangle, FileWarning, RefreshCw, Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from 'date-fns';
import { Application } from "@/lib/types";
import { ViewApplicationModal } from "@/components/modals/view-application-modal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from "@/store/api";

const statusVariant = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const ITEMS_PER_PAGE = 7;

export default function ApplicationsPage() {
  const { data: allApplications = [], error, isLoading, refetch } = useGetApplicationsQuery();
  const [updateStatus] = useUpdateApplicationStatusMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredApplications = useMemo(() => {
      return allApplications
        .filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  app.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (app.studentId && app.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
  }, [allApplications, searchQuery, statusFilter]);
  
  const stats = useMemo(() => {
    return {
        total: allApplications.length,
        pending: allApplications.filter(app => app.status === 'Pending').length,
        approved: allApplications.filter(app => app.status === 'Approved').length,
    }
  }, [allApplications]);


  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
  };
  
  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
        await updateStatus({ id, status }).unwrap();
        toast({
            title: "Success",
            description: `Application has been ${status.toLowerCase()}.`,
        });

        if(selectedApplication && selectedApplication._id === id) {
            setSelectedApplication(prev => prev ? { ...prev, status } : null);
        }

    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to update application status.",
            variant: "destructive",
        });
    }
  };

  return (
    <>
    <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total applications received</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.approved}</div>
                <p className="text-xs text-muted-foreground">Accepted into the hostel</p>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Manage student hostel applications.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, course, or ID..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                        <h3 className="text-xl font-semibold">Error Loading Applications</h3>
                        <p className="text-muted-foreground">Failed to load applications. Please try again.</p>
                        <Button onClick={() => refetch()} variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentApplications.length > 0 ? (
                  currentApplications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{app.course}</TableCell>
                      <TableCell>{format(new Date(app.submittedAt), 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
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
                            <DropdownMenuItem onClick={() => handleViewApplication(app)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'Approved')} disabled={app.status === 'Approved'}>Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'Rejected')} disabled={app.status === 'Rejected'}>Reject</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16">
                         <div className="flex flex-col items-center gap-4">
                            <FileWarning className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Applications Found</h3>
                            <p className="text-muted-foreground">There are currently no applications matching your criteria.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredApplications.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredApplications.length)}</strong> of <strong>{filteredApplications.length}</strong> applications
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || filteredApplications.length === 0}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || filteredApplications.length === 0}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
    </div>
    {selectedApplication && (
        <ViewApplicationModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          application={selectedApplication}
          onUpdateStatus={handleUpdateStatus}
        />
    )}
    </>
  );
}
