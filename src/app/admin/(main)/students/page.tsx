
"use client";

import { useState, useEffect } from "react";
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
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { StudentModal } from "@/components/modals/student-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenModal = (student: Student | null = null) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };
  
  const handleOpenDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (studentData: Omit<Student, 'id' | 'avatar'>) => {
    const method = selectedStudent ? 'PUT' : 'POST';
    const url = selectedStudent ? `/api/students?id=${selectedStudent._id}` : '/api/students';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedStudent ? 'update' : 'create'} student`);
      }

      toast({
        title: "Success",
        description: `Student ${selectedStudent ? 'updated' : 'created'} successfully.`,
      });

      fetchStudents(); // Refresh data
      setModalOpen(false);

    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: `Failed to ${selectedStudent ? 'update' : 'create'} student.`,
            variant: "destructive",
        });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
        const response = await fetch(`/api/students?id=${selectedStudent._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        toast({
            title: "Success",
            description: "Student deleted successfully.",
        });

        fetchStudents(); // Refresh data
        setDeleteModalOpen(false);

    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to delete student.",
            variant: "destructive",
        });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>
              A list of all students currently residing in the hostel.
            </CardDescription>
          </div>
           <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Student
              </span>
          </Button>
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
              {loading ? (
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
                      <p className="text-muted-foreground">{error}</p>
                      <Button onClick={fetchStudents} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : students.length > 0 ? (
                students.map((student) => (
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
                        <p className="text-muted-foreground">Add a new student to get started.</p>
                        <Button onClick={() => handleOpenModal()}>Add New Student</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{students.length}</strong> of <strong>{students.length}</strong> students
          </div>
        </CardFooter>
      </Card>

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
