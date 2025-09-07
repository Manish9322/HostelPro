
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
import { MoreHorizontal, PlusCircle, Search, FileText, CircleDollarSign, CheckCircle } from "lucide-react";
import { mockFeePayments } from "@/lib/data";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";

const statusVariant = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function FeesPage() {
  const totalRevenue = mockFeePayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingFees = mockFeePayments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (This Term)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total fees collected so far</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${outstandingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total overdue payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clearance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">of payments are on time</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Fee Management</CardTitle>
              <CardDescription>
                Track student payments, send reminders, and manage financial records.
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by student or ID..." className="pl-9" />
              </div>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Log Payment
                </span>
              </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Billing Month</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFeePayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>{payment.studentId}</TableCell>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell>{format(new Date(payment.dueDate), 'PPP')}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(payment.status)}>{payment.status}</Badge>
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
                        <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
