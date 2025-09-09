
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FilePlus2, AlertTriangle, RefreshCw, FileWarning } from "lucide-react";
import { useState, useEffect } from "react";
import type { Complaint, Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitComplaintModal } from "@/components/modals/submit-complaint-modal";

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
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentId = localStorage.getItem('loggedInStudentId');
        if (!studentId) {
            throw new Error("You must be logged in to view complaints.");
        }
        
        // Fetch student details to get their name
        const studentsRes = await fetch('/api/students');
        if(!studentsRes.ok) throw new Error("Failed to fetch student data");
        const allStudents: Student[] = await studentsRes.json();
        const currentStudent = allStudents.find(s => s.studentId === studentId);
        if(!currentStudent) throw new Error("Could not find your student profile.");
        setStudent(currentStudent);

        // Fetch complaints for that student
        const complaintsRes = await fetch(`/api/complaints?studentId=${studentId}`);
        if (!complaintsRes.ok) throw new Error("Failed to fetch your complaints.");
        const complaintsData = await complaintsRes.json();
        setComplaints(complaintsData);

      } catch (err) {
          setError((err as Error).message);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>My Complaints</CardTitle>
            <CardDescription>
            A history of your submitted complaints and their current status.
            </CardDescription>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={loading || !!error}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Submit New Complaint
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
           Array.from({length: 3}).map((_, i) => (
             <div key={i} className="border p-4 rounded-lg space-y-3">
               <div className="flex justify-between">
                 <div className="flex items-center gap-2">
                   <Skeleton className="h-5 w-20 rounded-full" />
                   <Skeleton className="h-5 w-24 rounded-full" />
                   <Skeleton className="h-5 w-16 rounded-full" />
                 </div>
                 <Skeleton className="h-4 w-32" />
               </div>
               <Skeleton className="h-5 w-1/2" />
               <Skeleton className="h-4 w-full" />
             </div>
           ))
        ) : error ? (
            <div className="text-center py-12 text-destructive">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
                <Button onClick={fetchData} variant="outline" className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Try Again
                </Button>
            </div>
        ) : complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div key={complaint._id} className="border p-4 rounded-lg hover:bg-card/80 transition-colors">
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
          ))
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <FileWarning className="h-10 w-10 mx-auto mb-2" />
                <p>You haven't submitted any complaints yet.</p>
            </div>
        )}
      </CardContent>
    </Card>

    {student && (
        <SubmitComplaintModal 
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            studentId={student.studentId}
            studentName={student.name}
            onComplaintSubmitted={fetchData}
        />
    )}
    </>
  );
}
