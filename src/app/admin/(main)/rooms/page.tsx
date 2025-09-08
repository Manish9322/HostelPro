
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { mockRooms } from "@/lib/data";
import { RoomModal } from "@/components/modals/room-modal";
import { ManageOccupantsModal } from "@/components/modals/manage-occupants-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";

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

const ITEMS_PER_PAGE = 7;

export default function RoomsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isRoomModalOpen, setRoomModalOpen] = useState(false);
    const [isOccupantModalOpen, setOccupantModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const totalPages = Math.ceil(mockRooms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRooms = mockRooms.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenRoomModal = (room = null) => {
        setSelectedRoom(room);
        setRoomModalOpen(true);
    };

    const handleOpenOccupantModal = (room: any) => {
        setSelectedRoom(room);
        setOccupantModalOpen(true);
    };

    const handleOpenDeleteModal = (room: any) => {
        setSelectedRoom(room);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        console.log("Deleting room:", selectedRoom);
        setDeleteModalOpen(false);
    };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Room Management</CardTitle>
            <CardDescription>
              View and manage hostel room details and availability.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={() => handleOpenRoomModal()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Room
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room No.</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Utilities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{`${room.occupancy}/${room.capacity}`}</TableCell>
                  <TableCell>
                    <Badge variant={roomStatusVariant(room.status)}>{room.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roomConditionVariant(room.condition)}>{room.condition}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.utilities.map(util => <Badge key={util} variant="outline" className="text-xs">{util}</Badge>)}
                    </div>
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
                        <DropdownMenuItem onClick={() => handleOpenRoomModal(room)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenOccupantModal(room)}>Manage Occupants</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDeleteModal(room)}>Delete</DropdownMenuItem>
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
            Showing <strong>{startIndex + 1}-{Math.min(endIndex, mockRooms.length)}</strong> of <strong>{mockRooms.length}</strong> rooms
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

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        room={selectedRoom}
      />
      <ManageOccupantsModal
        isOpen={isOccupantModalOpen}
        onClose={() => setOccupantModalOpen(false)}
        room={selectedRoom}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedRoom ? `Room ${(selectedRoom as any).roomNumber}`: ''}
      />
    </>
  );
}
