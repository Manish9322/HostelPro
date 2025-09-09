
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Pen, AlertTriangle, RefreshCw, FilePlus2, Bed, CircleDollarSign, LifeBuoy, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EditStudentProfileModal } from "@/components/modals/edit-student-profile-modal";
import { useToast } from "@/hooks/use-toast";

const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || "N/A"}</p>
        </div>
    </div>
);

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = localStorage.getItem('loggedInStudentId');
      if (!studentId) {
          setError("No logged-in student found. Please log in again.");
          setLoading(false);
          return;
      }
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error("Failed to fetch student data.");
      const students: Student[] = await response.json();
      
      const currentStudent = students.find(s => s.studentId === studentId);
      
      if (currentStudent) {
        setStudent(currentStudent); 
      } else {
        setError(`Profile for student ID "${studentId}" not found.`);
      }
    } catch (err) {
      setError("Could not load your profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleUpdateProfile = async (updatedData: Partial<Student>) => {
    if (!student) return;

    try {
        const response = await fetch(`/api/students?id=${student._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        toast({
            title: "Success",
            description: "Your profile has been updated successfully.",
        });
        
        fetchStudentData(); // Refresh data
        setModalOpen(false);

    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update your profile.",
            variant: "destructive",
        });
    }
  };


  return (
    <>
    <div className="space-y-8">
        <Card>
        <CardHeader>
            {loading ? (
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                </div>
            ) : student && !error ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border">
                        <AvatarImage src={student.avatar} data-ai-hint="person avatar" alt={student.name} />
                        <AvatarFallback className="text-2xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl">{student.name}</CardTitle>
                        <CardDescription>Student ID: {student.studentId}</CardDescription>
                    </div>
                </div>
                <Button variant="outline" className="mt-4 sm:mt-0" onClick={() => setModalOpen(true)}>
                    <Pen className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </div>
            ) : null}
        </CardHeader>
        <CardContent>
            <Separator className="my-6" />

            {loading ? (
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-36 mb-4" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                    <h3 className="mt-4 text-lg font-semibold">Error</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={fetchStudentData} variant="outline" className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            ) : student ? (
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Contact Information</h3>
                    <div className="space-y-4">
                        <InfoField icon={Mail} label="Email Address" value={student.email} />
                        <InfoField icon={Phone} label="Phone Number" value={student.phone} />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Academic & Hostel Details</h3>
                    <div className="space-y-4">
                        <InfoField icon={GraduationCap} label="Course" value={student.course} />
                        <InfoField icon={Building} label="Room Number" value={student.roomNumber} />
                    </div>
                </div>
            </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No student profile found.</p>
                </div>
            )}

        </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                    <CardDescription>Access other portal features quickly.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/student/complaints"><FilePlus2 className="mr-2"/>File a Complaint</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/student/room"><Bed className="mr-2"/>Room Details</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/student/payments"><CircleDollarSign className="mr-2"/>Make a Payment</Link>
                    </Button>
                     <Button variant="outline" asChild>
                        <Link href="/student/directory"><Users className="mr-2"/>Resident Directory</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Hostel Contacts</CardTitle>
                    <CardDescription>Get in touch with the administration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary"/>
                        <div>
                            <p className="font-semibold">Warden's Office</p>
                            <p className="text-sm text-muted-foreground">warden@hostelpro.com</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <LifeBuoy className="w-5 h-5 text-primary"/>
                        <div>
                            <p className="font-semibold">General Inquiries</p>
                            <p className="text-sm text-muted-foreground">support@hostelpro.com</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
    {student && (
        <EditStudentProfileModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            student={student}
            onSubmit={handleUpdateProfile}
        />
    )}
    </>
  );
}
