
"use client";

import PublicHeader from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState, useFormStatus } from "react-dom";
import { submitComplaint, type ComplaintState } from "@/lib/actions";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { GanttChartSquare, Sparkles, ShieldCheck, AlertTriangle, PhoneOutgoing, ListChecks, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={pending}>
      {pending ? "Submitting..." : "Submit Complaint"}
    </Button>
  );
}

const urgencyVariant = (urgency?: string) => {
  switch (urgency) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
    default:
      return 'outline';
  }
};


export default function ComplaintPage() {
  const initialState: ComplaintState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(submitComplaint, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
    }
  }, [state, toast]);


  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="sticky top-20">
                <Card>
                  <form ref={formRef} action={dispatch}>
                    <CardHeader>
                      <CardTitle className="font-headline text-3xl">Submit a Complaint</CardTitle>
                      <CardDescription>
                        Your feedback is important. Please describe your issue in detail. All submissions are treated with confidentiality.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="complaintSubject">Subject</Label>
                          <Input
                            id="complaintSubject"
                            name="complaintSubject"
                            placeholder="e.g., Leaky Faucet in Room 201"
                            className="mt-1"
                            required
                          />
                          {state.errors?.complaintSubject &&
                            state.errors.complaintSubject.map((error: string) => (
                              <p className="text-sm font-medium text-destructive pt-1" key={error}>
                                {error}
                              </p>
                          ))}
                        </div>
                        <div>
                          <Label htmlFor="complaintText">Complaint Details</Label>
                          <Textarea
                            id="complaintText"
                            name="complaintText"
                            placeholder="Please describe your complaint here. The more detail, the better our AI can understand and categorize your issue."
                            className="min-h-[200px] text-base mt-1"
                            required
                          />
                          {state.errors?.complaintText &&
                            state.errors.complaintText.map((error: string) => (
                              <p className="text-sm font-medium text-destructive pt-1" key={error}>
                                {error}
                              </p>
                          ))}
                        </div>

                        {state.data && (
                          <Alert className="mt-4 w-full">
                              <Sparkles className="h-4 w-4" />
                              <AlertTitle>AI Analysis Complete</AlertTitle>
                              <AlertDescription className="space-y-2 mt-2">
                                  <p><strong>Summary:</strong> {state.data.summary}</p>
                                  <div className="flex flex-wrap gap-4">
                                      <span><strong>Category:</strong> <Badge>{state.data.category}</Badge></span>
                                      <span><strong>Urgency:</strong> <Badge variant={urgencyVariant(state.data.urgency)}>{state.data.urgency}</Badge></span>
                                  </div>
                              </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <SubmitButton />
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-8">
                <Card className="border-destructive/50">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-destructive">
                       <AlertTriangle className="w-6 h-6" />
                       Is It an Emergency?
                     </CardTitle>
                     <CardDescription>For urgent matters, please act immediately.</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">If you are facing a situation that poses an immediate threat to your safety or health (e.g., fire, medical emergency, security threat), please do not use this form. Contact the hostel security or warden directly.</p>
                   </CardContent>
                   <CardFooter>
                     <Button variant="destructive" className="w-full" asChild>
                       <a href="tel:+1-234-567-8900">
                         <PhoneOutgoing className="mr-2 h-4 w-4" />
                         Call Emergency Line
                       </a>
                     </Button>
                   </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GanttChartSquare className="w-6 h-6 text-primary" />
                        Our Complaint Process
                      </CardTitle>
                      <CardDescription>How we handle your feedback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-start gap-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                         <div>
                           <p className="font-semibold">Submission & AI Analysis</p>
                           <p className="text-sm text-muted-foreground">You submit your complaint, and our AI instantly analyzes, summarizes, and categorizes it.</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                         <div>
                           <p className="font-semibold">Review & Action</p>
                           <p className="text-sm text-muted-foreground">The categorized complaint is routed to the correct department for prompt review and action.</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                         <div>
                           <p className="font-semibold">Confidentiality</p>
                           <p className="text-sm text-muted-foreground">All submissions are handled with strict confidentiality to protect your privacy.</p>
                         </div>
                       </div>
                    </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="w-6 h-6 text-primary" />
                      Tips for an Effective Complaint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                      <li><strong>Be Specific:</strong> Include dates, times, locations, and who was involved.</li>
                      <li><strong>Be Factual:</strong> Describe the events objectively, without exaggeration.</li>
                      <li><strong>State the Impact:</strong> Explain how the issue has affected you.</li>
                      <li><strong>Suggest a Resolution:</strong> If you have an idea for a solution, please share it.</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-6 h-6 text-primary" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>What happens after I submit?</AccordionTrigger>
                        <AccordionContent>
                          Your complaint is analyzed by our AI for categorization and urgency, then routed to the appropriate department. An administrator will review it for action.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Is my submission anonymous?</AccordionTrigger>
                        <AccordionContent>
                          Yes, this form is anonymous. We do not collect personal identification. However, this may limit our ability to follow up with you directly for more information.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How long does resolution take?</AccordionTrigger>
                        <AccordionContent>
                          Resolution time varies depending on the complexity of the issue. Urgent matters are addressed immediately, while others are handled in the order they are received.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
