
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
import { MoreHorizontal, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { Application } from "@/lib/types";
import { ViewApplicationModal } from "@/components/modals/view-application-modal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
       setError("Failed to load applications. Please try again.");
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applications.slice(startIndex, endIndex);

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
        const response = await fetch(`/api/applications?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update application status`);
        }

        toast({
            title: "Success",
            description: `Application has been ${status.toLowerCase()}.`,
        });

        fetchApplications();
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
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Manage student hostel applications.
        </CardDescription>
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
            {loading ? (
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
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={fetchApplications} variant="outline">
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
                        <p className="text-muted-foreground">There are currently no applications to display.</p>
                    </div>
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{applications.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, applications.length)}</strong> of <strong>{applications.length}</strong> applications
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || applications.length === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || applications.length === 0}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
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
