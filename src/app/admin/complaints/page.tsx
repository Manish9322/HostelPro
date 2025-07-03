import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockComplaints } from "@/lib/data";
import { format } from "date-fns";

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

export default function ComplaintsPage() {
  const sortedComplaints = [...mockComplaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Inbox</CardTitle>
        <CardDescription>
          Review and manage student complaints. Complaints are automatically categorized by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedComplaints.map((complaint) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
