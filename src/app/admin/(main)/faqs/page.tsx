
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw, ArrowUp, ArrowDown, Pen, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Faq } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaqModal } from "@/components/modals/faq-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";

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
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqs.map((faq, index) => (
                        <Card key={faq._id} className="overflow-hidden">
                             <AccordionItem value={faq._id} className="border-b-0">
                                <div className="flex items-center p-2">
                                     <AccordionTrigger className="flex-grow px-4 py-2 hover:no-underline font-semibold">
                                        {faq.question}
                                     </AccordionTrigger>
                                     <div className="flex gap-1 pr-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === faqs.length - 1}>
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(faq)}>
                                            <Pen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(faq)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                             </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
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
