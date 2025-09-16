
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
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { BoardMemberModal } from "@/components/modals/board-member-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { BoardMember } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetBoardMembersQuery, useAddBoardMemberMutation, useUpdateBoardMemberMutation, useDeleteBoardMemberMutation, useGetSettingsQuery } from "@/store/api";

const ITEMS_PER_PAGE = 5;

export default function BoardMembersPage() {
  const { data: members = [], error, isLoading, refetch } = useGetBoardMembersQuery({ visibleOnly: false });
  const { data: settings } = useGetSettingsQuery();
  const [addBoardMember] = useAddBoardMemberMutation();
  const [updateBoardMember] = useUpdateBoardMemberMutation();
  const [deleteBoardMember] = useDeleteBoardMemberMutation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const { toast } = useToast();

  const designations = settings?.boardMemberDesignations || [];

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

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (selectedMember) {
        await updateBoardMember({ id: selectedMember._id, body: formData }).unwrap();
        toast({ title: "Success", description: "Board member updated successfully." });
      } else {
        await addBoardMember(formData).unwrap();
        toast({ title: "Success", description: "Board member created successfully." });
      }
      setModalOpen(false);
    } catch (error) {
      toast({ title: "Error", description: `Failed to ${selectedMember ? 'update' : 'create'} board member.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      await deleteBoardMember(selectedMember._id).unwrap();
      toast({ title: "Success", description: "Board member deleted successfully." });
      setDeleteModalOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete board member.", variant: "destructive" });
    }
  };
  
  const handleVisibilityChange = async (member: BoardMember, newVisibility: boolean) => {
    try {
      await updateBoardMember({ id: member._id, body: { visible: newVisibility } }).unwrap();
      toast({ title: "Success", description: `Visibility updated.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update visibility.", variant: "destructive" });
    }
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
                <TableHead>Joined On</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                        <h3 className="text-xl font-semibold">Error Loading Members</h3>
                        <p className="text-muted-foreground">Failed to load board members. Please try again.</p>
                        <Button onClick={() => refetch()} variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
              ) : currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} data-ai-hint="person avatar" alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{format(new Date(member.joinedAt), 'PPP')}</TableCell>
                    <TableCell>
                      <Switch
                        checked={member.visible}
                        onCheckedChange={(checked) => handleVisibilityChange(member, checked)}
                      />
                    </TableCell>
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
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <FileWarning className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Board Members Found</h3>
                            <p className="text-muted-foreground">Add a new board member to get started.</p>
                            <Button onClick={() => handleOpenModal()}>Add New Member</Button>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{members.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, members.length)}</strong> of <strong>{members.length}</strong> members
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || members.length === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || members.length === 0}
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
        designations={designations}
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
