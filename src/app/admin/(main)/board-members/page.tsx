
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { mockBoardMembers } from "@/lib/data";
import { format } from 'date-fns';
import { BoardMemberModal } from "@/components/modals/board-member-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";

const ITEMS_PER_PAGE = 5;

export default function BoardMembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const totalPages = Math.ceil(mockBoardMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = mockBoardMembers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (member = null) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (member: any) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    // Logic to delete the member
    console.log("Deleting member:", selectedMember);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Board Members</CardTitle>
            <CardDescription>
              Manage the details of the hostel's board members.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Member
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} data-ai-hint="person avatar" alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    <div className="text-sm">{member.email}</div>
                    <div className="text-xs text-muted-foreground">{member.phone}</div>
                  </TableCell>
                  <TableCell>{format(new Date(member.joinedAt), 'PPP')}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenModal(member)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDeleteModal(member)}>Delete</DropdownMenuItem>
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
            Showing <strong>{startIndex + 1}-{Math.min(endIndex, mockBoardMembers.length)}</strong> of <strong>{mockBoardMembers.length}</strong> members
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <BoardMemberModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        member={selectedMember}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedMember ? (selectedMember as any).name : ''}
      />
    </>
  );
}
