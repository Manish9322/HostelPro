
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
import { format } from 'date-fns';
import { BoardMemberModal } from "@/components/modals/board-member-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { BoardMember } from "@/lib/types";


const ITEMS_PER_PAGE = 5;

export default function BoardMembersPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/board-members');
      if (!response.ok) throw new Error("Failed to fetch board members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load board members.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = members.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (member: BoardMember | null = null) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (member: BoardMember) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (memberData: Omit<BoardMember, '_id' | 'id' | 'avatar'>) => {
    const method = selectedMember ? 'PUT' : 'POST';
    const url = selectedMember ? `/api/board-members?id=${selectedMember._id}` : '/api/board-members';
    
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData),
        });
        if (!response.ok) throw new Error(`Failed to ${selectedMember ? 'update' : 'create'} board member`);
        
        toast({ title: "Success", description: `Board member ${selectedMember ? 'updated' : 'created'} successfully.` });
        fetchMembers();
        setModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: `Failed to ${selectedMember ? 'update' : 'create'} board member.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
        const response = await fetch(`/api/board-members?id=${selectedMember._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete board member');
        
        toast({ title: "Success", description: "Board member deleted successfully." });
        fetchMembers();
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete board member.", variant: "destructive" });
    }
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Board Members</CardTitle>
                <CardDescription>Loading board member data...</CardDescription>
            </CardHeader>
            <CardContent><p>Please wait while we fetch the records.</p></CardContent>
        </Card>
    );
  }

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
                <TableRow key={member._id}>
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
            Showing <strong>{startIndex + 1}-{Math.min(endIndex, members.length)}</strong> of <strong>{members.length}</strong> members
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
        onSubmit={handleFormSubmit}
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

