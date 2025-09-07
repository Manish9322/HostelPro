import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockStudents, mockComplaints } from "@/lib/data";
import { format } from "date-fns";
import { User, Bed, MessageSquareWarning, CircleHelp } from "lucide-react";

export default function StudentDashboardPage() {
    const student = mockStudents[0]; // mock student data
    const studentComplaints = mockComplaints.slice(0, 2); // mock complaints

    return (
        <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.name}</div>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Room</CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.roomNumber}</div>
                        <p className="text-xs text-muted-foreground">{student.course}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Open Complaints</CardTitle>
                        <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentComplaints.filter(c => c.status !== 'Resolved').length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting resolution</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Hostel Notices</CardTitle>
                    <CardDescription>Stay updated with the latest announcements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-md border">
                        <h4 className="font-semibold mb-1">Upcoming Maintenance</h4>
                        <p className="text-sm text-muted-foreground">The water supply will be interrupted tomorrow from 10 AM to 12 PM for scheduled maintenance.</p>
                        <p className="text-xs text-muted-foreground mt-2">{format(new Date(), 'PP')}</p>
                    </div>
                     <div className="p-4 rounded-md border">
                        <h4 className="font-semibold mb-1">Movie Night: This Friday!</h4>
                        <p className="text-sm text-muted-foreground">Join us in the common room for a screening of a new blockbuster movie at 8 PM.</p>
                        <p className="text-xs text-muted-foreground mt-2">{format(new Date(), 'PP')}</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks at your fingertips.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                        <CircleHelp className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">File a Complaint</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                        <User className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">View Profile</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                        <Bed className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">Room Details</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                        <MessageSquareWarning className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">Track Complaints</span>
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
