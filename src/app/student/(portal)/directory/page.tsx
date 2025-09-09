
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AlertTriangle, FileWarning, RefreshCw, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function StudentDirectoryPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loggedInStudentId, setLoggedInStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error("Failed to fetch student data");
      const data: Student[] = await response.json();
      setAllStudents(data);
      const id = localStorage.getItem('loggedInStudentId');
      setLoggedInStudentId(id);
    } catch (err) {
      setError("Could not load the directory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return allStudents
      .filter(student => student.studentId !== loggedInStudentId)
      .filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allStudents, loggedInStudentId, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resident Directory</CardTitle>
        <CardDescription>
          A directory of current residents in the hostel. You can search for residents by name or course.
        </CardDescription>
         <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Search by name or course..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading || !!error}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Room No.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                ))
            ) : error ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-16 text-destructive">
                        <AlertTriangle className="mx-auto h-8 w-8 mb-2"/>
                        <p>{error}</p>
                        <Button onClick={fetchStudents} variant="outline" size="sm" className="mt-4">
                            <RefreshCw className="mr-2 h-4 w-4"/>
                            Try Again
                        </Button>
                    </TableCell>
                </TableRow>
            ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{student.name}</p>
                        </div>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.roomNumber}</TableCell>
                    </TableRow>
                ))
            ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                        {searchQuery ? (
                            <>
                                <Search className="mx-auto h-8 w-8 mb-2"/>
                                <p>No residents found matching your search for "{searchQuery}".</p>
                            </>
                        ) : (
                             <>
                                <Users className="mx-auto h-8 w-8 mb-2"/>
                                <p>The directory is currently empty.</p>
                            </>
                        )}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
