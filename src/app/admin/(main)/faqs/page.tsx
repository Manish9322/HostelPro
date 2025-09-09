
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { useToast } from "@/hooks/use-toast";
import { Faq } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FaqModal } from "@/components/modals/faq-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { Switch } from "@/components/ui/switch";


export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const { toast } = useToast();

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/faqs');
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      setError("Failed to load FAQs. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq: Faq | null = null) => {
    setSelectedFaq(faq);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (faq: Faq) => {
    setSelectedFaq(faq);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (faqData: Omit<Faq, '_id' | 'order'>) => {
    const method = selectedFaq ? 'PUT' : 'POST';
    const url = selectedFaq ? `/api/faqs?id=${selectedFaq._id}` : '/api/faqs';
    
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faqData),
        });
        if (!response.ok) throw new Error(`Failed to ${selectedFaq ? 'update' : 'create'} FAQ`);
        
        toast({ title: "Success", description: `FAQ ${selectedFaq ? 'updated' : 'created'} successfully.` });
        fetchFaqs();
        setModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: `Failed to ${selectedFaq ? 'update' : 'create'} FAQ.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedFaq) return;
    try {
        const response = await fetch(`/api/faqs?id=${selectedFaq._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete FAQ');
        
        toast({ title: "Success", description: "FAQ deleted successfully." });
        fetchFaqs();
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete FAQ.", variant: "destructive" });
    }
  };
  
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    const item = newFaqs[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (swapIndex < 0 || swapIndex >= newFaqs.length) return;

    newFaqs.splice(index, 1);
    newFaqs.splice(swapIndex, 0, item);
    
    const originalFaqs = [...faqs];
    setFaqs(newFaqs); // Optimistic update

    try {
        const response = await fetch('/api/faqs/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: newFaqs.map(n => n._id) }),
        });
        if (!response.ok) throw new Error('Failed to reorder FAQs');
        toast({ title: "Success", description: "FAQ order updated." });
    } catch (error) {
        setFaqs(originalFaqs); // Revert on failure
        toast({ title: "Error", description: "Failed to reorder FAQs.", variant: "destructive" });
    }
  };

  const handleVisibilityChange = async (faq: Faq, newVisibility: boolean) => {
    const originalFaqs = [...faqs];
    setFaqs(faqs.map(f => f._id === faq._id ? {...f, visible: newVisibility} : f)); // Optimistic update
    
    try {
        const response = await fetch(`/api/faqs?id=${faq._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visible: newVisibility }),
        });
        if (!response.ok) throw new Error('Failed to update visibility');
        toast({ title: "Success", description: `FAQ visibility updated.` });
    } catch (error) {
        setFaqs(originalFaqs);
        toast({ title: "Error", description: "Failed to update visibility.", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>FAQ Management</CardTitle>
            <CardDescription>
              Create, edit, and manage frequently asked questions for the public homepage.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New FAQ
            </span>
          </Button>
        </CardHeader>
        <CardContent>
             {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                        <h3 className="text-xl font-semibold">Error Loading FAQs</h3>
                        <p className="text-muted-foreground">{error}</p>
                        <Button onClick={fetchFaqs} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    </div>
                </div>
              ) : faqs.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Order</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead className="w-[120px]">Visible</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {faqs.map((faq, index) => (
                            <TableRow key={faq._id}>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === faqs.length - 1}>
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{faq.question}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={faq.visible}
                                        onCheckedChange={(checked) => handleVisibilityChange(faq, checked)}
                                    />
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
                                        <DropdownMenuItem onClick={() => handleOpenModal(faq)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenDeleteModal(faq)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
                <div className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <FileWarning className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No FAQs Found</h3>
                        <p className="text-muted-foreground">Create a new FAQ to get started.</p>
                        <Button onClick={() => handleOpenModal()}>Create New FAQ</Button>
                    </div>
                </div>
              )}
        </CardContent>
      </Card>
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        faq={selectedFaq}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedFaq ? `the FAQ "${selectedFaq.question}"` : ''}
      />
    </>
  );
}
