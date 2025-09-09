
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
import type { Room, Student } from "@/lib/types";
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
  
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [allocationResult, setAllocationResult] = useState<{allocated: number, waiting: number} | null>(null);
  
  const [allocationPriority, setAllocationPriority] = useState('application-date');
  const [matchGender, setMatchGender] = useState(true);
  const [matchPreferences, setMatchPreferences] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setAllocationResult(null);
      setProgress(0);

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


  const handleRunAllocation = async () => {
    setIsAllocating(true);
    setProgress(0);
    setAllocationResult(null);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
        const response = await fetch('/api/rooms/allocate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              priority: allocationPriority,
              matchGender,
              matchPreferences,
             }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Allocation process failed.');
        }
        
        const result = await response.json();
        
        clearInterval(interval);
        setProgress(100);
        
        toast({
            title: "Allocation Complete!",
            description: `${result.allocatedCount} students assigned. ${result.waitingListCount} on waiting list.`,
        });
        setAllocationResult({allocated: result.allocatedCount, waiting: result.waitingListCount});
        
        fetchData(); // Refresh all data

    } catch (err) {
        clearInterval(interval);
        toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
        setIsAllocating(false);
    }
  };
  
  const handleManualAssign = async () => {
      if (!selectedStudentId || !selectedRoomId) {
          toast({ title: "Warning", description: "Please select both a student and a room.", variant: "destructive"});
          return;
      }
      
      try {
          const studentRes = await fetch(`/api/students?id=${selectedStudentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomNumber: rooms.find(r => r._id === selectedRoomId)?.roomNumber }),
          });

          if (!studentRes.ok) throw new Error("Failed to update student's room.");

          const roomToUpdate = rooms.find(r => r._id === selectedRoomId);
          if (roomToUpdate) {
            const newOccupancy = roomToUpdate.occupancy + 1;
            const newStatus = newOccupancy >= roomToUpdate.capacity ? 'Occupied' : 'Available';
            
            const roomRes = await fetch(`/api/rooms?id=${selectedRoomId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ occupancy: newOccupancy, status: newStatus }),
            });
            if (!roomRes.ok) throw new Error("Failed to update room status.");
          }


          toast({ title: "Success", description: "Student has been manually assigned."});
          setSelectedStudentId("");
          setSelectedRoomId("");
          fetchData();

      } catch(err) {
          toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
      }
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
            
            {allocationResult && (
                <div className="p-4 bg-secondary rounded-lg text-center">
                    <h3 className="font-semibold text-lg text-primary">Allocation Complete!</h3>
                    <p className="text-muted-foreground">{allocationResult.allocated} students assigned. {allocationResult.waiting} on waiting list.</p>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button onClick={handleRunAllocation} disabled={isAllocating || loading || !!error || unallocatedStudents.length === 0} className="w-full" size="lg">
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
                <Select value={allocationPriority} onValueChange={setAllocationPriority}>
                    <SelectTrigger id="allocation-priority">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="application-date">Application Date</SelectItem>
                        <SelectItem value="year-of-study">Year of Study</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Matching Logic</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox id="match-gender" checked={matchGender} onCheckedChange={(checked) => setMatchGender(Boolean(checked))} />
                    <Label htmlFor="match-gender" className="font-normal">Match gender</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="match-preferences" checked={matchPreferences} onCheckedChange={(checked) => setMatchPreferences(Boolean(checked))} />
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
                 <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={loading || !!error || unallocatedStudents.length === 0}>
                    <SelectTrigger id="select-student">
                        <SelectValue placeholder="Choose an applicant" />
                    </SelectTrigger>
                    <SelectContent>
                        {unallocatedStudents.map(student => (
                            <SelectItem key={student._id} value={student._id}>{student.name} ({student.studentId})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-room">Select Available Room</Label>
                 <Select value={selectedRoomId} onValueChange={setSelectedRoomId} disabled={loading || !!error || availableRooms.length === 0}>
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
               <Button variant="outline" className="w-full" onClick={handleManualAssign} disabled={loading || !!error || !selectedStudentId || !selectedRoomId}>Assign Room Manually</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
