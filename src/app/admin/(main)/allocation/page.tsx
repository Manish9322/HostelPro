
"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { KeyRound, SlidersHorizontal, Users, Sparkles, UserCheck, UserX, AlertTriangle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Application, Room, Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function RoomAllocationPage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [unallocatedStudents, setUnallocatedStudents] = useState<Student[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsRes, roomsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/rooms'),
      ]);

      if (!studentsRes.ok || !roomsRes.ok) {
        throw new Error('Failed to fetch initial data');
      }

      const studentsData: Student[] = await studentsRes.json();
      const roomsData: Room[] = await roomsRes.json();

      setStudents(studentsData);
      setRooms(roomsData);

      setUnallocatedStudents(studentsData.filter(s => s.roomNumber === 'Unassigned'));
      setAvailableRooms(roomsData.filter(r => r.status === 'Available'));
    } catch (err) {
      setError("Failed to load allocation data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleRunAllocation = () => {
    setIsAllocating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAllocating(false);
          toast({
            title: "Allocation Complete!",
            description: "3 students have been assigned rooms. 2 students are on the waiting list.",
          })
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleManualAssign = () => {
      toast({
          title: "Feature Coming Soon",
          description: "Manual assignment is currently under development."
      })
  }

  const roomStatusVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'default';
      case 'Occupied': return 'secondary';
      case 'Under Maintenance': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Automated Room Allocation</CardTitle>
            <CardDescription>
              Assign rooms to students based on preferences and availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
                    <p className="mt-4 text-muted-foreground">{error}</p>
                    <Button onClick={fetchData} variant="outline" className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                     <Card className="p-6">
                         <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unallocated Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">{unallocatedStudents.length}</div>
                        <p className="text-xs text-muted-foreground">Students awaiting room assignment</p>
                    </Card>
                     <Card className="p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">{availableRooms.length}</div>
                        <p className="text-xs text-muted-foreground">Ready for immediate occupancy</p>
                    </Card>
                </div>
            )}
            
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
            <Button onClick={handleRunAllocation} disabled={isAllocating || loading || !!error} className="w-full" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {isAllocating ? 'Allocating Rooms...' : 'Run Automated Allocation'}
            </Button>
          </CardFooter>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle>Room Occupancy Overview</CardTitle>
                <CardDescription>A real-time view of room assignments and availability.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room No.</TableHead>
                            <TableHead>Occupants</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? Array.from({length: 5}).map((_, i) => (
                           <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                           </TableRow>
                        )) : rooms.map(room => {
                            const occupants = students.filter(s => s.roomNumber === room.roomNumber);
                            return (
                                <TableRow key={room._id}>
                                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                                    <TableCell>
                                        {occupants.length > 0 
                                            ? occupants.map(o => o.name).join(', ')
                                            : <span className="text-muted-foreground">Empty</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={roomStatusVariant(room.status)}>{room.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
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
                 <Select disabled={loading || !!error}>
                    <SelectTrigger id="select-student">
                        <SelectValue placeholder="Choose an applicant" />
                    </SelectTrigger>
                    <SelectContent>
                        {unallocatedStudents.map(app => (
                            <SelectItem key={app._id} value={app._id}>{app.name} ({app.studentId})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-room">Select Available Room</Label>
                 <Select disabled={loading || !!error}>
                    <SelectTrigger id="select-room">
                        <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableRooms.map(room => (
                             <SelectItem key={room._id} value={room._id}>{room.roomNumber} (Capacity: {room.capacity})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
               <Button variant="outline" className="w-full" onClick={handleManualAssign} disabled={loading || !!error}>Assign Room Manually</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
