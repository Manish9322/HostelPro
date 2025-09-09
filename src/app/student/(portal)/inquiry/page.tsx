
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, HelpCircle, LogIn, Lightbulb, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Student, InventoryItem } from "@/lib/types";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


interface AnalysisResult {
    category: 'Question' | 'Request';
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
        const studentId = localStorage.getItem('loggedInStudentId');
        if(studentId) {
            const res = await fetch('/api/students');
            const allStudents: Student[] = await res.json();
            const currentStudent = allStudents.find(s => s.studentId === studentId);
            setStudent(currentStudent || null);
        }
        
        const invRes = await fetch('/api/inventory');
        const inventory: InventoryItem[] = await invRes.json();
        const available = inventory
            .filter(item => item.status === 'In Stock' && !['Appliance', 'Safety'].includes(item.category))
            .map(item => item.name);
        setAvailableItems(available);
    }
    fetchInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
        toast({ title: "Login Required", description: "You must be logged in to submit an inquiry.", variant: "destructive"});
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
              subject: subject, 
              text: text 
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

    } catch (err) {
      setError((err as Error).message);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Inquiry & Request Form</CardTitle>
                <CardDescription>Ask a general question or request an available item from the hostel inventory.</CardDescription>
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
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Question about guest policy" required />
                        </div>
                        <div>
                            <Label htmlFor="text">Details</Label>
                            <Textarea id="text" value={text} onChange={e => setText(e.target.value)} placeholder="Please be as specific as possible. If you are requesting an item, mention it here." className="min-h-[150px]" required />
                        </div>
                        <div>
                            <Label>Available Items for Request (Optional)</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Browse available items..." /></SelectTrigger>
                                <SelectContent>
                                    {availableItems.length > 0 ? availableItems.map(item => (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    )) : <SelectItem value="none" disabled>No items available</SelectItem>}
                                </SelectContent>
                            </Select>
                             <p className="text-xs text-muted-foreground mt-2">If requesting an item, please also describe your need in the details section above.</p>
                        </div>

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
                        
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !subject || !text}>
                            {isLoading ? "Submitting..." : "Submit Inquiry"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                Find quick answers to common questions about inquiries and requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is this form for?</AccordionTrigger>
                        <AccordionContent>
                        This form is for general, non-urgent questions (e.g., "What are the gym hours?") and for requesting to borrow available hostel items (like a study lamp or board games).
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What should I do for an urgent issue?</AccordionTrigger>
                        <AccordionContent>
                         For urgent matters like a broken faucet, power outage, or safety concerns, please use the dedicated <Button asChild variant="link" className="p-0 h-auto"><Link href="/student/complaints">Complaints Page</Link></Button>. This ensures your issue is prioritized and addressed quickly by the correct team.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>How does the AI assistant work?</AccordionTrigger>
                        <AccordionContent>
                        Our AI system reads your inquiry to understand its nature. It identifies whether you're asking a question or making a request, summarizes the key point, and forwards it to the administration. This helps us process your messages more efficiently.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>How long does it take to get a response?</AccordionTrigger>
                        <AccordionContent>
                         We aim to respond to all inquiries and requests within 1-2 business days. If you have requested an item, we will let you know when and where you can collect it.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
