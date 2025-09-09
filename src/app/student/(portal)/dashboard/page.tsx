"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { User, Bed, MessageSquareWarning, CircleHelp, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import type { Student, Complaint, Notice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
    const [student, setStudent] = useState<Student | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const studentId = localStorage.getItem('loggedInStudentId');
            if (!studentId) {
                throw new Error("You must be logged in to view the dashboard.");
            }

            const [studentsRes, complaintsRes, noticesRes] = await Promise.all([
                fetch('/api/students'),
                fetch(`/api/complaints?studentId=${studentId}`),
                fetch('/api/notices')
            ]);
            
            if (!studentsRes.ok) throw new Error("Failed to fetch student data.");
            const allStudents: Student[] = await studentsRes.json();
            const currentStudent = allStudents.find(s => s.studentId === studentId);
            if (!currentStudent) throw new Error("Could not find your student profile.");
            setStudent(currentStudent);

            if (!complaintsRes.ok) throw new Error("Failed to fetch your complaints.");
            const complaintsData: Complaint[] = await complaintsRes.json();
            setComplaints(complaintsData);
            
            if (!noticesRes.ok) throw new Error("Failed to fetch notices.");
            const noticesData: Notice[] = await noticesRes.json();
            setNotices(noticesData.slice(0, 3));

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

    if (loading) {
        return (
             <div className="grid gap-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   <Card><CardHeader><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-4 w-16"/></CardHeader><CardContent><Skeleton className="h-8 w-32"/><Skeleton className="h-4 w-24 mt-1"/></CardContent></Card>
                   <Card><CardHeader><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-4 w-16"/></CardHeader><CardContent><Skeleton className="h-8 w-32"/><Skeleton className="h-4 w-24 mt-1"/></CardContent></Card>
                   <Card><CardHeader><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-4 w-16"/></CardHeader><CardContent><Skeleton className="h-8 w-32"/><Skeleton className="h-4 w-24 mt-1"/></CardContent></Card>
                </div>
                <Card><CardHeader><Skeleton className="h-6 w-40"/><Skeleton className="h-4 w-48 mt-2"/></CardHeader><CardContent className="space-y-4"><Skeleton className="h-20 w-full"/><Skeleton className="h-20 w-full"/></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-32"/><Skeleton className="h-4 w-44 mt-2"/></CardHeader><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4"><Skeleton className="h-24 w-full"/><Skeleton className="h-24 w-full"/><Skeleton className="h-24 w-full"/><Skeleton className="h-24 w-full"/></CardContent></Card>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="text-center py-16">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-4 text-lg font-semibold">Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={fetchData} variant="outline" className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </Card>
        );
    }
    
    if (!student) {
        return <p>No student data found.</p>
    }

    return (
        <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.name}</div>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Room</CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.roomNumber}</div>
                        <p className="text-xs text-muted-foreground">{student.course}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Open Complaints</CardTitle>
                        <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openComplaintsCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting resolution</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Hostel Notices</CardTitle>
                    <CardDescription>Stay updated with the latest announcements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {notices.length > 0 ? notices.map(notice => (
                        <div key={notice._id} className="p-4 rounded-md border">
                            <h4 className="font-semibold mb-1">{notice.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">{format(new Date(notice.publishedAt), 'PP')}</p>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent notices.</p>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks at your fingertips.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto aspect-square flex-col gap-2" asChild>
                         <Link href="/student/complaints">
                            <CircleHelp className="h-8 w-8 text-primary" />
                            <span className="text-sm font-medium">File a Complaint</span>
                         </Link>
                    </Button>
                    <Button variant="outline" className="h-auto aspect-square flex-col gap-2" asChild>
                         <Link href="/student/profile">
                            <User className="h-8 w-8 text-primary" />
                            <span className="text-sm font-medium">View Profile</span>
                         </Link>
                    </Button>
                     <Button variant="outline" className="h-auto aspect-square flex-col gap-2" asChild>
                         <Link href="/student/room">
                            <Bed className="h-8 w-8 text-primary" />
                            <span className="text-sm font-medium">Room Details</span>
                         </Link>
                    </Button>
                    <Button variant="outline" className="h-auto aspect-square flex-col gap-2" asChild>
                        <Link href="/student/payments">
                            <MessageSquareWarning className="h-8 w-8 text-primary" />
                            <span className="text-sm font-medium">Track Payments</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
