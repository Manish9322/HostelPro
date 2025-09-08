
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { KeyRound, SlidersHorizontal, Users, Sparkles, UserCheck, UserX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockApplications, mockRooms } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

const unallocatedApplicants = mockApplications.filter(app => app.status === 'Approved').slice(0, 5); // Mock some unallocated students

export default function RoomAllocationPage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunAllocation = () => {
    setIsAllocating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAllocating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const availableRooms = mockRooms.filter(r => r.status === 'Available').length;
  const approvedApplicants = mockApplications.filter(app => app.status === 'Approved').length;

  return (
    <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Automated Room Allocation</CardTitle>
            <CardDescription>
              Assign rooms to students based on preferences and availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                 <Card className="p-6">
                     <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Applicants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{approvedApplicants}</div>
                    <p className="text-xs text-muted-foreground">Students awaiting room assignment</p>
                </Card>
                 <Card className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{availableRooms}</div>
                    <p className="text-xs text-muted-foreground">Ready for immediate occupancy</p>
                </Card>
            </div>
            
            {isAllocating && (
              <div className="space-y-4 text-center">
                <Progress value={progress} className="w-full" />
                <p className="text-muted-foreground animate-pulse">Running allocation algorithm... Matching students to rooms.</p>
              </div>
            )}
            
            {!isAllocating && progress === 100 && (
                <div className="p-4 bg-secondary rounded-lg text-center">
                    <h3 className="font-semibold text-lg text-primary">Allocation Complete!</h3>
                    <p className="text-muted-foreground">3 students have been assigned rooms. 2 students are on the waiting list.</p>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button onClick={handleRunAllocation} disabled={isAllocating} className="w-full" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {isAllocating ? 'Allocating Rooms...' : 'Run Automated Allocation'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal />
                Allocation Criteria
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="allocation-priority">Prioritize Based On</Label>
                <Select defaultValue="application-date">
                    <SelectTrigger id="allocation-priority">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="application-date">Application Date</SelectItem>
                        <SelectItem value="year-of-study">Year of Study</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Matching Logic</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox id="match-gender" defaultChecked />
                    <Label htmlFor="match-gender" className="font-normal">Match gender</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="match-preferences" />
                    <Label htmlFor="match-preferences" className="font-normal">Consider roommate preferences</Label>
                </div>
             </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle>Manual Allocation</CardTitle>
              <CardDescription>Manually assign a student to a specific room.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-student">Select Student</Label>
                 <Select>
                    <SelectTrigger id="select-student">
                        <SelectValue placeholder="Choose an applicant" />
                    </SelectTrigger>
                    <SelectContent>
                        {unallocatedApplicants.map(app => (
                            <SelectItem key={app.id} value={app.id}>{app.name} ({app.studentId})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-room">Select Available Room</Label>
                 <Select>
                    <SelectTrigger id="select-room">
                        <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockRooms.filter(r => r.status === 'Available').map(room => (
                             <SelectItem key={room.id} value={room.id}>{room.roomNumber} (Capacity: {room.capacity})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
               <Button variant="outline" className="w-full">Assign Room Manually</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
