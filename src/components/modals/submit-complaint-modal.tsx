
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import type { Complaint } from "@/lib/types";

interface SubmitComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onComplaintSubmitted: () => void;
}

const urgencyVariant = (urgency?: string) => {
  switch (urgency) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low':
    default: return 'outline';
  }
};


export function SubmitComplaintModal({ isOpen, onClose, studentId, studentName, onComplaintSubmitted }: SubmitComplaintModalProps) {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Partial<Complaint> | null>(null);
  const { toast } = useToast();

  const handleClose = () => {
    setSubject("");
    setText("");
    setError(null);
    setAnalysisResult(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Step 1: Call our AI flow to categorize the complaint
      const aiResponse = await fetch('/api/ai/categorize-complaint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complaintSubject: subject, complaintText: text }),
      });
      if (!aiResponse.ok) throw new Error("AI analysis failed.");
      const aiData = await aiResponse.json();
      setAnalysisResult(aiData);

      // Step 2: Save the full complaint to the database
      const complaintData = {
          studentId,
          studentName,
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
      onComplaintSubmitted();
      handleClose();

    } catch (err) {
      setError((err as Error).message);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? handleClose : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit New Complaint</DialogTitle>
          <DialogDescription>Describe your issue in detail. Our AI will help categorize it for a faster response.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="complaintSubject" className="text-right">Subject</Label>
              <Input id="complaintSubject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Leaky Faucet in Room 201" required />
            </div>
            <div>
              <Label htmlFor="complaintText" className="text-right">Details</Label>
              <Textarea id="complaintText" value={text} onChange={e => setText(e.target.value)} placeholder="Please be as specific as possible." className="min-h-[120px]" required />
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !subject || !text}>
                {isLoading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
