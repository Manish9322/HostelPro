"use client";

import { useState } from "react";
import PublicHeader from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type Status = 'Pending' | 'Approved' | 'Rejected' | 'Not Found';

export default function StatusPage() {
  const [applicationId, setApplicationId] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId) return;

    setLoading(true);
    setStatus(null);

    // Mock API call
    setTimeout(() => {
      if (applicationId.toLowerCase() === "app001") {
        setStatus("Approved");
      } else if (applicationId.toLowerCase() === "app002") {
        setStatus("Pending");
      } else if (applicationId.toLowerCase() === "app003") {
        setStatus("Rejected");
      } else {
        setStatus("Not Found");
      }
      setLoading(false);
    }, 1500);
  };

  const StatusAlert = () => {
    if (!status) return null;

    switch (status) {
      case "Approved":
        return (
          <Alert variant="default" className="bg-green-100 border-green-400 text-green-800">
            <CheckCircle className="h-4 w-4 !text-green-800" />
            <AlertTitle>Approved!</AlertTitle>
            <AlertDescription>
              Congratulations! Your application has been approved. Please check your email for further instructions.
            </AlertDescription>
          </Alert>
        );
      case "Pending":
        return (
          <Alert variant="default" className="bg-yellow-100 border-yellow-400 text-yellow-800">
            <Clock className="h-4 w-4 !text-yellow-800" />
            <AlertTitle>Pending Review</AlertTitle>
            <AlertDescription>
              Your application is still under review. Please check back later.
            </AlertDescription>
          </Alert>
        );
      case "Rejected":
        return (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Application Rejected</AlertTitle>
            <AlertDescription>
              We regret to inform you that your application was not successful at this time.
            </AlertDescription>
          </Alert>
        );
      case "Not Found":
        return (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              We could not find an application with the ID you provided.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Check Application Status</CardTitle>
              <CardDescription>Enter your Application ID to see the current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckStatus} className="space-y-4">
                <Input
                  placeholder="e.g., APP001"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
                  className="text-lg"
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
                  {loading ? "Checking..." : "Check Status"}
                </Button>
              </form>
              <div className="mt-6">
                {loading ? <p className="text-center text-muted-foreground">Loading status...</p> : <StatusAlert />}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
