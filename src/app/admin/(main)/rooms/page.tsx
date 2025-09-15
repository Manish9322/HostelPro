
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { MoreHorizontal, PlusCircle, AlertTriangle, FileWarning, RefreshCw, Search, Bed, CheckCircle, Wrench } from "lucide-react";
import { RoomModal } from "@/components/modals/room-modal";
import { ManageOccupantsModal } from "@/components/modals/manage-occupants-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [allRooms, setAllRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRoomModalOpen, setRoomModalOpen] = useState(false);
    const [isOccupantModalOpen, setOccupantModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const { toast } = useToast();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [conditionFilter, setConditionFilter] = useState('all');

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/rooms');
            if (!response.ok) throw new Error("Failed to fetch rooms");
            const data = await response.json();
            setAllRooms(data);
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
    
    const stats = useMemo(() => {
        const totalCapacity = allRooms.reduce((sum, room) => sum + room.capacity, 0);
        const totalOccupancy = allRooms.reduce((sum, room) => sum + room.occupancy, 0);
        return {
            total: allRooms.length,
            available: allRooms.filter(room => room.status === 'Available').length,
            maintenance: allRooms.filter(room => room.status === 'Under Maintenance').length,
            occupancyRate: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0,
        }
    }, [allRooms]);

    const filteredRooms = useMemo(() => {
        return allRooms
            .filter(room => {
                const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
                const matchesCondition = conditionFilter === 'all' || room.condition === conditionFilter;
                return matchesSearch && matchesStatus && matchesCondition;
            });
    }, [allRooms, searchQuery, statusFilter, conditionFilter]);


    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRooms = filteredRooms.slice(startIndex, endIndex);

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
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total rooms in the hostel</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.available}</div>
                <p className="text-xs text-muted-foreground">Ready for occupancy</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.maintenance}</div>
                <p className="text-xs text-muted-foreground">Temporarily unavailable</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Percentage of beds filled</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
            <div>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>
                View and manage hostel room details and availability.
                </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by room number..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-auto">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Occupied">Occupied</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={conditionFilter} onValueChange={setConditionFilter}>
                        <SelectTrigger className="w-full sm:w-auto">
                            <SelectValue placeholder="Filter by condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1" onClick={() => handleOpenRoomModal()}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Room
                        </span>
                    </Button>
                </div>
            </div>
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
                                <p className="text-muted-foreground">Add a new room or adjust your filters.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
            <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{filteredRooms.length > 0 ? startIndex + 1: 0}-{Math.min(endIndex, filteredRooms.length)}</strong> of <strong>{filteredRooms.length}</strong> rooms
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || filteredRooms.length === 0}
                >
                Previous
                </Button>
                <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || filteredRooms.length === 0}
                >
                Next
                </Button>
            </div>
            </CardFooter>
        </Card>
    </div>

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
        onUpdate={fetchRooms}
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
