
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { RoomModal } from "@/components/modals/room-modal";
import { ManageOccupantsModal } from "@/components/modals/manage-occupants-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/lib/types";
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

const ITEMS_PER_PAGE = 7;

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRoomModalOpen, setRoomModalOpen] = useState(false);
    const [isOccupantModalOpen, setOccupantModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const { toast } = useToast();

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/rooms');
            if (!response.ok) throw new Error("Failed to fetch rooms");
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            setError("Failed to load rooms. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRooms = rooms.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenRoomModal = (room: Room | null = null) => {
        setSelectedRoom(room);
        setRoomModalOpen(true);
    };

    const handleOpenOccupantModal = (room: Room) => {
        setSelectedRoom(room);
        setOccupantModalOpen(true);
    };

    const handleOpenDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setDeleteModalOpen(true);
    };

    const handleFormSubmit = async (roomData: any) => {
        const method = selectedRoom ? 'PUT' : 'POST';
        const url = selectedRoom ? `/api/rooms?id=${selectedRoom._id}` : '/api/rooms';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData),
            });
            if (!response.ok) throw new Error(`Failed to ${selectedRoom ? 'update' : 'create'} room`);
            
            toast({ title: "Success", description: `Room ${selectedRoom ? 'updated' : 'created'} successfully.` });
            fetchRooms();
            setRoomModalOpen(false);
        } catch (error) {
            toast({ title: "Error", description: `Failed to ${selectedRoom ? 'update' : 'create'} room.`, variant: "destructive" });
        }
    };

    const handleDelete = async () => {
        if (!selectedRoom) return;
        try {
            const response = await fetch(`/api/rooms?id=${selectedRoom._id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete room');
            
            toast({ title: "Success", description: "Room deleted successfully." });
            fetchRooms();
            setDeleteModalOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete room.", variant: "destructive" });
        }
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
              {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                  ))
              ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                            <h3 className="text-xl font-semibold">Error Loading Rooms</h3>
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchRooms} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
              ) : currentRooms.length > 0 ? (
                currentRooms.map((room) => (
                  <TableRow key={room._id}>
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
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <FileWarning className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Rooms Found</h3>
                            <p className="text-muted-foreground">Add a new room to get started.</p>
                            <Button onClick={() => handleOpenRoomModal()}>Add New Room</Button>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{rooms.length > 0 ? startIndex + 1: 0}-{Math.min(endIndex, rooms.length)}</strong> of <strong>{rooms.length}</strong> rooms
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || rooms.length === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || rooms.length === 0}
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
        onSubmit={handleFormSubmit}
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
