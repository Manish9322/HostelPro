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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { CreditCard, Download, CircleDollarSign } from "lucide-react";

const paymentHistory = [
  { id: 'inv-001', month: 'May 2024', amount: 500, status: 'Paid', date: new Date('2024-05-05') },
  { id: 'inv-002', month: 'April 2024', amount: 500, status: 'Paid', date: new Date('2024-04-04') },
  { id: 'inv-003', month: 'March 2024', amount: 500, status: 'Paid', date: new Date('2024-03-05') },
  { id: 'inv-004', month: 'February 2024', amount: 500, status: 'Paid', date: new Date('2024-02-05') },
];

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


export default function StudentPaymentsPage() {
  return (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Payment</CardTitle>
                <CardDescription>
                Details for your next payment.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-secondary/50 rounded-lg">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Due Date: <span className="font-semibold text-foreground">June 5, 2024</span></p>
                    <p className="text-2xl font-bold tracking-tight flex items-center gap-2"><CircleDollarSign className="w-6 h-6"/>500.00</p>
                    <p className="text-sm text-muted-foreground">For the month of June 2024</p>
                </div>
                <Button className="mt-4 sm:mt-0">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                </Button>
            </CardContent>
        </Card>

        <Card>
        <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
            A record of your past hostel fee payments.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Billing Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={statusVariant(payment.status)}>{payment.status}</Badge></TableCell>
                    <TableCell>{format(payment.date, 'PPP')}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download Invoice</span>
                        </Button>
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
