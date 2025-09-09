
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
import { MoreHorizontal, PlusCircle, Box, Search, CheckCircle, AlertTriangle, FileWarning, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InventoryItemModal } from "@/components/modals/inventory-item-modal";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const conditionVariant = (condition: string) => {
  switch (condition) {
    case 'New':
    case 'Good':
      return 'default';
    case 'Used':
      return 'secondary';
    case 'Damaged':
      return 'destructive';
    default:
      return 'outline';
  }
};

const statusVariant = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'default';
      case 'In Use':
        return 'secondary';
      case 'Under Repair':
        return 'destructive';
      default:
        return 'outline';
    }
  };

const ITEMS_PER_PAGE = 7;

export default function InventoryPage() {
  const [allInventory, setAllInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setAllInventory(data);
    } catch (error) {
      setError("Failed to load inventory. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalItems = allInventory.length;
  const inUseItems = allInventory.filter(item => item.status === 'In Use').length;
  const damagedItems = allInventory.filter(item => item.condition === 'Damaged').length;
  
  const filteredInventory = useMemo(() => {
      return allInventory.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.location.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
          const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
          return matchesSearch && matchesStatus && matchesCondition;
      })
  }, [allInventory, searchQuery, statusFilter, conditionFilter]);

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredInventory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (item: InventoryItem | null = null) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (itemData: Omit<InventoryItem, '_id' | 'id'>) => {
    const method = selectedItem ? 'PUT' : 'POST';
    const url = selectedItem ? `/api/inventory?id=${selectedItem._id}` : '/api/inventory';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });
        if (!response.ok) throw new Error(`Failed to ${selectedItem ? 'update' : 'add'} item`);
        
        toast({ title: "Success", description: `Item ${selectedItem ? 'updated' : 'added'} successfully.` });
        fetchInventory();
        setModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: `Failed to ${selectedItem ? 'update' : 'add'} item.`, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
        const response = await fetch(`/api/inventory?id=${selectedItem._id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete item');
        
        toast({ title: "Success", description: "Item deleted successfully." });
        fetchInventory();
        setDeleteModalOpen(false);
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };
  

  return (
    <>
      <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Total assets tracked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items In Use</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inUseItems}</div>
              <p className="text-xs text-muted-foreground">Currently assigned to rooms/areas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Damaged Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{damagedItems}</div>
              <p className="text-xs text-muted-foreground">Requiring repair or replacement</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Inventory & Asset Management</CardTitle>
              <CardDescription>
                Track hostel assets, from room furniture to gym equipment.
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
               <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, category, or location..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="In Use">In Use</SelectItem>
                            <SelectItem value="Under Repair">Under Repair</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={conditionFilter} onValueChange={setConditionFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Filter by condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Used">Used</SelectItem>
                            <SelectItem value="Damaged">Damaged</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1" onClick={() => handleOpenModal()}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Item
                        </span>
                    </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : error ? (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                            <h3 className="text-xl font-semibold">Error Loading Inventory</h3>
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchInventory} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                ) : currentItems.length > 0 ? (
                    currentItems.map((item) => (
                    <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                        <Badge variant={conditionVariant(item.condition)}>{item.condition}</Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
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
                            <DropdownMenuItem onClick={() => handleOpenModal(item)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteModal(item)}>Delete</DropdownMenuItem>
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
                                <h3 className="text-xl font-semibold">No Inventory Found</h3>
                                <p className="text-muted-foreground">Add an item or adjust your filters.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
              <div className="text-xs text-muted-foreground">
                  Showing <strong>{filteredInventory.length > 0 ? startIndex + 1: 0}-{Math.min(endIndex, filteredInventory.length)}</strong> of <strong>{filteredInventory.length}</strong> items
              </div>
              <div className="ml-auto flex items-center gap-2">
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || filteredInventory.length === 0}
                  >
                      Previous
                  </Button>
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || filteredInventory.length === 0}
                  >
                      Next
                  </Button>
              </div>
          </CardFooter>
        </Card>
      </div>

      <InventoryItemModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedItem ? (selectedItem as any).name : ''}
      />
    </>
  );
}
