
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
import { Sparkles, LogIn, Lightbulb, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Student, InventoryItem } from "@/lib/types";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


interface AnalysisResult {
    category: 'Question' | 'Item Request' | 'Room Change Request';
    urgency: 'High' | 'Medium' | 'Low';
    summary: string;
    requestedItem?: string;
}

const urgencyVariant = (urgency?: string) => {
  switch (urgency) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low':
    default: return 'outline';
  }
};

export default function InquiryPage() {
  const [inquiryType, setInquiryType] = useState<'Question' | 'Item Request' | 'Room Change Request' | ''>('');
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [availableItems, setAvailableItems] = useState<string[]>([]);

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
            
            const invRes = await fetch('/api/inventory');
            if (!invRes.ok) throw new Error('Failed to fetch inventory');
            const inventory: InventoryItem[] = await invRes.json();

            // Log all items for debugging
            console.log("All Inventory Items:", inventory);

            // Filter for available items and set them
            const available = inventory
                .filter(item => item.status === 'In Stock' && item.category !== 'Appliance' && item.category !== 'Safety')
                .map(item => item.name);
            setAvailableItems(available);

        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Could not load initial data.", variant: "destructive"});
        }
    }
    fetchInitialData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !inquiryType) {
        toast({ title: "Missing Information", description: "You must be logged in and select an inquiry type.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              studentId: student.studentId,
              studentName: student.name,
              inquiryType,
              subject, 
              text,
              currentRoom: student.roomNumber,
            }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry.");
      }
      
      const resultData = await response.json();
      setAnalysisResult(resultData.analysis);

      toast({ title: "Success!", description: "Your inquiry has been submitted and will be reviewed by the administration." });
      setSubject("");
      setText("");
      setInquiryType('');
      setAnalysisResult(null);


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
            return "Please be specific about which item you are requesting and for how long you need it.";
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
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter a brief subject line" required />
                                </div>
                                <div>
                                    <Label htmlFor="text">{inquiryType === 'Room Change Request' ? 'Reason for Change' : 'Details'}</Label>
                                    <Textarea id="text" value={text} onChange={e => setText(e.target.value)} placeholder={getPlaceholderText()} className="min-h-[150px]" required />
                                </div>
                            </>
                        )}
                        
                        {inquiryType === 'Item Request' && (
                            <div>
                                <Label>Available Items for Request</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Browse available items..." /></SelectTrigger>
                                    <SelectContent>
                                        {availableItems.length > 0 ? availableItems.map(item => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        )) : <SelectItem value="none" disabled>No items available for request</SelectItem>}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-2">If requesting an item, please also describe your need in the details section above.</p>
                            </div>
                        )}

                        {analysisResult && (
                        <Alert>
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle>AI Analysis Complete</AlertTitle>
                            <AlertDescription className="space-y-2 mt-2">
                                <p><strong>Summary:</strong> {analysisResult.summary}</p>
                                <div className="flex flex-wrap gap-4">
                                    <span><strong>Category:</strong> <Badge>{analysisResult.category}</Badge></span>
                                    <span><strong>Urgency:</strong> <Badge variant={urgencyVariant(analysisResult.urgency)}>{analysisResult.urgency}</Badge></span>
                                    {analysisResult.requestedItem && (
                                        <span><strong>Requested Item:</strong> <Badge variant="outline">{analysisResult.requestedItem}</Badge></span>
                                    )}
                                </div>
                            </AlertDescription>
                        </Alert>
                        )}
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !subject || !text || !inquiryType}>
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
                    You can browse the "Available Items for Request" dropdown to see what's in stock. If you need something from the list, please mention it clearly in the "Details" section of the form. For example, "I would like to borrow a study lamp for my room for one week."
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger>What should I do for an urgent issue?</AccordionTrigger>
                <AccordionContent>
                    For urgent problems like a power outage, water leak, or any safety concern, please do not use this form. Instead, use the dedicated <Button asChild variant="link" className="p-0 h-auto font-semibold"><Link href="/student/complaints">Complaints Page</Link></Button> which is monitored for high-priority issues.
                </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                <AccordionTrigger>How does the AI analysis work?</AccordionTrigger>
                <AccordionContent>
                    When you submit your inquiry, our AI system reads the text to understand the subject, categorizes it as a question or request, and estimates its urgency. This helps our administrative staff quickly route your message to the right person for a faster response. Your personal data is always handled with care.
                </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}
