
"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, MessageSquareWarning, ArrowUpRight } from "lucide-react";
import { mockStudents, mockApplications, mockComplaints } from "@/lib/data";
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const applicationStatusVariant = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const complaintUrgencyVariant = (urgency: string) => {
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

export default function Dashboard() {
  const recentApplications = [...mockApplications].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 5);
  const recentComplaints = [...mockComplaints].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 4);

  const courseCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = mockStudents.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(counts).map(([course, count]) => ({
      course,
      students: count,
    }));
  }, []);

  const chartConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
            <p className="text-xs text-muted-foreground">Currently living in the hostel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockApplications.filter((a) => a.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockComplaints.filter((c) => c.status !== 'Resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>A list of the most recent hostel applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-muted-foreground">{app.course}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={applicationStatusVariant(app.status)}>{app.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{format(new Date(app.submittedAt), 'PP')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter className="justify-end">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/applications">View All <ArrowUpRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>The latest complaints filed by residents.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{complaint.summary}</p>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(complaint.submittedAt, { addSuffix: true })}</p>
                  </div>
                  <Badge variant={complaintUrgencyVariant(complaint.urgency)}>{complaint.urgency}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/complaints">View All <ArrowUpRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Course</CardTitle>
            <CardDescription>A breakdown of residents by their field of study.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={courseCounts} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="course"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="students" fill="var(--color-students)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
