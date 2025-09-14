
"use client";

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
import { CreditCard, Download, CircleDollarSign, AlertTriangle, RefreshCw } from "lucide-react";
import type { FeePayment, Student, Room } from "@/lib/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

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
    const [payments, setPayments] = useState<FeePayment[]>([]);
    const [upcomingPayment, setUpcomingPayment] = useState<FeePayment | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchPaymentData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const studentId = localStorage.getItem('loggedInStudentId');
            if (!studentId) throw new Error("No logged-in student found. Please log in again.");

            const studentsRes = await fetch('/api/students');
            if (!studentsRes.ok) throw new Error("Failed to fetch student data");
            const allStudents: Student[] = await studentsRes.json();
            const currentStudent = allStudents.find(s => s.studentId === studentId);
            setStudent(currentStudent || null);

            if (currentStudent) {
                const feesRes = await fetch(`/api/fees?studentId=${studentId}`);
                if (!feesRes.ok) throw new Error("Failed to fetch payment history");
                const paymentsData: FeePayment[] = await feesRes.json();
                setPayments(paymentsData);
                
                const upcoming = paymentsData.find(p => p.status === 'Pending' || p.status === 'Overdue');
                setUpcomingPayment(upcoming || null);

                if (currentStudent.roomNumber !== 'Unassigned') {
                    const roomsRes = await fetch('/api/rooms');
                    if (!roomsRes.ok) throw new Error("Failed to fetch room details");
                    const allRooms: Room[] = await roomsRes.json();
                    const currentRoom = allRooms.find(r => r.roomNumber === currentStudent.roomNumber);
                    setRoom(currentRoom || null);
                }
            } else {
                throw new Error("Could not find your student profile.");
            }
        } catch(err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPaymentData();
    }, []);

    const makePayment = async () => {
        if (!upcomingPayment) return;

        const res = await fetch("/api/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: upcomingPayment.amount, paymentId: upcomingPayment._id })
        });

        if (!res.ok) {
            toast({ title: "Error", description: "Failed to create payment order.", variant: "destructive" });
            return;
        }

        const data = await res.json();
        
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "HostelPro",
            description: `Payment for ${upcomingPayment.month}`,
            order_id: data.id,
            handler: async function (response: any) {
                try {
                    const verificationRes = await fetch("/api/razorpay", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentId: upcomingPayment._id
                        }),
                    });

                    const verificationData = await verificationRes.json();

                    if (verificationData.success) {
                        toast({ title: "Payment Successful", description: `Your payment for ${upcomingPayment.month} has been received.` });
                        fetchPaymentData();
                    } else {
                        toast({ title: "Payment Failed", description: "Your payment could not be verified.", variant: "destructive" });
                    }
                } catch(err) {
                    toast({ title: "Error", description: "An error occurred during payment verification.", variant: "destructive" });
                }
            },
            prefill: {
                name: student?.name,
                email: student?.email,
                contact: student?.phone,
            },
            notes: {
                address: "HostelPro Office",
            },
            theme: {
                color: "#222222",
            },
            config: {
                display: {
                    blocks: {
                        upi: {
                            name: "Pay with UPI",
                            instruments: [
                                { method: "upi" },
                                { method: "qr" },
                            ],
                        },
                        card: {
                            name: "Pay with Card",
                            instruments: [
                                { method: "card" },
                            ]
                        },
                        netbanking: {
                            name: "Netbanking"
                        },
                        wallet: {
                            name: "Wallets"
                        },
                    },
                    sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet"],
                    preferences: {
                        show_default_blocks: false,
                    },
                },
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

  return (
    <>
    <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
    />
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Payment</CardTitle>
                <CardDescription>
                Details for your next pending payment.
                </CardDescription>
            </CardHeader>
             {loading ? (
                <CardContent><Skeleton className="h-24" /></CardContent>
            ) : error ? (
                <CardContent>
                    <div className="text-center py-4 text-destructive">
                        <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                        <p>{error}</p>
                    </div>
                </CardContent>
            ) : upcomingPayment ? (
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-secondary/50 rounded-lg">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Due Date: <span className="font-semibold text-foreground">{format(new Date(upcomingPayment.dueDate), 'PPP')}</span></p>
                        <p className="text-2xl font-bold tracking-tight flex items-center gap-2"><CircleDollarSign className="w-6 h-6"/>{upcomingPayment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">For the month of {upcomingPayment.month}</p>
                    </div>
                    <Button className="mt-4 sm:mt-0" onClick={makePayment}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                    </Button>
                </CardContent>
            ) : (
                 <CardContent>
                    <p className="text-muted-foreground p-6 text-center">You have no outstanding payments. Well done!</p>
                </CardContent>
            )}
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
                {loading ? Array.from({length: 4}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                )) : payments.length > 0 ? (
                    payments.map((payment) => (
                        <TableRow key={payment._id}>
                            <TableCell className="font-medium">{payment._id.slice(-6).toUpperCase()}</TableCell>
                            <TableCell>{payment.month}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell><Badge variant={statusVariant(payment.status)}>{payment.status}</Badge></TableCell>
                            <TableCell>{payment.status === 'Paid' ? format(new Date(payment.dueDate), 'PPP') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="icon" disabled={payment.status !== 'Paid'}>
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download Invoice</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No payment history found.</TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
    </>
  );
}
