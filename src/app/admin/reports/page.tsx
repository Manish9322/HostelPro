import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting & Analytics</CardTitle>
        <CardDescription>
          Generate and export detailed reports on hostel operations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <BarChart className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold">Reporting Module</h3>
            <p>This section is under construction. Detailed analytics and exportable reports will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
