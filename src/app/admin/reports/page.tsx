
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

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<Date | undefined>();

  return (
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
              <Select defaultValue="occupancy">
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
            <Button className="w-full" size="lg">
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
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
              <Users className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Occupancy Report</h4>
                <p className="text-sm text-muted-foreground">Generates a detailed breakdown of room occupancy, including monthly trends and capacity analysis.</p>
              </div>
            </div>
             <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
              <CircleDollarSign className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Financial Report</h4>
                <p className="text-sm text-muted-foreground">Provides a summary of all financial activities, including fees collected, outstanding payments, and monthly revenue.</p>
              </div>
            </div>
             <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
              <MessageSquareWarning className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Complaints Summary</h4>
                <p className="text-sm text-muted-foreground">Analyzes complaint data, highlighting common categories, resolution times, and urgency levels.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
