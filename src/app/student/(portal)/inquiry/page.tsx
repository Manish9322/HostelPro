
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
import { Sparkles, HelpCircle, LogIn, Lightbulb, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Student, InventoryItem } from "@/lib/types";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
           <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 pt-8">
                        <div className="space-y-8">
                            <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-primary"/>
                                        How This Works
                                    </CardTitle>
                                    <CardDescription>
                                        Our AI assistant helps categorize your message.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground">General Question</h4>
                                        <p>If you ask a general question (e.g., about guest policies), our system will log it for the admin team to review and answer.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Item Request</h4>
                                        <p>If you request an available item (like a study lamp), the AI will identify the item and forward your request to the administration for approval.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Available Items List</h4>
                                        <p>The dropdown list shows items currently available for borrowing. Critical items like fire extinguishers or major appliances are not listed here.</p>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="w-5 h-5" />
                                    Urgent Issues
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                    For urgent issues like maintenance (e.g., broken faucet) or safety concerns, please use the dedicated complaints page for a faster, prioritized response.
                                    </p>
                                    <Button variant="destructive" className="w-full" asChild>
                                        <Link href="/student/complaints">Go to Complaints Page</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center font-headline text-3xl">Inquiry & Request Form</CardTitle>
                                <CardDescription className="text-center">Ask a general question or request an available item from the hostel inventory.</CardDescription>
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
                                            <Label htmlFor="subject" className="text-right">Subject</Label>
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
                    </div>
                </div>
           </div>
        </main>
      </div>
  );
}
