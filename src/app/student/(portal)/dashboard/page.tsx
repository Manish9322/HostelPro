
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { User, Bed, MessageSquareWarning, CircleHelp, AlertTriangle, RefreshCw, BadgeEuro, CalendarClock, Home, UserCheck, Bell, CreditCard, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import type { Student, Complaint, Notice, FeePayment, Room } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BentoCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <Card className={cn("flex flex-col", className)}>
        {children}
    </Card>
);

const statusVariant = (status: string) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Pending': return 'secondary';
    case 'Overdue': return 'destructive';
    default: return 'outline';
  }
};


export default function StudentDashboardPage() {
    const [student, setStudent] = useState<Student | null>(null);
    const [roommate, setRoommate] = useState<Student | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [upcomingPayment, setUpcomingPayment] = useState<FeePayment | null>(null);
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

            const [studentsRes, complaintsRes, noticesRes, feesRes] = await Promise.all([
                fetch('/api/students'),
                fetch(`/api/complaints?studentId=${studentId}`),
                fetch('/api/notices'),
                fetch(`/api/fees?studentId=${studentId}`)
            ]);
            
            if (!studentsRes.ok) throw new Error("Failed to fetch student data.");
            const allStudents: Student[] = await studentsRes.json();
            const currentStudent = allStudents.find(s => s.studentId === studentId);
            if (!currentStudent) throw new Error("Could not find your student profile.");
            setStudent(currentStudent);

            if (currentStudent && currentStudent.roomNumber !== "Unassigned") {
                const foundRoommate = allStudents.find(s => s.roomNumber === currentStudent.roomNumber && s._id !== currentStudent._id);
                setRoommate(foundRoommate || null);
            }

            if (!complaintsRes.ok) throw new Error("Failed to fetch your complaints.");
            const complaintsData: Complaint[] = await complaintsRes.json();
            setComplaints(complaintsData);
            
            if (!noticesRes.ok) throw new Error("Failed to fetch notices.");
            const noticesData: Notice[] = await noticesRes.json();
            setNotices(noticesData.slice(0, 3));

            if (!feesRes.ok) throw new Error("Failed to fetch payment data.");
            const paymentsData: FeePayment[] = await feesRes.json();
            const upcoming = paymentsData.find(p => p.status === 'Pending' || p.status === 'Overdue');
            setUpcomingPayment(upcoming || null);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-4">
                 <Skeleton className="lg:col-span-2 h-40" />
                 <Skeleton className="h-40" />
                 <Skeleton className="h-40" />
                 <Skeleton className="lg:col-span-2 h-64" />
                 <Skeleton className="lg:col-span-2 h-64" />
                 <Skeleton className="h-64" />
                 <Skeleton className="h-64" />
                 <Skeleton className="lg:col-span-2 h-40" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-6">
            <BentoCard className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome Back, {student.name.split(' ')[0]}!</CardTitle>
                    <CardDescription>Here's a quick overview of your hostel status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <User className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Student ID</p>
                                <p className="font-semibold">{student.studentId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Home className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Course</p>
                                <p className="font-semibold">{student.course}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </BentoCard>
            
            <BentoCard>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Bed className="h-5 w-5"/>
                        My Room
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{student.roomNumber}</p>
                    {roommate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <UserCheck className="h-4 w-4" />
                            <span>Roommate: {roommate.name.split(' ')[0]}</span>
                        </div>
                    )}
                </CardContent>
            </BentoCard>

            <BentoCard>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquareWarning className="h-5 w-5"/>
                        Open Complaints
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{openComplaintsCount}</p>
                    <p className="text-sm text-muted-foreground">Awaiting resolution</p>
                </CardContent>
            </BentoCard>

            <BentoCard className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5"/>
                        Recent Hostel Notices
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {notices.length > 0 ? notices.map(notice => (
                        <div key={notice._id} className="p-3 rounded-md border text-sm">
                            <h4 className="font-semibold mb-1">{notice.title}</h4>
                            <p className="text-xs text-muted-foreground">{format(new Date(notice.publishedAt), 'PP')}</p>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent notices.</p>
                    )}
                </CardContent>
            </BentoCard>

             <BentoCard className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                         <CreditCard className="h-5 w-5"/>
                        Upcoming Payment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     {upcomingPayment ? (
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-secondary/50 rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                <CalendarClock className="h-4 w-4"/>
                                <span>Due: {format(new Date(upcomingPayment.dueDate), 'PPP')}</span>
                            </div>
                            <p className="text-4xl font-bold tracking-tight">₹{upcomingPayment.amount.toFixed(2)}</p>
                             <Badge variant={statusVariant(upcomingPayment.status)} className="mt-2">{upcomingPayment.status}</Badge>
                            <Button className="mt-4 w-full" asChild>
                                <Link href="/student/payments">Go to Payments</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You have no upcoming payments. Nicely done!</p>
                        </div>
                    )}
                </CardContent>
            </BentoCard>

             <BentoCard className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks at your fingertips.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                         <Link href="/student/complaints">
                            <CircleHelp className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">File a Complaint</span>
                         </Link>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                         <Link href="/student/profile">
                            <User className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">View Profile</span>
                         </Link>
                    </Button>
                     <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                         <Link href="/student/room">
                            <Bed className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">Room Details</span>
                         </Link>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                        <Link href="/student/inquiry">
                            <MessageSquareWarning className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">Make an Inquiry</span>
                        </Link>
                    </Button>
                </CardContent>
            </BentoCard>
            
            <BentoCard className="lg:col-span-2">
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
                        <BadgeEuro className="w-5 h-5 text-primary"/>
                        <div>
                            <p className="font-semibold">Accounts Department</p>
                            <p className="text-sm text-muted-foreground">accounts@hostelpro.com</p>
                        </div>
                    </div>
                </CardContent>
            </BentoCard>

        </div>
    );
}
