
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student, Room } from "@/lib/types";
import { Bed, Users, Wifi, Wind, Bath, Thermometer, Wrench, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const roomStatusVariant = (status: string) => {
  switch (status) {
    case 'Available':
      return 'default';
    case 'Occupied':
      return 'secondary';
    case 'Under Maintenance':
      return 'destructive';
    default:
      return 'outline';
  }
};

const roomConditionVariant = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'default';
      case 'Good':
        return 'secondary';
      case 'Fair':
        return 'outline';
      case 'Poor':
        return 'destructive';
      default:
        return 'outline';
    }
  };


export default function StudentRoomPage() {
    const [student, setStudent] = useState<Student | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roommate, setRoommate] = useState<Student | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const studentsRes = await fetch('/api/students');
            if (!studentsRes.ok) throw new Error("Failed to fetch students");
            const students: Student[] = await studentsRes.json();
            const currentStudent = students[0] || null;
            setStudent(currentStudent);
            
            if (currentStudent && currentStudent.roomNumber !== "Unassigned") {
                const roomsRes = await fetch('/api/rooms');
                if (!roomsRes.ok) throw new Error("Failed to fetch rooms");
                const rooms: Room[] = await roomsRes.json();
                
                const currentRoom = rooms.find(r => r.roomNumber === currentStudent.roomNumber);
                setRoom(currentRoom || null);

                if (currentRoom && currentRoom.occupancy > 1) {
                    const foundRoommate = students.find(s => s.roomNumber === currentRoom.roomNumber && s._id !== currentStudent._id);
                    setRoommate(foundRoommate || null);
                }
            } else {
                 setRoom(null);
            }

        } catch (err) {
            setError("Could not load room details. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
             <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                           <Skeleton className="h-6 w-24 rounded-full" />
                           <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Separator/>
                        <div className="space-y-4">
                           <Skeleton className="h-5 w-40" />
                           <div className="grid grid-cols-2 gap-4">
                             <Skeleton className="h-5 w-full" />
                             <Skeleton className="h-5 w-full" />
                             <Skeleton className="h-5 w-full" />
                             <Skeleton className="h-5 w-full" />
                           </div>
                        </div>
                        <Separator/>
                        <div className="space-y-4">
                           <Skeleton className="h-5 w-40" />
                           <Skeleton className="h-5 w-3/4" />
                        </div>
                    </CardContent>
                </Card>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
                        <CardContent><Skeleton className="h-5 w-full" /></CardContent>
                     </Card>
                     <Card>
                        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                     </Card>
                </div>
             </div>
        );
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

  if(!room || !student) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Room Not Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>You have not been assigned a room yet. Please check back later or contact the administration.</p>
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="text-3xl">Room {room.roomNumber}</CardTitle>
                <CardDescription>
                    All the details about your allocated room.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">Status:</p>
                        <Badge variant={roomStatusVariant(room.status)}>{room.status}</Badge>
                    </div>
                     <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">Condition:</p>
                        <Badge variant={roomConditionVariant(room.condition)}>{room.condition}</Badge>
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h4 className="font-semibold mb-4 text-primary">Utilities & Amenities</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {room.utilities.map(util => {
                            const iconMap: { [key: string]: React.ElementType } = {
                                'AC': Wind,
                                'Wi-Fi': Wifi,
                                'Attached Bathroom': Bath,
                                'Common Bathroom': Bath
                            };
                            const Icon = iconMap[util];
                            return Icon ? <div key={util} className="flex items-center gap-2"><Icon className="w-5 h-5 text-primary"/>{util}</div> : null
                        })}
                        <div className="flex items-center gap-2"><Thermometer className="w-5 h-5 text-primary"/>Hot Water Supply</div>
                        <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary"/>24/7 Security</div>
                    </div>
                </div>

                 <Separator />

                 <div>
                    <h4 className="font-semibold mb-4 text-primary">Occupancy Details</h4>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary"/>
                        <p>This room has a capacity of <strong>{room.capacity}</strong> and is currently occupied by <strong>{room.occupancy}</strong> student(s).</p>
                    </div>
                </div>

            </CardContent>
        </Card>
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Roommate</CardTitle>
                </CardHeader>
                <CardContent>
                    {roommate ? (
                        <p>{roommate.name} ({roommate.course})</p>
                    ) : room.occupancy > 1 ? (
                        <p className="text-muted-foreground">Your roommate details are not available.</p>
                    ) : (
                        <p className="text-muted-foreground">You are the sole occupant of this room.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Request Maintenance</CardTitle>
                     <CardDescription>
                        Facing an issue in your room?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground text-sm mb-4">Click below to report a maintenance issue for your room, such as a broken light or a leaky tap.</p>
                   <Button variant="outline" className="w-full">
                     <Wrench className="mr-2 h-4 w-4" />
                     Report an Issue
                   </Button>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
