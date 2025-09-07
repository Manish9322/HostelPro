
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, FileDown, Calendar as CalendarIcon, Users, MessageSquareWarning, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import ReportModal from "@/components/report-modal";
import type { ReportData } from "@/lib/types";
import { mockFeePayments, mockApplications, mockComplaints, mockRooms, mockStudents } from "@/lib/data";

const generateReportData = (reportType: string): ReportData | null => {
  switch (reportType) {
    case "occupancy":
      return {
        title: "Occupancy Report",
        headers: ["Room No.", "Status", "Occupancy", "Capacity", "Condition"],
        rows: mockRooms.map(room => [room.roomNumber, room.status, `${room.occupancy}`, `${room.capacity}`, room.condition]),
      };
    case "financial":
      return {
        title: "Financial Report",
        headers: ["Student Name", "Student ID", "Month", "Amount", "Status", "Due Date"],
        rows: mockFeePayments.map(p => [p.studentName, p.studentId, p.month, `$${p.amount.toFixed(2)}`, p.status, format(p.dueDate, 'PP')]),
      };
    case "complaints":
       return {
        title: "Complaints Summary",
        headers: ["Summary", "Category", "Urgency", "Status", "Submitted At"],
        rows: mockComplaints.map(c => [c.summary, c.category, c.urgency, c.status, format(c.submittedAt, 'PPp')]),
      };
    case "applications":
        return {
            title: "Applications Analysis",
            headers: ["Applicant Name", "Course", "Status", "Submitted At"],
            rows: mockApplications.map(a => [a.name, a.course, a.status, format(a.submittedAt, 'PP')]),
        }
    default:
      return null;
  }
};


export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const [reportType, setReportType] = useState("occupancy");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const handleGenerateAndDownload = () => {
    // In a real app, this would generate a file.
    // For now, it can open the modal as a preview.
    const data = generateReportData(reportType);
    setSelectedReport(data);
  }

  const reportCards = [
    { type: "occupancy", title: "Occupancy Report", icon: Users, description: "Generates a detailed breakdown of room occupancy, including monthly trends and capacity analysis." },
    { type: "financial", title: "Financial Report", icon: CircleDollarSign, description: "Provides a summary of all financial activities, including fees collected, outstanding payments, and monthly revenue." },
    { type: "complaints", title: "Complaints Summary", icon: MessageSquareWarning, description: "Analyzes complaint data, highlighting common categories, resolution times, and urgency levels." },
  ];

  return (
    <>
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Reporting & Analytics</CardTitle>
              <CardDescription>
                Generate and export detailed reports on hostel operations. Select your criteria and generate a report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="occupancy">Occupancy Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="complaints">Complaints Summary</SelectItem>
                    <SelectItem value="applications">Applications Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange ? format(dateRange, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleGenerateAndDownload}>
                <FileDown className="mr-2 h-4 w-4" />
                Generate & Download Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart />
                Quick Reports
              </CardTitle>
               <CardDescription>Click a card to instantly view a report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportCards.map((card) => (
                <div 
                  key={card.type}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => setSelectedReport(generateReportData(card.type))}
                >
                  <card.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{card.title}</h4>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <ReportModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        reportData={selectedReport}
      />
    </>
  );
}
