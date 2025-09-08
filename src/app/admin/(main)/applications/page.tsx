
"use client";

import { useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import { mockApplications } from "@/lib/data";
import { format } from 'date-fns';
import { Application } from "@/lib/types";
import { ViewApplicationModal } from "@/components/modals/view-application-modal";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const totalPages = Math.ceil(mockApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = mockApplications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
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
            {currentApplications.map((app) => (
              <TableRow key={app.id}>
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
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem>Reject</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{startIndex + 1}-{Math.min(endIndex, mockApplications.length)}</strong> of <strong>{mockApplications.length}</strong> applications
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
    {selectedApplication && (
        <ViewApplicationModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          application={selectedApplication}
        />
    )}
    </>
  );
}
