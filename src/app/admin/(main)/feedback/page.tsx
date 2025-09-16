
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
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle, RefreshCw, FileWarning, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useGetFeedbackQuery, useDeleteFeedbackMutation } from "@/store/api";

const ITEMS_PER_PAGE = 7;

export default function FeedbackPage() {
  const { data: feedbackList = [], error, isLoading, refetch } = useGetFeedbackQuery();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(feedbackList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFeedback = feedbackList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenDeleteModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFeedback) return;
    try {
        await deleteFeedback(selectedFeedback._id).unwrap();
        toast({ title: "Success", description: "Feedback deleted successfully." });
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete feedback.", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            Review and manage feedback submitted by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                  ))
              ) : error ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <AlertTriangle className="h-12 w-12 text-destructive" />
                                <h3 className="text-xl font-semibold">Error Loading Feedback</h3>
                                <p className="text-muted-foreground">Failed to load feedback. Please try again.</p>
                                <Button onClick={() => refetch()} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
              ) : currentFeedback.length > 0 ? (
                currentFeedback.map((feedback) => (
                  <TableRow key={feedback._id}>
                    <TableCell>
                      <p className="font-medium">{feedback.name}</p>
                      <p className="text-xs text-muted-foreground">{feedback.email}</p>
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate">{feedback.message}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(feedback.createdAt), 'PPP')}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(feedback)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <FileWarning className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Feedback Found</h3>
                            <p className="text-muted-foreground">There is no user feedback to display yet.</p>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{feedbackList.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, feedbackList.length)}</strong> of <strong>{feedbackList.length}</strong> entries
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || feedbackList.length === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || feedbackList.length === 0}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={`feedback from ${selectedFeedback?.name}`}
      />
    </>
  );
}
