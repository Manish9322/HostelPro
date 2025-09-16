
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw, Search, Users, UserCheck, UserPlus } from "lucide-react";
import { StudentModal } from "@/components/modals/student-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStudentsQuery, useAddStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation } from "@/store/api";

export default function StudentsPage() {
  const { data: allStudents = [], error, isLoading, refetch } = useGetStudentsQuery();
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const stats = useMemo(() => {
    return {
        total: allStudents.length,
        assigned: allStudents.filter(s => s.roomNumber !== 'Unassigned').length,
        unassigned: allStudents.filter(s => s.roomNumber === 'Unassigned').length,
    }
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              student.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRoom = roomFilter === 'all' || 
                            (roomFilter === 'assigned' && student.roomNumber !== 'Unassigned') ||
                            (roomFilter === 'unassigned' && student.roomNumber === 'Unassigned');
        const matchesYear = yearFilter === 'all' || student.year.toString() === yearFilter;
        return matchesSearch && matchesRoom && matchesYear;
    });
  }, [allStudents, searchQuery, roomFilter, yearFilter]);

  const handleOpenModal = (student: Student | null = null) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };
  
  const handleOpenDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (studentData: Omit<Student, 'id' | 'avatar' | '_id'>) => {
    try {
      if (selectedStudent) {
        await updateStudent({ id: selectedStudent._id, body: studentData }).unwrap();
        toast({ title: "Success", description: "Student updated successfully." });
      } else {
        await addStudent(studentData).unwrap();
        toast({ title: "Success", description: "Student created successfully." });
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: `Failed to ${selectedStudent ? 'update' : 'create'} student.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent(selectedStudent._id).unwrap();
      toast({ title: "Success", description: "Student deleted successfully." });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete student.", variant: "destructive" });
    }
  };

  return (
    <>
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All students in the system</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Room Assigned</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.assigned}</div>
                <p className="text-xs text-muted-foreground">Students with an allocated room</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.unassigned}</div>
                <p className="text-xs text-muted-foreground">Students waiting for a room</p>
                </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            A list of all students currently residing in the hostel. New students are added automatically when their application is approved.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, ID, or course..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by room..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Room Statuses</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by year..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <AlertTriangle className="h-12 w-12 text-destructive" />
                      <h3 className="text-xl font-semibold">Error Loading Students</h3>
                      <p className="text-muted-foreground">Failed to load students. Please try again.</p>
                      <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.roomNumber}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenModal(student)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeleteModal(student)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <FileWarning className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No Students Found</h3>
                        <p className="text-muted-foreground">No students match the current filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredStudents.length}</strong> of <strong>{filteredStudents.length}</strong> students
          </div>
        </CardFooter>
      </Card>
    </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedStudent ? (selectedStudent as any).name : ''}
      />
    </>
  );
}
