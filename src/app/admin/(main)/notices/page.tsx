
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { format } from 'date-fns';
import { NoticeModal } from "@/components/modals/notice-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { Notice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 7;

export default function NoticesAdminPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/notices');
      if (!response.ok) throw new Error("Failed to fetch notices");
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      setError("Failed to load notices. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);


  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = notices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (notice: Notice | null = null) => {
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (noticeData: Omit<Notice, '_id' | 'id' | 'publishedAt'>) => {
    const method = selectedNotice ? 'PUT' : 'POST';
    const url = selectedNotice ? `/api/notices?id=${selectedNotice._id}` : '/api/notices';
    
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noticeData),
        });
        if (!response.ok) throw new Error(`Failed to ${selectedNotice ? 'update' : 'post'} notice`);
        
        toast({ title: "Success", description: `Notice ${selectedNotice ? 'updated' : 'posted'} successfully.` });
        fetchNotices();
        setModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: `Failed to ${selectedNotice ? 'update' : 'post'} notice.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedNotice) return;
    try {
        const response = await fetch(`/api/notices?id=${selectedNotice._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete notice');
        
        toast({ title: "Success", description: "Notice deleted successfully." });
        fetchNotices();
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete notice.", variant: "destructive" });
    }
  };
  
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newNotices = [...notices];
    const item = newNotices[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (swapIndex < 0 || swapIndex >= newNotices.length) return;

    newNotices.splice(index, 1);
    newNotices.splice(swapIndex, 0, item);
    
    const originalNotices = [...notices];
    setNotices(newNotices); // Optimistic update

    try {
        const response = await fetch('/api/notices/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: newNotices.map(n => n._id) }),
        });
        if (!response.ok) throw new Error('Failed to reorder notices');
        toast({ title: "Success", description: "Notice order updated." });
    } catch (error) {
        setNotices(originalNotices); // Revert on failure
        toast({ title: "Error", description: "Failed to reorder notices.", variant: "destructive" });
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notice Management</CardTitle>
            <CardDescription>
              Create, edit, and manage public notices.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Notice
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
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
                            <h3 className="text-xl font-semibold">Error Loading Notices</h3>
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchNotices} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
              ) : currentNotices.length > 0 ? (
                currentNotices.map((notice, index) => {
                  const globalIndex = startIndex + index;
                  return (
                  <TableRow key={notice._id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleMove(globalIndex, 'up')} disabled={globalIndex === 0}>
                           <ArrowUp className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleMove(globalIndex, 'down')} disabled={globalIndex === notices.length - 1}>
                           <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell>{notice.author}</TableCell>
                    <TableCell>{format(new Date(notice.publishedAt), 'PPP')}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenModal(notice)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeleteModal(notice)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  )
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <FileWarning className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Notices Found</h3>
                            <p className="text-muted-foreground">Create a new notice to get started.</p>
                            <Button onClick={() => handleOpenModal()}>Create New Notice</Button>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{notices.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, notices.length)}</strong> of <strong>{notices.length}</strong> notices
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || notices.length === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || notices.length === 0}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        notice={selectedNotice}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedNotice ? (selectedNotice as any).title : ''}
      />
    </>
  );
}
