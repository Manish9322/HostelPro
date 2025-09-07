import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";

export default function FeesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Management</CardTitle>
        <CardDescription>
          Track student payments, send reminders, and manage financial records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <CircleDollarSign className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold">Fee Management Module</h3>
            <p>This section is under construction. Functionality to manage fees will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
