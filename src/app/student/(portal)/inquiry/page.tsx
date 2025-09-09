
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, Lightbulb, PackageSearch } from "lucide-react";
import type { Student, InventoryItem } from "@/lib/types";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export default function InquiryPage() {
  const [inquiryType, setInquiryType] = useState<'Question' | 'Item Request' | 'Room Change Request' | ''>('');
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchInitialData = async () => {
        try {
            const studentId = localStorage.getItem('loggedInStudentId');
            if(studentId) {
                const res = await fetch('/api/students');
                const allStudents: Student[] = await res.json();
                const currentStudent = allStudents.find(s => s.studentId === studentId);
                setStudent(currentStudent || null);
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Could not load your profile.", variant: "destructive"});
        }
    }
    fetchInitialData();
  }, [toast]);
  
  useEffect(() => {
      if(inquiryType === 'Item Request') {
          const fetchInventory = async () => {
              setLoadingInventory(true);
              try {
                  const res = await fetch('/api/inventory');
                  if(!res.ok) throw new Error("Could not fetch inventory.");
                  const allItems: InventoryItem[] = await res.json();
                  setAvailableItems(allItems.filter(item => item.status === 'In Stock'));
              } catch(err) {
                  toast({ title: "Error", description: "Could not load available items.", variant: "destructive"});
              } finally {
                  setLoadingInventory(false);
              }
          }
          fetchInventory();
      }
  }, [inquiryType, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !inquiryType) {
        toast({ title: "Missing Information", description: "You must be logged in and select an inquiry type.", variant: "destructive"});
        return;
    }
    if (inquiryType === 'Item Request' && !selectedItem) {
        toast({ title: "Missing Information", description: "Please select an item to request.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setError(null);

    const requestBody = { 
        studentId: student.studentId,
        studentName: student.name,
        inquiryType,
        subject, 
        text,
        requestedItem: inquiryType === 'Item Request' ? selectedItem : undefined,
      };

    try {
      const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry.");
      }
      
      toast({ title: "Success!", description: "Your inquiry has been submitted and will be reviewed by the administration." });
      setSubject("");
      setText("");
      setInquiryType('');
      setSelectedItem('');

    } catch (err) {
      setError((err as Error).message);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlaceholderText = () => {
    switch (inquiryType) {
        case 'Item Request':
            return "Provide any additional details about your request. For example, why you need the item or for how long.";
        case 'Room Change Request':
            return "Please provide a detailed reason for your room change request. Include any relevant details about your current situation.";
        case 'Question':
            return "Please type your question here.";
        default:
            return "Please select an inquiry type first.";
    }
  }


  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Inquiry & Request Form</CardTitle>
                <CardDescription>Ask a general question, request an available item, or submit a request to change rooms.</CardDescription>
            </CardHeader>
            <CardContent>
                {isClient && !student ? (
                    <Alert>
                        <LogIn className="h-4 w-4" />
                        <AlertTitle>You are not logged in</AlertTitle>
                        <AlertDescription>
                            Please <Link href="/student/login" className="font-bold underline">log in</Link> to use this form.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                            <Label htmlFor="inquiryType">Inquiry Type</Label>
                            <Select value={inquiryType} onValueChange={(value) => setInquiryType(value as any)} required>
                                <SelectTrigger id="inquiryType"><SelectValue placeholder="Select the type of your inquiry..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Question">General Question</SelectItem>
                                    <SelectItem value="Item Request">Item Request</SelectItem>
                                    <SelectItem value="Room Change Request">Room Change Request</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {inquiryType && (
                            <>
                                {inquiryType === 'Item Request' && (
                                    <div>
                                        <Label htmlFor="itemRequest">Available Item</Label>
                                        {loadingInventory ? (
                                            <Skeleton className="h-10 w-full" />
                                        ) : (
                                            <Select value={selectedItem} onValueChange={setSelectedItem} required>
                                                <SelectTrigger id="itemRequest">
                                                    <SelectValue placeholder="Select an item to request..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableItems.length > 0 ? (
                                                        availableItems.map(item => (
                                                            <SelectItem key={item._id} value={item.name}>
                                                                {item.name} ({item.category})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                                            No items are currently in stock.
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter a brief subject line" required />
                                </div>
                                <div>
                                    <Label htmlFor="text">{inquiryType === 'Room Change Request' ? 'Reason for Change' : (inquiryType === 'Item Request' ? 'Additional Details (Optional)' : 'Details')}</Label>
                                    <Textarea id="text" value={text} onChange={e => setText(e.target.value)} placeholder={getPlaceholderText()} className="min-h-[150px]" required={inquiryType !== 'Item Request'} />
                                </div>
                            </>
                        )}
                        
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !inquiryType || !subject || (inquiryType !== 'Item Request' && !text)}>
                            {isLoading ? "Submitting..." : "Submit Inquiry"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
        
        <Separator/>

        <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                <AccordionItem value="item-1">
                <AccordionTrigger>What kind of questions can I ask here?</AccordionTrigger>
                <AccordionContent>
                    This form is for general, non-urgent questions about hostel life. Examples include asking about gym hours, upcoming events, guest policies, or clarifying a notice.
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                <AccordionTrigger>How do I request an item?</AccordionTrigger>
                <AccordionContent>
                    You can request items available in the dropdown list, which are currently in stock. Please note that availability is not guaranteed and requests are processed based on need and order.
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger>What should I do for an urgent issue?</AccordionTrigger>
                <AccordionContent>
                    For urgent problems like a power outage, water leak, or any safety concern, please do not use this form. Instead, use the dedicated <Button asChild variant="link" className="p-0 h-auto font-semibold"><Link href="/student/complaints">Complaints Page</Link></Button> which is monitored for high-priority issues.
                </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}

    