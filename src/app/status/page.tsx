"use client";

import { useState } from "react";
import PublicHeader from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Search,
  AlertTriangle,
  HelpCircle,
  FileText,
  GanttChartSquare,
  MailCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { mockApplications } from "@/lib/data";

// Define a type for the application details we'll show
type ApplicationDetails = {
  id: string;
  name: string;
  submittedAt: Date;
  status: "Pending" | "Approved" | "Rejected";
};

// Component to render the status result
function StatusResultCard({
  application,
}: {
  application: ApplicationDetails | { status: "Not Found" };
}) {
  if (!application) return null;

  if (application.status === "Not Found") {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Application Not Found</AlertTitle>
        <AlertDescription>
          We couldn't find an application with the ID you provided. Please
          double-check the ID and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const { id, name, submittedAt, status } = application;

  const statusConfig = {
    Approved: {
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      title: "Application Approved!",
      badgeVariant: "default" as const,
      description:
        "Congratulations! Your application has been accepted. Welcome to HostelPro!",
      nextSteps:
        "You will receive an email with payment details and check-in instructions within the next 48 hours. Please check your spam folder if you don't see it.",
    },
    Pending: {
      icon: <Clock className="h-12 w-12 text-yellow-500" />,
      title: "Application Pending",
      badgeVariant: "secondary" as const,
      description:
        "Your application is currently under review by our administrative team.",
      nextSteps:
        "The review process typically takes 5-7 business days. We appreciate your patience and will notify you via email as soon as a decision is made.",
    },
    Rejected: {
      icon: <XCircle className="h-12 w-12 text-destructive" />,
      title: "Application Not Approved",
      badgeVariant: "destructive" as const,
      description:
        "We regret to inform you that your application was not successful at this time.",
      nextSteps:
        "We receive a high volume of applications and have limited availability. You are welcome to re-apply in the next admission cycle. For specific queries, please contact the admissions office.",
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">{config.icon}</div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Applicant Name</p>
            <p className="font-semibold">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Application ID</p>
            <p className="font-semibold">{id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Submitted On</p>
            <p className="font-semibold">{format(submittedAt, "PPP")}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Status</p>
            <Badge variant={config.badgeVariant} className="font-semibold">
              {status}
            </Badge>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>What's Next?</AlertTitle>
          <AlertDescription>{config.nextSteps}</AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
}

function ApplicationProcessOverview() {
  const steps = [
    {
      icon: FileText,
      title: "1. Application Submitted",
      description: "You submit your application through our online portal.",
    },
    {
      icon: GanttChartSquare,
      title: "2. Under Review",
      description:
        "Our admissions team reviews your application for eligibility and completeness.",
    },
    {
      icon: MailCheck,
      title: "3. Decision Made",
      description:
        "A final decision is made, and you are notified via email and this portal.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Process Overview</CardTitle>
        <CardDescription>
          Understand the journey of your application from submission to decision.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex-1 flex items-start gap-4 relative"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border -translate-x-1/2 ml-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export default function StatusPage() {
  const [applicationId, setApplicationId] = useState("");
  const [result, setResult] = useState<
    ApplicationDetails | { status: "Not Found" } | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId) return;

    setLoading(true);
    setResult(null);

    // Mock API call using data from lib/data.ts
    setTimeout(() => {
      const foundApp = mockApplications.find(
        (app) => app.studentId.toLowerCase() === applicationId.toLowerCase()
      );

      if (foundApp) {
        setResult({
          id: foundApp.studentId,
          name: foundApp.name,
          submittedAt: foundApp.submittedAt,
          status: foundApp.status as "Pending" | "Approved" | "Rejected",
        });
      } else {
        setResult({ status: "Not Found" });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">
                    Check Application Status
                  </CardTitle>
                  <CardDescription>
                    Enter your Student ID to see the current status of your
                    application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckStatus} className="flex gap-2">
                    <Input
                      placeholder="e.g., APP001"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      className="text-base h-11"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <Clock className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                      <span className="sr-only">Check Status</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <ApplicationProcessOverview />

              {loading && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground pt-8">
                    <Clock className="h-8 w-8 animate-spin" />
                    <p className="text-lg">Checking application status...</p>
                  </div>
              )}
              {result && !loading && (
                 <StatusResultCard application={result} />
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-8">
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
                        <AccordionTrigger>
                          What do the different application statuses mean?
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>
                              <strong>Approved:</strong> Congratulations! Your
                              application was successful. You'll receive check-in
                              details via email soon.
                            </li>
                            <li>
                              <strong>Pending:</strong> Your application is under
                              review. This process usually takes 5-7 business days.
                            </li>
                            <li>
                              <strong>Rejected:</strong> Unfortunately, we couldn't
                              offer you a spot at this time due to high demand or
                              unmet criteria.
                            </li>
                            <li>
                              <strong>Not Found:</strong> We couldn't find an
                              application with the ID you provided. Please check the
                              ID and try again.
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          How long does the review process take?
                        </AccordionTrigger>
                        <AccordionContent>
                          Our admissions team carefully reviews each application. The
                          process typically takes between 5 to 7 business days
                          after submission. You will be notified by email once a
                          decision has been made.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>
                          My application was rejected. Can I reapply?
                        </AccordionTrigger>
                        <AccordionContent>
                          Yes, you are welcome to re-apply for the next admission
                          cycle. We receive a high volume of applications, and
                          availability is limited. We recommend reviewing the
                          application criteria before reapplying.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>
                          I haven't received an email after my application was
                          approved. What should I do?
                        </AccordionTrigger>
                        <AccordionContent>
                          Please allow up to 48 hours for the email with check-in
                          and payment details to arrive. Don't forget to check your
                          spam or junk folder. If you still haven't received it,
                          please contact our admissions office.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-accent" />
                      Need Further Assistance?
                    </CardTitle>
                    <CardDescription>
                      Our admissions team is here to help.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have specific questions about your application that are
                      not answered here, please feel free to reach out to us.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        admissions@hostelpro.com
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +1 (234) 567-8900
                      </p>
                    </div>
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
