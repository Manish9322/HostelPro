
"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Users, FileText, MessageSquareWarning } from "lucide-react";
import { mockStudents, mockApplications, mockComplaints, mockRooms } from "@/lib/data";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const roomChartConfig = {
  value: {
    label: "Rooms",
  },
  Occupied: {
    label: "Occupied",
    color: "hsl(var(--chart-1))",
  },
  Available: {
    label: "Available",
    color: "hsl(var(--chart-2))",
  },
  "Under Maintenance": {
    label: "Maintenance",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const complaintChartConfig = {
  value: {
    label: "Complaints",
  },
  Maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-1))",
  },
  Noise: {
    label: "Noise",
    color: "hsl(var(--chart-2))",
  },
  Safety: {
    label: "Safety",
    color: "hsl(var(--chart-3))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const applicationChartConfig = {
  value: {
    label: "Applications",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const studentYearChartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

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


export default function Dashboard() {
  const roomStats = React.useMemo(() => {
    const stats = mockRooms.reduce((acc, room) => {
        acc[room.status] = (acc[room.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(stats).map(([status, count]) => ({ 
        name: status, 
        value: count, 
        fill: `var(--color-${status.replace(/ /g, '-')})` 
    }));
  }, []);

  const complaintStats = React.useMemo(() => {
    const stats = mockComplaints.reduce((acc, complaint) => {
        const category = complaint.category as string;
        if (category !== 'Uncategorized' && category !== 'Harassment') {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(stats).map(([category, count]) => ({ 
        name: category, 
        value: count, 
        fill: `var(--color-${category})` 
    }));
  }, []);

  const applicationStats = React.useMemo(() => {
      const stats = mockApplications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);
      return Object.entries(stats).map(([status, count]) => ({ 
          name: status, 
          value: count, 
          fill: `var(--color-${status})` 
      }));
  }, []);

  const studentYearStats = React.useMemo(() => {
      const stats: { [key: string]: number } = mockStudents.reduce((acc, student) => {
          const yearLabel = `Year ${student.year}`;
          acc[yearLabel] = (acc[yearLabel] || 0) + 1;
          return acc;
      }, {} as { [key: string]: number });
      return Object.entries(stats)
        .map(([year, count]) => ({ name: year, students: count }))
        .sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const recentApplications = React.useMemo(() => {
    return mockApplications
      .filter((app) => app.status === "Pending")
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 5);
  }, []);

  const recentComplaints = React.useMemo(() => {
    return mockComplaints
      .filter((complaint) => complaint.status !== "Resolved")
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 5);
  }, []);


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
            <CardTitle>Room Occupancy</CardTitle>
            <CardDescription>A summary of room availability.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={roomChartConfig} className="min-h-[250px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie 
                  data={roomStats} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={2}
                  cornerRadius={5}
                  cy="50%"
                >
                    {roomStats.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
            <CardDescription>Breakdown of all submitted complaints by category.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={complaintChartConfig} className="min-h-[250px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie 
                  data={complaintStats} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={2}
                  cornerRadius={5}
                  cy="50%"
                >
                    {complaintStats.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                </Pie>
                 <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Overview of recent application outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={applicationChartConfig} className="min-h-[250px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie 
                  data={applicationStats} 
                  dataKey="value" 
                  nameKey="name" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={110}
                  paddingAngle={2}
                  cornerRadius={5}
                >
                    {applicationStats.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                </Pie>
                 <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Year</CardTitle>
            <CardDescription>A breakdown of residents by their year of study.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={studentYearChartConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={studentYearStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="students" fill="var(--color-students)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Newest student applications awaiting review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person avatar" alt="Avatar" />
                    <AvatarFallback>{app.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.course}</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {format(app.submittedAt, "PP")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No pending applications.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full" variant="outline">
              <Link href="/admin/applications">View All Applications</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Latest unresolved issues from residents.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
             {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center gap-4">
                      <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">{complaint.summary}</p>
                          <p className="text-sm text-muted-foreground">
                              Category: {complaint.category} &bull; {format(complaint.submittedAt, "PP")}
                          </p>
                      </div>
                      <div className="ml-auto font-medium">
                          <Badge variant={urgencyVariant(complaint.urgency)}>{complaint.urgency}</Badge>
                      </div>
                  </div>
                ))
             ) : (
                <p className="text-sm text-muted-foreground">No unresolved complaints.</p>
             )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full" variant="outline">
              <Link href="/admin/complaints">View All Complaints</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
