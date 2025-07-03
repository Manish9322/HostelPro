"use client";

import PublicHeader from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useFormState, useFormStatus } from "react-dom";
import { submitComplaint, type ComplaintState } from "@/lib/actions";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={pending}>
      {pending ? "Submitting..." : "Submit Complaint"}
    </Button>
  );
}

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
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);


  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <form ref={formRef} action={dispatch}>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Submit a Complaint</CardTitle>
                <CardDescription>
                  Your feedback is important. Please describe your issue in detail. All submissions are treated with confidentiality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea
                    name="complaintText"
                    placeholder="Please describe your complaint here..."
                    className="min-h-[150px] text-base"
                    required
                  />
                  {state.errors?.complaintText &&
                    state.errors.complaintText.map((error: string) => (
                      <p className="text-sm font-medium text-destructive" key={error}>
                        {error}
                      </p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 items-start">
                <SubmitButton />
                {state.data && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted w-full">
                    <h4 className="font-semibold mb-2">AI Analysis Complete:</h4>
                    <p className="text-sm"><span className="font-medium">Summary:</span> {state.data.summary}</p>
                    <div className="flex gap-2 mt-2">
                       <p className="text-sm"><span className="font-medium">Category:</span> <Badge>{state.data.category}</Badge></p>
                       <p className="text-sm"><span className="font-medium">Urgency:</span> <Badge variant="secondary">{state.data.urgency}</Badge></p>
                    </div>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
