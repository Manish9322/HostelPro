import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockStudents } from "@/lib/data";
import { User, Mail, Phone, GraduationCap, Building, Pen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

export default function StudentProfilePage() {
  const student = mockStudents[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                    <AvatarImage src={student.avatar} data-ai-hint="person avatar" alt={student.name} />
                    <AvatarFallback className="text-2xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">{student.name}</CardTitle>
                    <CardDescription>Student ID: {student.studentId}</CardDescription>
                </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0">
                <Pen className="mr-2 h-4 w-4" />
                Edit Profile
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="my-6" />

        <div className="grid gap-8 md:grid-cols-2">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Contact Information</h3>
                <div className="space-y-4">
                    <InfoField icon={Mail} label="Email Address" value={student.email} />
                    <InfoField icon={Phone} label="Phone Number" value={student.phone} />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Academic & Hostel Details</h3>
                <div className="space-y-4">
                    <InfoField icon={GraduationCap} label="Course" value={student.course} />
                    <InfoField icon={Building} label="Room Number" value={student.roomNumber} />
                </div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
