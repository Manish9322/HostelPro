
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
import { Sparkles, HelpCircle, LogIn, Info, Lightbulb, ShieldCheck, Users, Wifi, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Complaint, Student } from "@/lib/types";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";
import Link from "next/link";

const urgencyVariant = (urgency?: string) => {
  switch (urgency) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low':
    default: return 'outline';
  }
};


export default function ComplaintPage() {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Partial<Complaint> | null>(null);
  const { toast } = useToast();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchStudent = async () => {
        const studentId = localStorage.getItem('loggedInStudentId');
        if(studentId) {
            const res = await fetch('/api/students');
            const allStudents: Student[] = await res.json();
            const currentStudent = allStudents.find(s => s.studentId === studentId);
            setStudent(currentStudent || null);
        }
    }
    fetchStudent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
        toast({ title: "Login Required", description: "You must be logged in to submit a complaint.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const aiResponse = await fetch('/api/ai/categorize-complaint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complaintSubject: subject, complaintText: text }),
      });
      if (!aiResponse.ok) throw new Error("AI analysis failed.");
      const aiData = await aiResponse.json();
      setAnalysisResult(aiData);

      const complaintData = {
          studentId: student.studentId,
          studentName: student.name,
          complaintSubject: subject,
          complaintText: text,
          ...aiData
      };
      
      const dbResponse = await fetch('/api/complaints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaintData),
      });

      if (!dbResponse.ok) throw new Error("Failed to save the complaint.");
      
      toast({ title: "Success!", description: "Your complaint has been submitted." });
      setSubject("");
      setText("");
      setAnalysisResult(null);

    } catch (err) {
      setError((err as Error).message);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <PublicHeader />
         {/* Hero Section */}
        <section className="w-full py-16 bg-secondary/50 border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
                        Have an Issue? Let Us Know.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                       Our goal is to provide a comfortable and safe living environment. Submitting a complaint helps us identify and resolve issues quickly.
                    </p>
                </div>
            </div>
        </section>

        <main className="flex-1 py-12 px-4">
           <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <div className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-primary"/>
                                        Filing an Effective Complaint
                                    </CardTitle>
                                    <CardDescription>
                                        Follow these tips for a faster resolution.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-4">
                                    <p><strong>Be Specific:</strong> Clearly state the problem. Instead of "Wi-Fi is bad," try "The Wi-Fi in Block C disconnects every 10 minutes."</p>
                                    <p><strong>Include Details:</strong> Mention the date, time, and specific location (e.g., room number, floor) of the issue.</p>
                                    <p><strong>State the Impact:</strong> Explain how the issue is affecting you (e.g., "The noise is preventing me from studying for my exams.").</p>
                                    <p><strong>Confidentiality:</strong> Your submission is confidential. We use AI to categorize the issue, but all personal details are handled securely by our staff.</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Need Assistance?
                                    </CardTitle>
                                    <CardDescription>Our team is ready to help you.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                    If you have any urgent issues or questions, you can contact the warden directly.
                                    </p>
                                    <div className="space-y-1">
                                    <p className="text-sm font-semibold">warden@hostelpro.com</p>
                                    <p className="text-sm text-muted-foreground">+1 (234) 567-8901</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                         <div className="sticky top-20">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center font-headline text-3xl">Submit a Complaint</CardTitle>
                                    <CardDescription className="text-center">Describe your issue in detail. Our AI will help categorize it for a faster response.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isClient && !student ? (
                                        <Alert>
                                            <LogIn className="h-4 w-4" />
                                            <AlertTitle>You are not logged in</AlertTitle>
                                            <AlertDescription>
                                                Please <Link href="/student/login" className="font-bold underline">log in</Link> to submit a complaint. This ensures we can track your issue and respond to you directly.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                            <Label htmlFor="complaintSubject" className="text-right">Subject</Label>
                                            <Input id="complaintSubject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Leaky Faucet in Room 201" required />
                                            </div>
                                            <div>
                                            <Label htmlFor="complaintText" className="text-right">Details</Label>
                                            <Textarea id="complaintText" value={text} onChange={e => setText(e.target.value)} placeholder="Please be as specific as possible." className="min-h-[150px]" required />
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
                                                    </div>
                                                </AlertDescription>
                                            </Alert>
                                            )}
                                            {error && <p className="text-sm text-destructive">{error}</p>}
                                            
                                            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !subject || !text}>
                                                {isLoading ? "Submitting..." : "Submit Complaint"}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
           </div>
        </main>
        {/* New Section */}
        <section className="w-full py-16 bg-secondary">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <HeartHandshake className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium text-primary tracking-widest uppercase">Our Commitment</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">More Than Just a Room</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We're dedicated to providing an environment that supports your success and well-being.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                    <h3 className="text-xl font-semibold">Your Safety, Our Priority</h3>
                    <p className="text-muted-foreground">With round-the-clock security personnel, CCTV surveillance, and secure access systems, we ensure you can focus on your studies with peace of mind.</p>
                  </div>
                  <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                    <Users className="w-12 h-12 text-primary" />
                    <h3 className="text-xl font-semibold">A Community to Belong To</h3>
                    <p className="text-muted-foreground">Join a diverse and vibrant community of students. Our common areas and regular events are perfect for making new friends and lifelong connections.</p>
                  </div>
                  <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
                    <Wifi className="w-12 h-12 text-primary" />
                    <h3 className="text-xl font-semibold">Hassle-Free Living</h3>
                    <p className="text-muted-foreground">All-inclusive amenities like high-speed Wi-Fi, laundry services, and maintenance support mean you have more time to focus on what matters most.</p>
                  </div>
                </div>
            </div>
        </section>
        <PublicFooter />
      </div>
  );
}
