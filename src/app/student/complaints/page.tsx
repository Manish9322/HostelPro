import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockComplaints } from "@/lib/data";
import { format } from "date-fns";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

const urgencyVariant = (urgency: string) => {
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

const statusVariant = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Pending':
      default:
        return 'outline';
    }
  };

export default function StudentComplaintsPage() {
  const studentComplaints = mockComplaints.slice(0, 3);
  const sortedComplaints = [...studentComplaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>My Complaints</CardTitle>
            <CardDescription>
            A history of your submitted complaints and their current status.
            </CardDescription>
        </div>
        <Button asChild>
            <Link href="/complaint">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Submit New Complaint
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedComplaints.length > 0 ? sortedComplaints.map((complaint) => (
          <div key={complaint.id} className="border p-4 rounded-lg hover:bg-card/80 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={urgencyVariant(complaint.urgency)}>Urgency: {complaint.urgency}</Badge>
                <Badge variant="outline">Category: {complaint.category}</Badge>
                <Badge variant={statusVariant(complaint.status)}>{complaint.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                {format(new Date(complaint.submittedAt), "PPP p")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-primary">{complaint.summary}</p>
              <p className="text-muted-foreground mt-1 text-sm">{complaint.complaintText}</p>
            </div>
          </div>
        )) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>You haven't submitted any complaints yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
