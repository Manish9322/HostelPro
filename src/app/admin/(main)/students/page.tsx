
"use client";

import { useState } from "react";
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { mockStudents } from "@/lib/data";
import { StudentModal } from "@/components/modals/student-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";

export default function StudentsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (student: any) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    console.log("Deleting student:", selectedStudent);
    setDeleteModalOpen(false);
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
              {mockStudents.map((student) => (
                <TableRow key={student.id}>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{mockStudents.length}</strong> of <strong>{mockStudents.length}</strong> students
          </div>
        </CardFooter>
      </Card>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
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
