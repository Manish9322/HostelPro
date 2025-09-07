
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { MoreHorizontal, PlusCircle, Box, Search, CheckCircle, PackageSearch, AlertTriangle } from "lucide-react";
import { mockInventory } from "@/lib/data";
import { Input } from "@/components/ui/input";

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


export default function InventoryPage() {
  const totalItems = mockInventory.length;
  const inUseItems = mockInventory.filter(item => item.status === 'In Use').length;
  const damagedItems = mockInventory.filter(item => item.condition === 'Damaged').length;

  return (
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
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Inventory & Asset Management</CardTitle>
            <CardDescription>
              Track hostel assets, from room furniture to gym equipment.
            </CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-9" />
            </div>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Item
              </span>
            </Button>
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
              {mockInventory.map((item) => (
                <TableRow key={item.id}>
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
                        <DropdownMenuItem>Edit Item</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Damaged</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
